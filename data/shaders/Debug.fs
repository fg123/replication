uniform vec3 u_Color;

out vec4 OutputColor;

void main() {
    OutputColor = vec4(u_Color, 1);
}