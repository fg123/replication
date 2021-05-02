#version 300 es

uniform mat4 u_Projection;
uniform mat4 u_View;
uniform mat4 u_Model;

layout (location = 0) in vec3 v_position;
layout (location = 1) in vec3 v_normal;
layout (location = 2) in vec2 v_texCoords;

out vec3 FragmentNormal;
out vec3 FragmentPos;
out vec2 FragmentTexCoords;

void main() {
  gl_Position = u_Projection * u_View * u_Model * vec4(v_position, 1.0);
  // gl_Position = vec4(v_position, 1.0);
  FragmentTexCoords = v_texCoords;
  FragmentNormal = vec3(transpose(inverse(u_Model)) * vec4(normalize(v_normal), 1.0));
	FragmentPos = vec3(u_Model * vec4(v_position, 1.0));
}