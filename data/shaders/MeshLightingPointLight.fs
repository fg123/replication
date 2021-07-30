#define GetClosestPointOnEmitter
    vec3 GetClosestPointOnEmitter(vec3 point) {
        return u_Light.position;
    }
#end

#define IsPointInVolume
    bool IsPointInVolume(vec3 point) {
        vec3 transformedPoint = vec3(u_Light.inverseTransform * vec4(point, 1.0));
        return length(transformedPoint) < 0.5;
    }
#end

#include shaders/MeshLighting.fs
