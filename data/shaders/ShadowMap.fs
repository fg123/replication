#version 300 es

precision highp float;

out vec4 OutputColor;

void main() {
    OutputColor = vec4(gl_FragCoord.z, gl_FragCoord.z, gl_FragCoord.z, 1);
}