uniform sampler2D u_texture;
uniform vec2 u_textureSize;
uniform bool u_isDepth;

uniform float u_colorMultiplier;

in vec2 FragmentTexCoords;

out vec4 OutputColor;

void main() {
    if (u_isDepth) {
        float val = texture(u_texture, FragmentTexCoords).r;
        float n = 0.2;
        float f = 300.0;
        float grey = (2.0 * n) / (f + n - val*(f-n));

        OutputColor = vec4(u_colorMultiplier * vec3(grey, grey, grey), 1.0);
    }
    else {
        vec4 tex = texture(u_texture, FragmentTexCoords);
        OutputColor = vec4(u_colorMultiplier * vec3(tex), tex.a);
    }
}