#version 300 es
precision highp float;

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

uniform vec3 u_OutlineColor;

uniform sampler2D u_shadowMap[10];

uniform bool u_RenderShadows;

in vec3 FragmentNormal;
in vec3 FragmentPos;
in vec2 FragmentTexCoords;
in mat3 FragmentTBN;
in vec3 FragmentPosClipSpace;
flat in float FragmentOutline;

layout(location = 0) out vec3 gbuf_position;
layout(location = 1) out vec3 gbuf_normal;
layout(location = 2) out vec4 gbuf_diffuse;
layout(location = 3) out vec4 gbuf_specular;

vec3 GetNormal() {
    if (u_Material.hasBumpMap == 1) {
        vec3 normal = texture(u_map_bump, FragmentTexCoords).rgb;
        normal = normal * 2.0 - 1.0;
        return normalize(FragmentTBN * normal);
    }
    return FragmentNormal;
}

vec3 GetKd() {
    if (u_Material.hasKdMap == 1) {
        return texture(u_map_Kd, FragmentTexCoords).rgb;
    }
    return u_Material.Kd;
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


vec3 GetKs() {
    if (u_Material.hasKdMap == 1) {
        return texture(u_map_Ks, FragmentTexCoords).rgb;
    }
    return u_Material.Ks;
}

void main() {
    gbuf_position = FragmentPos;
    gbuf_normal = GetNormal();

    if (FragmentOutline > 0.0) {
        gbuf_diffuse = vec4(u_OutlineColor, 1);
        return;
    }

    gbuf_diffuse.rgb = GetKd();
    gbuf_diffuse.a = GetD();
    gbuf_specular.rgb = GetKs();
    gbuf_specular.a = GetNs();
}