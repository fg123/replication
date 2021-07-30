#define GetClosestPointOnEmitter
    vec3 GetClosestPointOnEmitter(vec3 point) {
        // The emitter is a quad transformed by transform matrix
        vec3 transformedPoint = vec3(u_Light.inverseTransform * vec4(point, 1.0));
        vec3 clamped = clamp(transformedPoint,
            vec3(-0.5, -0.5, 0), vec3(0.5, 0.5, 0));
        return vec3(u_Light.transform * vec4(clamped, 1.0));
    }
#end

#define IsPointInVolume
    bool IsPointInVolume(vec3 point) {
        vec3 transformedPoint = vec3(u_Light.inverseVolumeTransform * vec4(point, 1.0));

        vec3 s = step(vec3(-0.5, -0.5, -0.5), transformedPoint) - step(vec3(0.5, 0.5, 0.5), transformedPoint);
        return s.x * s.y * s.z > 0.0;
    }
#end

#include shaders/MeshLighting.fs
