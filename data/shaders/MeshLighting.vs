#version 300 es

uniform mat4 u_Projection;
uniform mat4 u_View;
uniform mat4 u_Model;

uniform bool u_UseProjectionAndView;

layout (location = 0) in vec3 v_position;
layout (location = 1) in vec3 v_normal;
layout (location = 2) in vec2 v_texCoords;
layout (location = 3) in vec3 v_tangent;
layout (location = 4) in vec3 v_smoothedNormal;

void main() {
  // gl_Position = vec4(v_position, 1.0);

    if (u_UseProjectionAndView) {
        gl_Position = u_Projection * u_View * u_Model * vec4(v_position, 1.0);
    }
    else {
        gl_Position = u_Model * vec4(v_position, 1.0);
    }
}