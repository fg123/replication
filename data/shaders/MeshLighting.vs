#version 300 es

uniform mat4 u_Projection;
uniform mat4 u_View;
uniform mat4 u_Model;

layout (location = 0) in vec3 v_position;

out vec2 FragmentTexCoords;

void main() {
  // gl_Position = vec4(v_position, 1.0);

  gl_Position = u_Projection * u_View * u_Model * vec4(v_position, 1.0);

  FragmentTexCoords = (gl_Position.xy + 1.0) * 0.5;
}