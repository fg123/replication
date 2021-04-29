#version 300 es

uniform vec2 Resolution;
uniform mat4 Projection;
uniform mat4 View;
uniform mat4 Model;

layout (location = 0) in vec3 v_position;
layout (location = 1) in vec3 v_normal;

out vec3 FragmentNormal;
out vec3 FragmentPos;

void main() {
  gl_Position = Projection * View * Model * vec4(v_position, 1.0);

  FragmentNormal = normalize(v_normal);
	FragmentPos = vec3(Model * vec4(v_position, 1.0));
}