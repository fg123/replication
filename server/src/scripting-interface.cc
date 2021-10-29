#include "scripting-interface.h"
#include "game.h"
#include "script-manager.h"
#include "player.h"
#include "weapons/weapon.h"

Object* GetObjectFromArg(struct data id) {
    ObjectID objId = (ObjectID) id.value.number;
    Object* obj = ScriptManager::game->GetObject(objId);
    if (!obj) {
        // Try New-Queued objects
        LOG_ERROR("Could not obtain object from id in script instance!");
        throw "Could not obtain object from id in script instance!";
    }
    return obj;
}


struct data ConvertToWendy(const Vector3& vec) {
    push_arg(ScriptManager::vm->memory, make_data(D_END_OF_ARGUMENTS, data_value_num(0)));
    push_arg(ScriptManager::vm->memory, make_data(D_NUMBER, data_value_num(vec.z)));
    push_arg(ScriptManager::vm->memory, make_data(D_NUMBER, data_value_num(vec.y)));
    push_arg(ScriptManager::vm->memory, make_data(D_NUMBER, data_value_num(vec.x)));
    struct data* constructor = get_address_of_id(ScriptManager::vm->memory, "Vector3", true, NULL);
    if (!constructor) {
        print_call_stack(ScriptManager::vm->memory, stdout, 100);
        LOG_ERROR("Could not find Vector3 constructor");
        throw "Could not find Vector3 constructor";
    }
    push_arg(ScriptManager::vm->memory, copy_data(*constructor));
    vm_run_instruction(ScriptManager::vm, OP_CALL);
    vm_run(ScriptManager::vm);
    struct data result = pop_arg(ScriptManager::vm->memory, 0);
    if (result.type != D_STRUCT_INSTANCE) {
        LOG_ERROR("Could not create Vector3");
        throw "Could not create Vector3";
    }
    return result;
}

struct data ConvertToWendy(const Quaternion& quat) {
    push_arg(ScriptManager::vm->memory, make_data(D_END_OF_ARGUMENTS, data_value_num(0)));
    push_arg(ScriptManager::vm->memory, make_data(D_NUMBER, data_value_num(quat.w)));
    push_arg(ScriptManager::vm->memory, make_data(D_NUMBER, data_value_num(quat.z)));
    push_arg(ScriptManager::vm->memory, make_data(D_NUMBER, data_value_num(quat.y)));
    push_arg(ScriptManager::vm->memory, make_data(D_NUMBER, data_value_num(quat.x)));
    struct data* constructor = get_address_of_id(ScriptManager::vm->memory, "Quaternion", true, NULL);
    if (!constructor) {
        print_call_stack(ScriptManager::vm->memory, stdout, 100);
        LOG_ERROR("Could not find Quaternion constructor");
        throw "Could not find Quaternion constructor";
    }
    push_arg(ScriptManager::vm->memory, copy_data(*constructor));
    vm_run_instruction(ScriptManager::vm, OP_CALL);
    vm_run(ScriptManager::vm);
    struct data result = pop_arg(ScriptManager::vm->memory, 0);
    if (result.type != D_STRUCT_INSTANCE) {
        LOG_ERROR("Could not create Quaternion");
        throw "Could not create Quaternion";
    }
    return result;
}

template<>
WeaponObject* ConvertToNative(struct data data) {
    if (data.type != D_NUMBER) {
        LOG_ERROR("Expected parameter to be a number (ObjectID).");
        throw "Expected parameter to be a number (ObjectID).";
    }
    auto* obj = dynamic_cast<WeaponObject*>(GetObjectFromArg(data));
    if (!obj) {
        LOG_ERROR("Expected parameter to be a weapon object.");
        throw "Expected parameter to be a weapon object.";
    }
    return obj;
}

template<>
PlayerObject* ConvertToNative(struct data data) {
    if (data.type != D_NUMBER) {
        LOG_ERROR("Expected parameter to be a number (ObjectID).");
        throw "Expected parameter to be a number (ObjectID).";
    }
    auto* obj = dynamic_cast<PlayerObject*>(GetObjectFromArg(data));
    if (!obj) {
        LOG_ERROR("Expected parameter to be a player object.");
        throw "Expected parameter to be a player object.";
    }
    return obj;
}

template<>
int ConvertToNative(struct data d) {
    if (d.type != D_NUMBER) {
        LOG_ERROR("Expected parameter to be a number.");
        throw "Expected parameter to be a number.";
    }
    return d.value.number;
}


template<>
ObjectID ConvertToNative(struct data d) {
    if (d.type != D_NUMBER) {
        LOG_ERROR("Expected parameter to be a number.");
        throw "Expected parameter to be a number.";
    }
    return d.value.number;
}

template<>
float ConvertToNative(struct data d) {
    if (d.type != D_NUMBER) {
        LOG_ERROR("Expected parameter to be a number.");
        throw "Expected parameter to be a number.";
    }
    return d.value.number;
}

template<>
std::string ConvertToNative(struct data d) {
    if (d.type != D_STRING) {
        LOG_ERROR("Expected parameter to be a string.");
        throw "Expected parameter to be a string.";
    }
    return d.value.string;
}

template<>
Vector3 ConvertToNative(struct data data) {
    if (data.type != D_STRUCT_INSTANCE) {
        LOG_ERROR("Expected parameter to be a struct instance (Vector3).");
        throw "Expected parameter to be a struct instance (Vector3).";
    }
    return Vector3(
        (float) data.value.reference[2].value.number,
        (float) data.value.reference[3].value.number,
        (float) data.value.reference[4].value.number
    );
}

template<>
Quaternion ConvertToNative(struct data data) {
    if (data.type != D_STRUCT_INSTANCE) {
        LOG_ERROR("Expected parameter to be a struct instance (Quaternion).");
        throw "Expected parameter to be a struct instance (Quaternion).";
    }
    return Quaternion(
        (float) data.value.reference[2].value.number,
        (float) data.value.reference[3].value.number,
        (float) data.value.reference[4].value.number,
        (float) data.value.reference[5].value.number
    );
}

template<>
Object* ConvertToNative(struct data data) {
    if (data.type != D_NUMBER) {
        LOG_ERROR("Expected parameter to be a number (ObjectID).");
        throw "Expected parameter to be a number (ObjectID).";
    }
    return GetObjectFromArg(data);
}

struct data ConvertToWendy(int t) {
    return make_data(D_NUMBER, data_value_num(t));
}

struct data ConvertToWendy(const std::string& t) {
    return make_data(D_STRING, data_value_str(t.c_str()));
}

struct data ConvertToWendy(Object* obj) {
    return make_data(D_NUMBER, data_value_num(obj->GetId()));
}