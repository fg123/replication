#version 300 es

uniform mat4 u_Projection;
uniform mat4 u_View;
uniform mat4 u_Model;

layout (location = 0) in vec3 v_position;

void main() {
    gl_Position = u_Projection * u_View * u_Model * vec4(v_position, 1.0);
}