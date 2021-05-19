#include "tests.h"
#include "collision.h"
#include "object.h"
#include "logging.h"
#include <vector>

// For running tests
void Tests::RunRotatedAABBCollisionTest() {
    GameObject main { game };
    GameObject side { game };
    main.AddCollider(new AABBCollider(&main, Vector3(-0.5), Vector3(1)));
    side.AddCollider(new AABBCollider(&side, Vector3(-0.5), Vector3(1)));
    CollisionResult r;
    side.SetRotation(DirectionToQuaternion(Vector::Forward));
    LOG_INFO("Side Quat: " << side.GetRotation());
    LOG_INFO("Top Collide (0, 1, 0)");
    side.SetPosition(Vector3(0, 0.8, 0));
    r = side.CollidesWith(&main);
    LOG_INFO(r);

    LOG_INFO("Bottom Collide (0, -1, 0)");
    side.SetPosition(Vector3(0, -0.8, 0));
    r = side.CollidesWith(&main);
    LOG_INFO(r);

    LOG_INFO("Left Collide (1, 0, 0)");
    side.SetPosition(Vector3(0.8, 0, 0));
    r = side.CollidesWith(&main);
    LOG_INFO(r);

    LOG_INFO("Right Collide (-1, 0, 0)");
    side.SetPosition(Vector3(-0.8, 0, 0));
    r = side.CollidesWith(&main);
    LOG_INFO(r);

    LOG_INFO("Front Collide (0, 0, 1)");
    side.SetPosition(Vector3(0, 0, 0.8));
    r = side.CollidesWith(&main);
    LOG_INFO(r);

    LOG_INFO("Right Collide (0, 0, -1)");
    side.SetPosition(Vector3(0, 0, -0.8));
    r = side.CollidesWith(&main);
    LOG_INFO(r);
}


void Tests::RunStaticMeshCollisionTest() {
    GameObject main { game };
    GameObject side { game };
    Mesh mesh;
    mesh.vertices.emplace_back(0.5, 0.5,  0.5, 0, 1, 0);
    mesh.vertices.emplace_back(0.5, 0.5, -0.5, 0, 1, 0);
    mesh.vertices.emplace_back(-0.5, 0.5, -0.5, 0, 1, 0);
    mesh.indices.push_back(2);
    mesh.indices.push_back(1);
    mesh.indices.push_back(0);

    side.SetRotation(DirectionToQuaternion(Vector::Left));
    LOG_INFO("Side Quat: " << side.GetRotation());

    main.AddCollider(new StaticMeshCollider(&main, mesh));
    side.AddCollider(new AABBCollider(&side, Vector3(-0.5), Vector3(1)));

    side.SetPosition(Vector3(0, 0.8, 0));
    CollisionResult r;
    r = side.CollidesWith(&main);
    LOG_INFO(r);

    side.SetPosition(Vector3(0, 0.5, 0));
    r = side.CollidesWith(&main);
    LOG_INFO(r);

    side.SetPosition(Vector3(0, 0.1, 0));
    r = side.CollidesWith(&main);
    LOG_INFO(r);

}

int Tests::Run() {
    LOG_INFO("Testing Begin");
    // RunRotatedAABBCollisionTest();
    RunStaticMeshCollisionTest();
    LOG_INFO("Tests Complete");
    return 0;
}