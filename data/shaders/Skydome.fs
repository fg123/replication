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
    vec3 left = normalize(cross(vec3(0.0, 1.0, 0.0), normalize(u_cameraDirection)));
    vec3 up = normalize(cross(left, normalize(u_cameraDirection)));
	float ratio = u_width / u_height;

	float l = -ratio * factor;
    float r = ratio * factor;
    float t = factor;
    float b = -factor;
	float offsetx = mix(l, r, (FragmentTexCoords.x * u_width) / u_width);
	float offsety = mix(t, b, ((1.0 - FragmentTexCoords.y) * u_height) / u_height);

	vec3 fragmentDirection = normalize(u_cameraDirection - left * offsetx - up * offsety);

    // u_fov is vertical
    vec3 d = -fragmentDirection;
    float u = 0.5 + atan(d.z, d.x) / (2.0 * PI);
    float v = 1.0 - (d.y * 0.5 + 0.5);
    // OutputColor = vec4(u, v, 1.0, 1.0);
    OutputColor = texture(u_texture, vec2(u * 2.0, v));
}