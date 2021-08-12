uniform sampler2D u_texture;
uniform vec2 u_textureSize;

uniform vec3 u_cameraDirection;

uniform float u_fov;
uniform float u_width;
uniform float u_height;

in vec2 FragmentTexCoords;
out vec4 OutputColor;

const float PI = 3.14159265358979323846264;

void main() {
    // We find out which part of the screen we're at
    //   based on the fragment coordinates
    float factor = tan(u_fov / 2.0);

	// Ratio
    vec3 left = cross(vec3(0, 1, 0), normalize(u_cameraDirection));

	float ratio = u_width / u_height;

	float l = -ratio * factor;
    float r = ratio * factor;
    float t = factor;
    float b = -factor;
	float offsetx = l + (r - l) * (FragmentTexCoords.x - 0.5);
	float offsety = t + (b - t) * -(FragmentTexCoords.y - 0.5);

	vec3 fragmentDirection = u_cameraDirection - left * offsetx + vec3(0, 1, 0) * offsety;

    // u_fov is vertical
    vec3 d = -fragmentDirection;
    float u = 0.5 + atan(d.z, d.x) / (2.0 * PI);
    float v = 1.0 - (d.y * 0.5 + 0.5);

    OutputColor = texture(u_texture, vec2(u, v));
}