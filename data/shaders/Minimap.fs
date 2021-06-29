#version 300 es

precision highp float;

uniform sampler2D u_texture;
uniform vec2 u_textureSize;

in vec2 FragmentTexCoords;

out vec4 OutputColor;

vec4 samplePoint(vec2 point) {
    if (distance(point, vec2(0.5, 0.5)) > 0.5) {
        return vec4(0, 0, 0, 0);
    }
    return texture(u_texture, point);
}

void main() {
    float textile = 1.0 / u_textureSize.x;
    vec4 totalColor;
    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            totalColor += samplePoint(
                vec2(FragmentTexCoords.x + float(x) * textile,
                        FragmentTexCoords.y + float(y) * textile));
        }
    }
    OutputColor = totalColor / 9.0;
}