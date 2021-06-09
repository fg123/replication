#version 300 es
precision highp float;

float PI = 3.1415926535;

float rand(vec2 c){
	return fract(sin(dot(c.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float noise(vec2 p, float pixel){
	vec2 ij = floor(p/pixel);
	vec2 xy = mod(p,pixel)/pixel;
	//xy = 3.*xy*xy-2.*xy*xy*xy;
	xy = .5*(1.-cos(PI*xy));
	float a = rand((ij+vec2(0.,0.)));
	float b = rand((ij+vec2(1.,0.)));
	float c = rand((ij+vec2(0.,1.)));
	float d = rand((ij+vec2(1.,1.)));
	float x1 = mix(a, b, xy.x);
	float x2 = mix(c, d, xy.x);
	return mix(x1, x2, xy.y);
}

struct Material {
    vec3 Ka;
    vec3 Kd;
    vec3 Ks;
    float Ns;
    float Ni;
    float d;
    int illum;

    int hasKaMap;
    int hasKdMap;
    int hasKsMap;
    int hasNsMap;
    int hasdMap;
    int hasBumpMap;
    int hasReflMap;
};

uniform sampler2D u_map_Ka;
uniform sampler2D u_map_Kd;
uniform sampler2D u_map_Ks;
uniform sampler2D u_map_Ns;
uniform sampler2D u_map_d;
uniform sampler2D u_map_bump;
uniform sampler2D u_map_refl;

uniform Material u_Material;
uniform vec3 u_ViewerPos;

struct Light {
    vec3 position;
    vec3 color;
    mat4 depthBiasMVPNear;
    mat4 depthBiasMVPMid;
    mat4 depthBiasMVPFar;
};

uniform Light u_Lights[10];
uniform sampler2D u_shadowMap[10];

uniform float u_RandSeed;

uniform int u_NumLights;

uniform bool u_RenderShadows;

in vec3 FragmentNormal;
in vec3 FragmentPos;
in vec2 FragmentTexCoords;
in mat3 FragmentTBN;
in vec3 FragmentPosClipSpace;

out vec4 OutputColor;

float AmbientIntensity = 0.5;


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

float pixel = 1.f / 1024.f;

// The shadow map is 2048x2048 as it contains 3 mappings
float GetAttenuationAtPoint(int i, vec4 shadowCoord, vec2 offset, float bias, int samples) {
    vec3 shadowCoordNorm = shadowCoord.xyz / shadowCoord.w;
    shadowCoordNorm.x *= 0.5;
    shadowCoordNorm.y *= 0.5;

    // shadowCoord = shadowCoord / shadowCoord.w;
    // return texture(u_map_Ka, shadowCoord.xy).z < shadowCoord.z;

    // Do a 3x3 filtering
    float shadowAttenuation = 0.f;

    vec3 lightDirection = normalize(u_Lights[i].position - FragmentPos);

    for (int dy = -samples; dy <= samples; dy++) {
        for (int dx = -samples; dx <= samples; dx++) {
            vec2 uv = shadowCoordNorm.xy + vec2(float(dx) * pixel, float(dy) * pixel);
            // Shift to choose the right location for the map sampling

            // Jitter uv
            // uv.x += ((noise(uv, 0.00001) - 0.5)) * pixel;
            // uv.y += ((noise(uv, 0.00001) - 0.5)) * pixel;

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
    // return min(GetAttenuationAtPoint(i, shadowCoordNear, 0.0, 0.0),
    //     GetAttenuationAtPoint(i, shadowCoordFar, 0.5, 0.001));

    // return GetAttenuationAtPoint(i, shadowCoordFar, 0.5, 0.001);
    // return GetAttenuationAtPoint(i, shadowCoordFar, 0.5, farBias);

    // vec4 shadowCoordNearNorm = shadowCoordNear / shadowCoordNear.w;
    // shadowCoordNearNorm.x *= 0.5;

    float nearAtten = GetAttenuationAtPoint(i, shadowCoordNear, vec2(0.0, 0.0), 0.001, 2);
    float midAtten = GetAttenuationAtPoint(i, shadowCoordMid, vec2(0.5, 0.0), midBias, 2);
    float farAtten = GetAttenuationAtPoint(i, shadowCoordFar, vec2(0.0, 0.5), farBias, 3);

    float z = abs(FragmentPosClipSpace.z);
    if (z < 20.0) {
        return nearAtten;
    }
    else if (z < 30.0) {
        return mix(nearAtten, midAtten, clamp((z - 20.0) / 10.0, 0.0, 1.0));
    }
    else if (z < 70.0) {
        return midAtten;
    }
    else if (z < 80.0) {
        return mix(midAtten, farAtten, clamp((z - 70.0) / 10.0, 0.0, 1.0));
    }
    else {
        return farAtten;
    }
    // float atten = GetAttenuationAtPoint(i, shadowCoordNear, 0.0, 0.0);
    // if (atten >= 1.f) {
    //     atten = GetAttenuationAtPoint(i, shadowCoordFar, 0.5, 0.001);
    // }
    // return atten;

    // return GetAttenuationAtPoint(i, shadowCoordFar, 0.5, 0.1);
    // return max(GetAttenuationAtPoint(i, shadowCoordNear, 0.0, 0.0001), GetAttenuationAtPoint(i, shadowCoordFar, 0.5));
}

vec3 GetNormal() {
    if (u_Material.hasBumpMap == 1) {
        vec3 normal = texture(u_map_bump, FragmentTexCoords).rgb;
        normal = normal * 2.0 - 1.0;
        return normalize(FragmentTBN * normal);
    }
    return FragmentNormal;
}

vec3 GetDiffuseAccumulation() {
    vec3 diffuseAccum = vec3(0.0);
    for (int i = 0; i < u_NumLights; i++) {
        float shadow = GetShadowAttenuation(i);
        vec3 lightDirection = normalize(u_Lights[i].position - FragmentPos);
        float lightAngle = max(dot(GetNormal(), lightDirection), 0.0);
        diffuseAccum += shadow * lightAngle * u_Lights[i].color;
    }
    return diffuseAccum;
}


float GetNs() {
    if (u_Material.hasNsMap == 1) {
        return float(texture(u_map_Ns, FragmentTexCoords));
    }
    return u_Material.Ns;
}

float GetD() {
    if (u_Material.hasdMap == 1) {
        return float(texture(u_map_d, FragmentTexCoords));
    }
    return u_Material.d;
}

vec3 GetSpecularAccumulation() {
    vec3 specularAccum = vec3(0.0);
    for (int i = 0; i < u_NumLights; i++) {
        float shadow = GetShadowAttenuation(i);
        vec3 lightDirection = normalize(u_Lights[i].position - FragmentPos);
        vec3 viewDirection = normalize(u_ViewerPos - FragmentPos);
        float lightAngle = max(dot(GetNormal(), lightDirection), 0.0);
        if (lightAngle > 0.0) {
            // Halfway vector.
            vec3 h = normalize(viewDirection + lightAngle);
            float n_dot_h = max(dot(GetNormal(), h), 0.0);

            specularAccum += shadow * pow(n_dot_h, GetNs()) * u_Lights[i].color;
        }
    }
    return specularAccum;
}

vec3 GetKa() {
    if (u_Material.hasKaMap == 1) {
        return texture(u_map_Ka, FragmentTexCoords).rgb;
    }
    return u_Material.Ka;
}

vec3 GetKd() {
    if (u_Material.hasKdMap == 1) {
        return texture(u_map_Kd, FragmentTexCoords).rgb;
    }
    return u_Material.Kd;
}

vec3 GetKs() {
    if (u_Material.hasKdMap == 1) {
        return texture(u_map_Ks, FragmentTexCoords).rgb;
    }
    return u_Material.Ks;
}

void main() {
    vec3 diffuseAccum = GetDiffuseAccumulation();

    if (u_Material.illum == -1) {
        // Custom Model For 2D Sprite
        vec4 result = texture(u_map_Kd, FragmentTexCoords);
        OutputColor = vec4(result.rgb * diffuseAccum, result.a);
        // OutputColor = vec4(1, 0, 0, 0.5);
    }
    else if (u_Material.illum == 0) {
        OutputColor = vec4(GetKd(), GetD());
    }
    else {
        if (u_Material.illum == 1) {
            OutputColor = vec4(AmbientIntensity * GetKd()
                + GetKd() * diffuseAccum, GetD());
        }
        else {
            vec3 specularAccum = GetSpecularAccumulation();

            if (u_Material.illum >= 2) {
                OutputColor = vec4(AmbientIntensity * GetKd()
                    + GetKd() * diffuseAccum
                    + GetKs() * specularAccum, GetD());
                // OutputColor = vec4(1,1,1,1);
            }
        }
    }

    // vec4 shadowCoord = u_Lights[0].depthBiasMVP * vec4(FragmentPos, 1);
    // vec3 shadowCoordNorm = shadowCoord.xyz / shadowCoord.w;
    // float zVal = texture(u_shadowMap[0], shadowCoordNorm.xy).r;
    // // zVal = shadowCoord.z;
    // OutputColor = vec4(zVal, zVal, zVal, 1);

    // OutputColor = vec4(texture(u_shadowMap[0], uv).r, 1);

    // OutputColor = vec4(1,1,1,1);
    // OutputColor = vec4(u_Lights[0].position, 1);
    // OutputColor = vec4(0.5, 0.5, 0.5, 1);
}