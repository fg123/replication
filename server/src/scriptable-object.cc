#include "scriptable-object.h"


void ScriptableObject::ProcessReplication(json& data) {
    Object::ProcessReplication(data);
}

void ScriptableObject::OnClientCreate() {
    Object::OnClientCreate();
    script.InitializeInstance(className, GetId());
    script.CallMemberFunction("OnClientCreate");
}

void ScriptableObject::OnCreate() {
    Object::OnCreate();
    #ifdef BUILD_SERVER
        LOG_INFO("Initializing Instance " << className);
        script.InitializeInstance(className, GetId());
        script.CallMemberFunction("OnServerCreate");
    #endif
}

void ScriptableObject::Tick(Time time) {
    Object::Tick(time);
    script.CallMemberFunction("OnTick", time);
}

void ScriptableObject::OnCollide(CollisionResult& result) {
    Object::OnCollide(result);
    script.CallMemberFunction("OnCollide", {
        make_data(D_NUMBER, data_value_num(result.collidedWith->GetId())),
        ConvertToWendy(result.collisionDifference)
    });
}