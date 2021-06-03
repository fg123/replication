#version 300 es

layout (location = 0) in vec2 v_texCoord;

uniform mat4 u_MVP;

out vec2 FragmentTexCoords;

void main() {
    gl_Position = u_MVP * vec4(v_texCoord.x, v_texCoord.y, 0, 1);

    FragmentTexCoords = v_texCoord;
}