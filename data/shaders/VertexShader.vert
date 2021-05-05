#version 300 es

uniform mat4 u_Projection;
uniform mat4 u_View;
uniform mat4 u_Model;

layout (location = 0) in vec3 v_position;
layout (location = 1) in vec3 v_normal;
layout (location = 2) in vec2 v_texCoords;
layout (location = 3) in vec3 v_tangent;

out vec3 FragmentNormal;
out vec3 FragmentPos;
out vec2 FragmentTexCoords;
out mat3 FragmentTBN;

void main() {
  gl_Position = u_Projection * u_View * u_Model * vec4(v_position, 1.0);
  // gl_Position = vec4(v_position, 1.0);
  FragmentTexCoords = v_texCoords;
  FragmentNormal = vec3(transpose(inverse(u_Model)) * vec4(normalize(v_normal), 1.0));

  vec3 tangent = vec3(transpose(inverse(u_Model)) * vec4(normalize(v_tangent), 1.0));
  vec3 bitangent = cross(FragmentNormal, tangent);

  FragmentTBN = mat3(tangent, bitangent, FragmentNormal);

	FragmentPos = vec3(u_Model * vec4(v_position, 1.0));
}