#include "script-manager.h"
#include "scripting-interface.h"

#include "game.h"
#include "player.h"
#include "weapons/weapon.h"
#include "util.h"

std::string ScriptManager::GetBaseTypeFromScriptingType(const std::string& type) {
    // Make a WendyCall to retrieve BaseType
    struct data* value = get_address_of_id(ScriptManager::vm->memory, type.c_str(), true, NULL);
    if (!value) {
        LOG_ERROR("Could not find WendyScript class " + type);
        throw "Could not find WendyScript class " + type;
    }
    struct data* baseType = struct_get_field(ScriptManager::vm, *value, "BaseType");
    return baseType->value.string;
}

ScriptManager::ScriptManager(Game* game) {
    ScriptManager::game = game;
    vm = vm_init();

    REGISTER_NATIVE_CALL("object_GetPosition", [](Object* object) {
        return object->GetPosition();
    });
    REGISTER_NATIVE_CALL("object_GetScale", [](Object* object) {
        return object->GetScale();
    });
    REGISTER_NATIVE_CALL("object_GetRotation", [](Object* object) {
        return object->GetRotation();
    });
    REGISTER_NATIVE_CALL("object_GetVelocity", [](Object* object) {
        return object->GetVelocity();
    });
    REGISTER_NATIVE_CALL("object_GetSpawnTime", [](Object* object) {
        return object->GetSpawnTime();
    });

    REGISTER_NATIVE_CALL("object_SetPosition", [](Object* object, Vector3 position) {
        object->SetPosition(position);
    });
    REGISTER_NATIVE_CALL("object_SetScale", [](Object* object, Vector3 scale) {
        object->SetScale(scale);
    });
    REGISTER_NATIVE_CALL("object_SetRotation", [](Object* object, Quaternion rotation) {
        object->SetRotation(rotation);
    });
    REGISTER_NATIVE_CALL("object_SetVelocity", [](Object* object, Vector3 velocity) {
        object->SetVelocity(velocity);
    });
    REGISTER_NATIVE_CALL("object_SetModel", [](Object* object, std::string model){
        #ifdef BUILD_SERVER
            object->SetModel(ScriptManager::game->GetModel(model));
        #endif
    });
    REGISTER_NATIVE_CALL("object_SetAirFriction", [](Object* object, Vector3 airFriction) {
        object->airFriction = airFriction;
    });

    REGISTER_NATIVE_CALL("object_GenerateOBBCollidersFromModel", [](Object* object) {
        GenerateOBBCollidersFromModel(object);
    });

    REGISTER_NATIVE_CALL("object_AddSphereCollider", [](Object* object, Vector3 offset, float radius) {
        object->AddCollider(new SphereCollider(object, offset, radius));
    });

    // Game Interface
    REGISTER_NATIVE_CALL("game_PlayAudio", [](std::string path, int id, Vector3 location) {
        ScriptManager::game->PlayAudio(path, id, location);
    });
    REGISTER_NATIVE_CALL("game_CreateObject", [](std::string path) {
        return ScriptManager::game->CreateAndAddScriptedObject(path);
    });
    REGISTER_NATIVE_CALL("game_CreateNativeObject", [](std::string className) {
        auto& classLookup = GetClassLookup();
        auto it = classLookup.find(className);
        if (it == classLookup.end()) {
            LOG_ERROR("Could not find class " << className);
            throw "Could not find class " + className;
        }
        Object* obj = it->second(*ScriptManager::game);
        ScriptManager::game->AddObject(obj);
        return obj;
    });
    REGISTER_NATIVE_CALL("game_DestroyObject", [](ObjectID id) {
        ScriptManager::game->DestroyObject(id);
    });

    REGISTER_NATIVE_CALL("player_SetWeapon", [](PlayerObject* player, WeaponObject* weapon, int slot, int attachPoint) {
        WeaponAttachmentPoint attach = (WeaponAttachmentPoint) attachPoint;
        if (slot == 0) {
            player->qWeapon = weapon;
            weapon->AttachToPlayer(player, attach);
        }
        else if (slot == 1) {
            player->zWeapon = weapon;
            weapon->AttachToPlayer(player, attach);
        }
    });

    REGISTER_NATIVE_CALL("player_SetHealth", [](PlayerObject* player, float health) {
        player->SetHealth(health);
    });

    // Math Hooks
    REGISTER_NATIVE_CALL("glm_Rotate", [](Vector3 axis, float angle) {
        return glm::angleAxis(angle, axis);
    });
}

ScriptManager::~ScriptManager() {
    vm_destroy(vm);
    vm = nullptr;
    for (auto& script : scripts) {
        delete script;
    }
    scripts.clear();
}

void ScriptManager::AddScript(const std::string& path) {
    Script* script = new Script;
    script->LoadAndCompile(path);
    scripts.push_back(script);
}

void ScriptManager::InitializeVM() {
    push_frame(vm->memory, "main", 0, 0);
    // Create Global Variables needed for scripting

    // For detecting client / server
    #ifdef BUILD_SERVER
        *push_stack_entry(vm->memory, "IsServer", 0) = true_data();
        *push_stack_entry(vm->memory, "IsClient", 0) = false_data();
    #else
        *push_stack_entry(vm->memory, "IsServer", 0) = false_data();
        *push_stack_entry(vm->memory, "IsClient", 0) = true_data();
    #endif

    // Load all the scripts into the VM, and run them
    for (auto& script : scripts) {
        if (script->bytecode) {
            vm_set_instruction_pointer(vm,
                vm_load_code(vm, script->bytecode,
                    script->size, true));
            vm_run(vm);
        }
    }
}