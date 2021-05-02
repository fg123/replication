#version 300 es

uniform vec2 Resolution;
uniform mat4 Projection;
uniform mat4 View;
uniform mat4 Model;

layout (location = 0) in vec3 v_position;
layout (location = 1) in vec3 v_normal;
layout (location = 2) in vec2 v_texCoords;

out vec3 FragmentNormal;
out vec3 FragmentPos;
out vec2 FragmentTexCoords;

void main() {
  gl_Position = Projection * View * Model * vec4(v_position, 1.0);
  // gl_Position = vec4(v_position, 1.0);
  FragmentTexCoords = v_texCoords;
  FragmentNormal = vec3(transpose(inverse(Model)) * vec4(normalize(v_normal), 1.0));
	FragmentPos = vec3(Model * vec4(v_position, 1.0));
}