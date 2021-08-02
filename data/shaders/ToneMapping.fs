uniform sampler2D u_texture;
uniform float u_exposure;

in vec2 FragmentTexCoords;

out vec4 OutputColor;

void main() {
    vec4 tex = texture(u_texture, FragmentTexCoords);
    // OutputColor = tex;
    // return;
    // exposure tone mapping
    vec3 mapped = vec3(1.0) - exp(-tex.rgb * u_exposure);
    // OutputColor = vec4(mapped, tex.a);
    // return;
    // gamma correction
    // mapped = pow(mapped, vec3(1.0 / 2.2));
    // mapped = pow(mapped, vec3(1.0 / 2.2));
    OutputColor = vec4(mapped, tex.a);
}