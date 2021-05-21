#pragma once

#include "vector.h"
#include "collision.h"
#include <vector>

// BVH Implementation From Mesh
struct BVHTree {
    struct Triangle {
        Vector3 a;
        Vector3 b;
        Vector3 c;
        Vector3 norm;
        Vector3 center;
        BVHTree* parentVolume = nullptr;
        Triangle(const Vector3& a, const Vector3& b, const Vector3& c, const Vector3& norm) :
            a(a), b(b), c(c), norm(norm), center((a + b + c) / 3.0f) {}
    };

    AABBCollider collider;
    std::vector<BVHTree*> children;
    // Leaf if we have some triangles in here
    std::vector<Triangle*> tris;
    ~BVHTree() {
        for (auto& child : children) {
            delete child;
        }
        for (auto& tri : tris) {
            delete tri;
        }
        children.clear();
        tris.clear();
    }
    static BVHTree* Create(const std::vector<Triangle*>&, int axis, int level);
};