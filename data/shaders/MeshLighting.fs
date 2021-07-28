
precision highp float;

out vec4 OutputColor;

uniform sampler2D gbuf_position;
uniform sampler2D gbuf_normal;
uniform sampler2D gbuf_diffuse;
uniform sampler2D gbuf_specular;

struct Light {
    int type;

    // For Cone Light
    vec3 coneDirection;
    float height;
    float baseRadius;


    vec3 position;
    vec3 color;
    int shadowMapSize;
    mat4 depthBiasMVPNear;
    mat4 depthBiasMVPMid;
    mat4 depthBiasMVPFar;
};

uniform vec2 u_ViewportSize;

uniform mat4 u_View;
uniform vec3 u_ViewerPos;
uniform Light u_Light;
uniform sampler2D u_shadowMap;
uniform bool u_RenderShadows;

const float nearBound = 10.0;
const float middleBound = 50.0;
const float shadowTransitionZone = 5.0;

// Retreived from maps
vec3 FragmentPos;
vec3 FragmentNormal;
vec3 FragmentPosClipSpace;
float SpecularFactor;

bool IsPointInLightCone(vec3 point) {
    float cone_dist = dot(point - u_Light.position, u_Light.coneDirection);

    if (cone_dist < 0.0 || cone_dist > u_Light.height) {
        return false;
    }

    float cone_radius = (cone_dist / u_Light.height) * u_Light.baseRadius;
    float orth_distance = length((point - u_Light.position) - cone_dist * u_Light.coneDirection);

    return (orth_distance < cone_radius);
}

float random(vec2 p) {
    vec2 K1 = vec2(
        23.14069263277926, // e^pi (Gelfond's constant)
         2.665144142690225 // 2^sqrt(2) (Gelfondâ€“Schneider constant)
    );
    return fract( cos( dot(p,K1) ) * 12345.6789 );
}

bool InRange(vec2 uv) {
    return uv.x >= 0.f && uv.x <= 0.5 && uv.y >= 0.f && uv.y <= 0.5;
}

float QueryMap(in sampler2D shadowMap, vec2 xy, vec2 offset) {
    if (!InRange(xy)) {
        return 1.f;
    }
    xy += offset;
    return texture(shadowMap, xy).r;
}

// The shadow map is 2048x2048 as it contains 3 mappings
float GetAttenuationAtPoint(vec4 shadowCoord, vec2 offset, float bias, int samples, bool useJitter) {
    float pixel = 1.f / float(u_Light.shadowMapSize);
    vec3 shadowCoordNorm = shadowCoord.xyz / shadowCoord.w;
    shadowCoordNorm.x *= 0.5;
    shadowCoordNorm.y *= 0.5;

    // Do a 3x3 filtering
    float shadowAttenuation = 0.f;

    vec3 lightDirection = normalize(u_Light.position - FragmentPos);

    for (int dy = -samples; dy <= samples; dy++) {
        for (int dx = -samples; dx <= samples; dx++) {
            vec2 uv = shadowCoordNorm.xy + vec2(float(dx) * pixel, float(dy) * pixel);
            // Shift to choose the right location for the map sampling

            // Jitter uv

            // if (useJitter) {
                // uv.x += ((random(uv) - 0.5)) * pixel;
                // uv.y += ((random(uv) - 0.5)) * pixel;
            // }

            shadowAttenuation += QueryMap(u_shadowMap, uv, offset) + bias < shadowCoord.z ? 0.f : 1.f; break;
        }
    }
    return shadowAttenuation / pow(float(2 * samples + 1), 2.0);
}

