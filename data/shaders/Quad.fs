#version 300 es

precision highp float;

uniform sampler2D u_texture;

in vec2 FragmentTexCoords;

out vec4 OutputColor;

void main() {
    OutputColor = texture(u_texture, FragmentTexCoords);
}