#version 300 es

precision highp float;

in vec3 FragmentNormal;
in vec3 FragmentPos;

out vec4 OutputColor;


void main() {
    // Just set the output to a constant reddish-purple
    vec3 color = vec3(0.9, 0.9, 0.9);
    vec3 lightPos = vec3(-10, 10, -10);
    vec3 lightPos2 = vec3(10, 10, 10);
    vec3 lightColor = vec3(1, 1, 1);

    vec3 lightDir = normalize(lightPos - FragmentPos);
    float lightAngle = max(dot(FragmentNormal, lightDir), 0.0);
    vec3 diffuse = (lightAngle * lightColor);

    vec3 lightDir2 = normalize(lightPos2 - FragmentPos);
    float lightAngle2 = max(dot(FragmentNormal, lightDir2), 0.0);
    vec3 diffuse2 = (lightAngle2 * lightColor);
    OutputColor = vec4((vec3(0.1, 0.1, 0.1) + diffuse + diffuse2) * color, 1);
}