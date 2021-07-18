#version 300 es

precision highp float;

out vec4 OutputColor;

in vec2 FragmentTexCoords;

uniform sampler2D gbuf_position;
uniform sampler2D gbuf_normal;
uniform sampler2D gbuf_diffuse;
uniform sampler2D gbuf_specular;

struct Light {
    vec3 position;
    vec3 color;
    mat4 depthBiasMVPNear;
    mat4 depthBiasMVPMid;
    mat4 depthBiasMVPFar;
};

uniform mat4 u_View;
uniform vec3 u_ViewerPos;
uniform Light u_Lights[10];
uniform sampler2D u_shadowMap[10];
uniform int u_NumLights;
uniform bool u_RenderShadows;

const float AmbientIntensity = 0.5;

const float nearBound = 10.0;
const float middleBound = 50.0;
const float shadowTransitionZone = 5.0;

// Retreived from maps
vec3 FragmentPos;
vec3 FragmentNormal;
vec3 FragmentPosClipSpace;
float SpecularFactor;

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

float pixel = 1.f / 2048.f;

// The shadow map is 2048x2048 as it contains 3 mappings
float GetAttenuationAtPoint(int i, vec4 shadowCoord, vec2 offset, float bias, int samples, bool useJitter) {
    vec3 shadowCoordNorm = shadowCoord.xyz / shadowCoord.w;
    shadowCoordNorm.x *= 0.5;
    shadowCoordNorm.y *= 0.5;

    // Do a 3x3 filtering
    float shadowAttenuation = 0.f;

    vec3 lightDirection = normalize(u_Lights[i].position - FragmentPos);

    for (int dy = -samples; dy <= samples; dy++) {
        for (int dx = -samples; dx <= samples; dx++) {
            vec2 uv = shadowCoordNorm.xy + vec2(float(dx) * pixel, float(dy) * pixel);
            // Shift to choose the right location for the map sampling

            // Jitter uv

            // if (useJitter) {
                uv.x += ((random(uv) - 0.5)) * pixel;
                uv.y += ((random(uv) - 0.5)) * pixel;
            // }

            switch (i) {
                case 0: shadowAttenuation += QueryMap(u_shadowMap[0], uv, offset) + bias < shadowCoord.z ? 0.f : 1.f; break;
                case 1: shadowAttenuation += QueryMap(u_shadowMap[1], uv, offset) + bias < shadowCoord.z ? 0.f : 1.f; break;
                case 2: shadowAttenuation += QueryMap(u_shadowMap[2], uv, offset) + bias < shadowCoord.z ? 0.f : 1.f; break;
                case 3: shadowAttenuation += QueryMap(u_shadowMap[3], uv, offset) + bias < shadowCoord.z ? 0.f : 1.f; break;
                case 4: shadowAttenuation += QueryMap(u_shadowMap[4], uv, offset) + bias < shadowCoord.z ? 0.f : 1.f; break;
                case 5: shadowAttenuation += QueryMap(u_shadowMap[5], uv, offset) + bias < shadowCoord.z ? 0.f : 1.f; break;
                case 6: shadowAttenuation += QueryMap(u_shadowMap[6], uv, offset) + bias < shadowCoord.z ? 0.f : 1.f; break;
                case 7: shadowAttenuation += QueryMap(u_shadowMap[7], uv, offset) + bias < shadowCoord.z ? 0.f : 1.f; break;
                case 8: shadowAttenuation += QueryMap(u_shadowMap[8], uv, offset) + bias < shadowCoord.z ? 0.f : 1.f; break;
                case 9: shadowAttenuation += QueryMap(u_shadowMap[9], uv, offset) + bias < shadowCoord.z ? 0.f : 1.f; break;
            }
        }
    }
    return shadowAttenuation / pow(float(2 * samples + 1), 2.0);
}

