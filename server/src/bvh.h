#pragma once

#include "vector.h"
#include "aabb.h"
#include <vector>

// BVH Implementation From Mesh
// Interface of a BVH Node
struct BVHNode {
    Vector3 center;
    virtual AABB ComputeAABB() = 0;
    virtual ~BVHNode() {}
};

template <typename T>
void SortAxis(std::vector<T*>& v, int axis) {
	if (axis == 0) {
		std::sort(v.begin(), v.end(), [](const T* a, const T* b) {
			return a->center.x < b->center.x;
		});
	}
	else if (axis == 1) {
		std::sort(v.begin(), v.end(), [](const T* a, const T* b) {
			return a->center.y < b->center.y;
		});
	}
	else if (axis == 2) {
		std::sort(v.begin(), v.end(), [](const T* a, const T* b) {
			return a->center.z < b->center.z;
		});
	}
}


template<typename NodeType>
struct BVHTree {
    AABB collider;
    std::vector<BVHTree<NodeType>*> children;
    // Leaf if we have some triangles in here
    std::vector<NodeType*> tris;
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

    static BVHTree<NodeType>* Create(const std::vector<NodeType*>& tris, int axis, int level) {
        BVHTree<NodeType>* node = new BVHTree<NodeType>;
        size_t N = tris.size();

        if (N <= 8) {
            node->collider = tris[0]->ComputeAABB();
            node->tris.push_back(tris[0]);
            // tris[0]->parentVolume = node;
            for (size_t i = 1; i < N; i++) {
                // tris[i]->parentVolume = node;
                NodeType* triangle = tris[i];
                // AABB& col = triangle->parentVolume->collider;
                node->collider = AABB::FromTwo(node->collider, tris[i]->ComputeAABB());
                // node->collider.ExpandToContain(tris[i]->a);
                // node->collider.ExpandToContain(tris[i]->b);
                // node->collider.ExpandToContain(tris[i]->c);
                node->tris.push_back(tris[i]);
            }
            return node;
        }

        std::vector<NodeType*> sorted {tris};
        SortAxis(sorted, axis);
        size_t half = sorted.size() / 2;
        BVHTree<NodeType>* left = Create(std::vector<NodeType*>(sorted.begin(), sorted.begin() + half), (axis + 1) % 3, level + 1);
        BVHTree<NodeType>* right = Create(std::vector<NodeType*>(sorted.begin() + half, sorted.end()), (axis + 1) % 3, level + 1);
        node->children.push_back(left);
        node->children.push_back(right);
        node->collider = AABB::FromTwo(left->collider, right->collider);
        return node;
    }
};

struct BVHTriangle : public BVHNode {
    Vector3 a;
    Vector3 b;
    Vector3 c;
    Vector3 norm;
    Vector3 center;
    BVHTree<BVHTriangle>* parentVolume = nullptr;
    BVHTriangle(const Vector3& a, const Vector3& b, const Vector3& c, const Vector3& norm) :
        a(a), b(b), c(c), norm(norm), center((a + b + c) / 3.0f) {}
    virtual AABB ComputeAABB() override {
        return AABB::FromPoints(a, b, c);
    }
};
