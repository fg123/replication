#include "bvh.h"

void SortAxis(std::vector<BVHTree::Triangle*>& v, int axis) {
	if (axis == 0) {
		std::sort(v.begin(), v.end(), [](const BVHTree::Triangle* a, const BVHTree::Triangle* b) {
			return a->center.x < b->center.x;
		});
	}
	else if (axis == 1) {
		std::sort(v.begin(), v.end(), [](const BVHTree::Triangle* a, const BVHTree::Triangle* b) {
			return a->center.y < b->center.y;
		});
	}
	else if (axis == 2) {
		std::sort(v.begin(), v.end(), [](const BVHTree::Triangle* a, const BVHTree::Triangle* b) {
			return a->center.z < b->center.z;
		});
	}
}

BVHTree* BVHTree::Create(const std::vector<Triangle*>& tris, int axis, int level) {
	BVHTree* node = new BVHTree;
	size_t N = tris.size();

	if (N <= 8) {
		node->collider = AABBCollider::FromPoints(tris[0]->a, tris[0]->b, tris[0]->c);
        node->tris.push_back(tris[0]);
		tris[0]->parentVolume = node;
		for (size_t i = 1; i < N; i++) {
			tris[i]->parentVolume = node;
			Triangle* triangle = tris[i];
			AABBCollider& col = triangle->parentVolume->collider;

			Vector3 aPos = col.position;
			Vector3 aSize = col.size;

			node->collider.ExpandToContain(tris[i]->a);
			Vector3 bPos = col.position;
			Vector3 bSize = col.size;
			node->collider.ExpandToContain(tris[i]->b);
			Vector3 cPos = col.position;
			Vector3 cSize = col.size;
			node->collider.ExpandToContain(tris[i]->c);

			// if (!IsPointInAABB(col.position, col.size, triangle->a)) {
			// 	LOG_ERROR("A not in bound " << triangle->a);
			// 	LOG_ERROR("A: " << aPos << " " << aPos + aSize);
			// 	LOG_ERROR("B: " << bPos << " " << bPos + bSize);
			// 	LOG_ERROR("C: " << cPos << " " << cPos + cSize);
			// 	LOG_ERROR("Now: " << col.position << " " << col.position + col.size);
			// 	exit(1);
			// }

            node->tris.push_back(tris[i]);
		}
		return node;
    }

	std::vector<Triangle*> sorted {tris};
	SortAxis(sorted, axis);
	size_t half = sorted.size() / 2;
	BVHTree* left = Create(std::vector<Triangle*>(sorted.begin(), sorted.begin() + half), (axis + 1) % 3, level + 1);
	BVHTree* right = Create(std::vector<Triangle*>(sorted.begin() + half, sorted.end()), (axis + 1) % 3, level + 1);
	node->children.push_back(left);
	node->children.push_back(right);
	node->collider = AABBCollider::FromTwo(&left->collider, &right->collider);
	return node;
}