float GetShadowAttenuation(int i) {
    if (!u_RenderShadows) return 1.0;
    vec4 shadowCoordNear = u_Lights[i].depthBiasMVPNear * vec4(FragmentPos, 1);
    vec4 shadowCoordMid = u_Lights[i].depthBiasMVPMid * vec4(FragmentPos, 1);
    vec4 shadowCoordFar = u_Lights[i].depthBiasMVPFar * vec4(FragmentPos, 1);

    vec3 lightDirection = normalize(u_Lights[i].position - FragmentPos);
    float farBias = max(0.08 * (1.0 - dot(FragmentNormal, lightDirection)), 0.01);
    float midBias = max(0.01 * (1.0 - dot(FragmentNormal, lightDirection)), 0.001);
    float nearBias = max(0.001 * (1.0 - dot(FragmentNormal, lightDirection)), 0.0001);
    // return min(GetAttenuationAtPoint(i, shadowCoordNear, 0.0, 0.0),
    //     GetAttenuationAtPoint(i, shadowCoordFar, 0.5, 0.001));

    // return GetAttenuationAtPoint(i, shadowCoordFar, 0.5, 0.001);
    // return GetAttenuationAtPoint(i, shadowCoordFar, 0.5, farBias);

    // vec4 shadowCoordNearNorm = shadowCoordNear / shadowCoordNear.w;
    // shadowCoordNearNorm.x *= 0.5;

    float nearAtten = GetAttenuationAtPoint(i, shadowCoordNear, vec2(0.0, 0.0), nearBias, 2, false);
    float midAtten = GetAttenuationAtPoint(i, shadowCoordMid, vec2(0.5, 0.0), midBias, 1, false);
    float farAtten = GetAttenuationAtPoint(i, shadowCoordFar, vec2(0.0, 0.5), farBias, 1, false);

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
    for (int i = 0; i < u_NumLights; i++) {
        float shadow = GetShadowAttenuation(i);
        vec3 lightDirection = normalize(u_Lights[i].position - FragmentPos);
        float lightAngle = max(dot(FragmentNormal, lightDirection), 0.0);
        diffuseAccum += shadow * lightAngle * u_Lights[i].color;
    }
    return diffuseAccum;
}

vec3 GetSpecularAccumulation() {
    vec3 specularAccum = vec3(0.0);
    for (int i = 0; i < u_NumLights; i++) {
        float shadow = GetShadowAttenuation(i);
        vec3 lightDirection = normalize(u_Lights[i].position - FragmentPos);
        vec3 viewDirection = normalize(u_ViewerPos - FragmentPos);
        float lightAngle = max(dot(FragmentNormal, lightDirection), 0.0);
        if (lightAngle > 0.0) {
            // Halfway vector.
            vec3 h = normalize(viewDirection + lightAngle);
            float n_dot_h = max(dot(FragmentNormal, h), 0.0);

            specularAccum += shadow * pow(n_dot_h, SpecularFactor) * u_Lights[i].color;
        }
    }
    return specularAccum;
}

void main()
{
    // retrieve data from G-buffer
    FragmentPos = texture(gbuf_position, FragmentTexCoords).rgb;
    FragmentNormal = texture(gbuf_normal, FragmentTexCoords).rgb;
    FragmentPosClipSpace = vec3(u_View * vec4(FragmentPos, 1.0));
    SpecularFactor = texture(gbuf_specular, FragmentTexCoords).a;

    vec3 Diffuse = texture(gbuf_diffuse, FragmentTexCoords).rgb;
    vec3 Specular = texture(gbuf_specular, FragmentTexCoords).rgb;

    // then calculate lighting as usual
    // vec3 lighting = Albedo * AmbientIntensity;
    // vec3 viewDir = normalize(u_ViewerPos - FragPos);
    // for(int i = 0; i < u_NumLights; ++i)
    // {
    //     // diffuse
    //     vec3 lightDir = normalize(u_Lights[i].position - FragPos);
    //     vec3 diffuse = max(dot(Normal, lightDir), 0.0) * Albedo * u_Lights[i].color;
    //     lighting += diffuse;
    // }

    // OutputColor = vec4(lighting, 1.0);

    vec3 diffuseAccum = GetDiffuseAccumulation();
    vec3 specularAccum = GetSpecularAccumulation();
    OutputColor = vec4(AmbientIntensity * Diffuse
                    + Diffuse * diffuseAccum
                    + Specular * specularAccum, 1.0);
}

