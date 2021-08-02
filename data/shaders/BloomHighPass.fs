uniform sampler2D u_texture;
uniform vec2 u_textureSize;
uniform vec2 u_direction;

uniform float u_threshold;

in vec2 FragmentTexCoords;

out vec4 OutputColor;

void main() {
    OutputColor = vec4(0.0, 0.0, 0.0, 0.0);
    vec4 tex = texture(u_texture, FragmentTexCoords);
    float max_brightness = length(tex.rgb);
    if (isnan(max_brightness) || (max_brightness < u_threshold)) {
        return;
    }

    OutputColor = vec4(u_threshold, u_threshold, u_threshold, 1.0);
    OutputColor = tex;
}