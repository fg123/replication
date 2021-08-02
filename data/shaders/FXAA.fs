uniform sampler2D u_texture;
uniform vec2 u_textureSize;

in vec2 FragmentTexCoords;

out vec4 OutputColor;

void main() {
    // Passthrough for now
    OutputColor = texture(u_texture, FragmentTexCoords);
}