float GetShadowAttenuation() {
    if (!u_RenderShadows || u_Light.shadowMapSize == 0) return 1.0;
    vec4 shadowCoordNear = u_Light.depthBiasMVPNear * vec4(FragmentPos, 1);
    vec4 shadowCoordMid = u_Light.depthBiasMVPMid * vec4(FragmentPos, 1);
    vec4 shadowCoordFar = u_Light.depthBiasMVPFar * vec4(FragmentPos, 1);

    vec3 lightDirection = normalize(u_Light.position - FragmentPos);
    float farBias = max(0.08 * (1.0 - dot(FragmentNormal, lightDirection)), 0.01);
    float midBias = max(0.01 * (1.0 - dot(FragmentNormal, lightDirection)), 0.001);
    float nearBias = max(0.001 * (1.0 - dot(FragmentNormal, lightDirection)), 0.0001);
    // return min(GetAttenuationAtPoint(i, shadowCoordNear, 0.0, 0.0),
    //     GetAttenuationAtPoint(i, shadowCoordFar, 0.5, 0.001));

    // return GetAttenuationAtPoint(i, shadowCoordFar, 0.5, 0.001);
    // return GetAttenuationAtPoint(i, shadowCoordFar, 0.5, farBias);

    // vec4 shadowCoordNearNorm = shadowCoordNear / shadowCoordNear.w;
    // shadowCoordNearNorm.x *= 0.5;

    float nearAtten = GetAttenuationAtPoint(shadowCoordNear, vec2(0.0, 0.0), nearBias, 2, false);
    float midAtten = GetAttenuationAtPoint(shadowCoordMid, vec2(0.5, 0.0), midBias, 1, false);
    float farAtten = GetAttenuationAtPoint(shadowCoordFar, vec2(0.0, 0.5), farBias, 1, false);

    float z = abs(FragmentPosClipSpace.z);
    if (z < nearBound - shadowTransitionZone) {
        return nearAtten;
    }
    else if (z < nearBound) {
        return mix(nearAtten, midAtten, clamp((z - (nearBound - shadowTransitionZone)) / shadowTransitionZone, 0.0, 1.0));
    }
    else if (z < middleBound - shadowTransitionZone) {
        return midAtten;
    }
    else if (z < middleBound) {
        return mix(midAtten, farAtten, clamp((z - (middleBound - shadowTransitionZone)) / shadowTransitionZone, 0.0, 1.0));
    }
    else {
        return farAtten;
    }
}

vec3 GetDiffuseAccumulation() {
    vec3 diffuseAccum = vec3(0.0);
    float shadow = GetShadowAttenuation();
    vec3 lightDirection = normalize(u_Light.position - FragmentPos);
    float lightAngle = max(dot(FragmentNormal, lightDirection), 0.0);
    diffuseAccum += shadow * lightAngle * u_Light.color;
    return diffuseAccum;
}

vec3 GetSpecularAccumulation() {
    vec3 specularAccum = vec3(0.0);
    float shadow = GetShadowAttenuation();
    vec3 lightDirection = normalize(u_Light.position - FragmentPos);
    vec3 viewDirection = normalize(u_ViewerPos - FragmentPos);
    float lightAngle = max(dot(FragmentNormal, lightDirection), 0.0);
    if (lightAngle > 0.0) {
        // Halfway vector.
        vec3 h = normalize(viewDirection + lightAngle);
        float n_dot_h = max(dot(FragmentNormal, h), 0.0);

        specularAccum += shadow * pow(n_dot_h, SpecularFactor) * u_Light.color;
    }
    return specularAccum;
}

void main()
{
    // retrieve data from G-buffer
    // OutputColor = vec4(FragmentTexCoords.x, FragmentTexCoords.y, 1.0, 1.0);
    // return;
    // if (u_Light.shadowMapSize == 0) {
    //     OutputColor = vec4(1, 0, 0, 1.0);
    //     return;
    // }
    vec2 FragmentTexCoords = gl_FragCoord.xy / u_ViewportSize;
    FragmentPos = texture(gbuf_position, FragmentTexCoords).rgb;
    FragmentNormal = texture(gbuf_normal, FragmentTexCoords).rgb;
    FragmentPosClipSpace = vec3(u_View * vec4(FragmentPos, 1.0));
    SpecularFactor = texture(gbuf_specular, FragmentTexCoords).a;

    if (u_Light.type == 1) {
        if (!IsPointInLightCone(FragmentPos)) {
            OutputColor = vec4(0.0, 0.0, 0.0, 0.0);
            return;
        }
    }

    // This is fully additive factors on top of ambient base color
    vec3 Diffuse = texture(gbuf_diffuse, FragmentTexCoords).rgb;
    vec3 Specular = texture(gbuf_specular, FragmentTexCoords).rgb;

    vec3 diffuseAccum = GetDiffuseAccumulation();
    vec3 specularAccum = GetSpecularAccumulation();
    OutputColor = vec4(Diffuse * diffuseAccum
                    + Specular * specularAccum, 1.0);
}

