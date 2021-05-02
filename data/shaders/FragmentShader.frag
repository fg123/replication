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
    // No Maps for now
};

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

out vec4 OutputColor;

float AmbientIntensity = 0.05;

void main() {
    if (u_Material.illum == 0) {
        OutputColor = vec4(u_Material.Kd, 1);
    }
    else {
        vec3 diffuseAccum = vec3(0.0);
        for (int i = 0; i < u_NumLights; i++) {
            vec3 lightDirection = normalize(u_Lights[i].position - FragmentPos);
            float lightAngle = max(dot(FragmentNormal, lightDirection), 0.0);
            diffuseAccum += lightAngle * u_Lights[i].color;
        }

        if (u_Material.illum == 1) {
            OutputColor = vec4(AmbientIntensity * u_Material.Ka
                + u_Material.Kd * diffuseAccum, 1);
        }
        else {
            vec3 specularAccum = vec3(0.0);
            for (int i = 0; i < u_NumLights; i++) {
                vec3 lightDirection = normalize(u_Lights[i].position - FragmentPos);
                vec3 viewDirection = normalize(u_ViewerPos - FragmentPos);
                float lightAngle = max(dot(FragmentNormal, lightDirection), 0.0);
                if (lightAngle > 0.0) {
                    // Halfway vector.
                    vec3 h = normalize(viewDirection + lightAngle);
                    float n_dot_h = max(dot(FragmentNormal, h), 0.0);

                    specularAccum += pow(n_dot_h, u_Material.Ns) * u_Lights[i].color;
                }
            }

            if (u_Material.illum == 2) {
                OutputColor = vec4(AmbientIntensity * u_Material.Ka
                    + u_Material.Kd * diffuseAccum
                    + u_Material.Ks * specularAccum, 1);
                // OutputColor = vec4(1,1,1,1);
            }
        }
    }

    // OutputColor = vec4(1,1,1,1);
    // OutputColor = vec4(u_Lights[0].position, 1);
    // OutputColor = vec4(0.5, 0.5, 0.5, 1);
}