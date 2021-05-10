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

struct Light {
    vec3 position;
    vec3 color;
};

uniform Light u_Lights[10];
uniform int u_NumLights;

in vec3 FragmentNormal;
in vec3 FragmentPos;
in vec2 FragmentTexCoords;
in mat3 FragmentTBN;

out vec4 OutputColor;

float AmbientIntensity = 0.01;

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
        vec3 lightDirection = normalize(u_Lights[i].position - FragmentPos);
        float lightAngle = max(dot(GetNormal(), lightDirection), 0.0);
        diffuseAccum += lightAngle * u_Lights[i].color;
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
        vec3 lightDirection = normalize(u_Lights[i].position - FragmentPos);
        vec3 viewDirection = normalize(u_ViewerPos - FragmentPos);
        float lightAngle = max(dot(GetNormal(), lightDirection), 0.0);
        if (lightAngle > 0.0) {
            // Halfway vector.
            vec3 h = normalize(viewDirection + lightAngle);
            float n_dot_h = max(dot(GetNormal(), h), 0.0);

            specularAccum += pow(n_dot_h, GetNs()) * u_Lights[i].color;
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
        if (result.a < 0.5) {
            discard;
        }
        OutputColor = vec4(result.rgb * diffuseAccum, 1);
        // OutputColor = vec4(1, 0, 0, 0.5);
    }
    else if (u_Material.illum == 0) {
        OutputColor = vec4(GetKd(), GetD());
    }
    else {
        if (u_Material.illum == 1) {
            OutputColor = vec4(AmbientIntensity * GetKa()
                + GetKd() * diffuseAccum, GetD());
        }
        else {
            vec3 specularAccum = GetSpecularAccumulation();

            if (u_Material.illum == 2) {
                OutputColor = vec4(AmbientIntensity * GetKa()
                    + GetKd() * diffuseAccum
                    + GetKs() * specularAccum, GetD());
                // OutputColor = vec4(1,1,1,1);
            }
        }
    }

    // OutputColor = vec4(1,1,1,1);
    // OutputColor = vec4(u_Lights[0].position, 1);
    // OutputColor = vec4(0.5, 0.5, 0.5, 1);
}