#define GetClosestPointOnEmitter
    vec3 GetClosestPointOnEmitter(vec3 point) {
        // No Falloff
        return point;
    }
#end

#define IsPointInVolume
    bool IsPointInVolume(vec3 point) {
        return true;
    }
#end

#define GetLightDirection
    vec3 GetLightDirection(vec3 point) {
        return u_Light.direction;
    }
#end

#include shaders/MeshLighting.fs
