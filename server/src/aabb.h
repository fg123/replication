#pragma once

#include "vector.h"
#include "mesh.h"
#include "ray-cast.h"

struct AABB {
    Vector3 ptMin;
    Vector3 ptMax;

    AABB() {}
    AABB(const Vector3& ptMin, const Vector3& ptMax) :
        ptMin(ptMin), ptMax(ptMax) {}

    AABB(const Vector3* arr, size_t size) {
        if (size == 0) return;
        Vector3 min = arr[0], max = arr[0];

        for (size_t i = 1; i < size; i++) {
            min = glm::min(min, arr[i]);
            max = glm::max(max, arr[i]);
        }
        ptMax = max;
        ptMin = min;
    }

    static AABB FromPoints(const Vector3& pt1, const Vector3& pt2, const Vector3& pt3) {
        Vector3 ptMin = glm::min(pt1, pt2, pt3) - 0.01f;
        Vector3 ptMax = glm::max(pt1, pt2, pt3) + 0.01f;
        return AABB(ptMin, ptMax);
    }

    static AABB FromMesh(const Mesh& mesh) {
        if (mesh.vertices.empty()) return AABB{};
        AABB first { mesh.vertices[0].position, mesh.vertices[0].position };
        for (size_t i = 1; i < mesh.vertices.size(); i++) {
            first.ExpandToContain(mesh.vertices[i].position);
        }
        return first;
    }

    void ExpandToContain(const Vector3& pt) {
        ptMin = glm::min(ptMin, pt - 0.01f);
        ptMax = glm::max(ptMax, pt + 0.01f);
    }

    static AABB FromTwo(const AABB& a, const AABB& b) {
        return AABB(glm::min(a.ptMin, b.ptMin), glm::max(a.ptMax, b.ptMax));
    }

    bool CollidesWith(RayCastRequest& ray, RayCastResult& result);
};