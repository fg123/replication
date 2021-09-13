#include "scripting.h"
#include "object.h"
#include "game.h"

#include <fstream>

extern "C"
{
#include "wendy/source.h"
#include "wendy/scanner.h"
#include "wendy/ast.h"
#include "wendy/native.h"
#include "wendy/data.h"
#include "wendy/memory.h"
#include "wendy/struct.h"
#include "wendy/error.h"
}

// Contains a lot of internal interfacing with WendyScript's VM Runtime
//   If anything changes there things might break here.

// Wendyscript expects a popen symbol but emscripten doe
#ifdef BUILD_CLIENT
FILE *popen(const char *command, const char *type) {
    return NULL;
}
#endif

// These have to be globals because the native calls
//   bound to the WendyVM has no context
struct vm* ScriptManager::vm = nullptr;
Game* ScriptManager::game = nullptr;

void Script::LoadAndCompile(const std::string& path) {
    LOG_INFO("Loading " << path);
    const char* file_name = path.c_str();
    FILE* file = fopen(file_name, "r");
    if (!file) {
        LOG_ERROR("Could not open file " << path);
        return;
    }
    fseek(file, 0, SEEK_END);
	size_t length = ftell(file);
	fseek (file, 0, SEEK_SET);

    init_source(file, file_name, length, true);
    // Text Source
    char* buffer = get_source_buffer();
    // Begin Processing the File
    size_t alloc_size = 0;
    struct token* tokens;
    size_t tokens_count;

    // Scanning and Tokenizing
    tokens_count = scan_tokens(buffer, &tokens, &alloc_size);

    // Build AST
    struct statement_list* ast = generate_ast(tokens, tokens_count);
    // Generate Bytecode, No WendyHeader
    // TODO: this shouldn't depend on this, generate_code should accept an argument
    bytecode = generate_code(ast, &size, false);
    free_token_list(tokens, tokens_count);
    free_ast(ast);
    free_source();
    fclose(file);
    LOG_INFO("Compiled " << path);
}

Script::~Script() {
    if (bytecode) {
        safe_free(bytecode);
        bytecode = nullptr;
    }
}

struct data Vector3ToWendy(const Vector3& vec) {
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

struct data QuaternionToWendy(const Quaternion& vec) {
    push_arg(ScriptManager::vm->memory, make_data(D_END_OF_ARGUMENTS, data_value_num(0)));
    push_arg(ScriptManager::vm->memory, make_data(D_NUMBER, data_value_num(vec.w)));
    push_arg(ScriptManager::vm->memory, make_data(D_NUMBER, data_value_num(vec.z)));
    push_arg(ScriptManager::vm->memory, make_data(D_NUMBER, data_value_num(vec.y)));
    push_arg(ScriptManager::vm->memory, make_data(D_NUMBER, data_value_num(vec.x)));
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

Object* GetObjectFromArg(struct data id) {
    Object* obj = ScriptManager::game->GetObject((uint64_t)id.value.number);
    if (!obj) {
        LOG_ERROR("Could not obtain object from id in script instance!");
        throw "Could not obtain object from id in script instance!";
    }
    return obj;
}

struct data object_GetPosition(struct vm* vm, struct data* args) {
    return Vector3ToWendy(GetObjectFromArg(args[0])->GetPosition());
}

struct data object_GetScale(struct vm* vm, struct data* args) {
    return Vector3ToWendy(GetObjectFromArg(args[0])->GetScale());
}

struct data object_GetRotation(struct vm* vm, struct data* args) {
    return QuaternionToWendy(GetObjectFromArg(args[0])->GetRotation());
}

struct data object_GetVelocity(struct vm* vm, struct data* args) {
    return Vector3ToWendy(GetObjectFromArg(args[0])->GetVelocity());
}

struct data object_GetSpawnTime(struct vm* vm, struct data* args) {
    return make_data(D_NUMBER, data_value_num(GetObjectFromArg(args[0])->GetSpawnTime()));
}

struct data object_GenerateOBBCollidersFromModel(struct vm* vm, struct data* args) {
    GenerateOBBCollidersFromModel(GetObjectFromArg(args[0]));
    return noneret_data();
}

struct data object_AddSphereCollider(struct vm* vm, struct data* args) {
    Vector3 offset = {
        (float) args[1].value.reference[2].value.number,
        (float) args[1].value.reference[3].value.number,
        (float) args[1].value.reference[4].value.number
    };
    double radius = args[2].value.number;
    Object* owner = GetObjectFromArg(args[0]);
    owner->AddCollider(new SphereCollider(owner, offset, radius));

    return noneret_data();
}

struct data object_SetModel(struct vm* vm, struct data* args) {
    #ifdef BUILD_SERVER
        const char* str = args[1].value.string;
        GetObjectFromArg(args[0])->SetModel(ScriptManager::game->GetModel(str));
    #endif
    return noneret_data();
}

Vector3 Vector3FromWendy(const struct data& data) {
    return Vector3(
        (float) data.value.reference[2].value.number,
        (float) data.value.reference[3].value.number,
        (float) data.value.reference[4].value.number
    );
}

Quaternion QuaternionFromWendy(const struct data& data) {
    return Quaternion(
        (float) data.value.reference[2].value.number,
        (float) data.value.reference[3].value.number,
        (float) data.value.reference[4].value.number,
        (float) data.value.reference[5].value.number
    );
}

struct data object_SetPosition(struct vm* vm, struct data* args) {
    GetObjectFromArg(args[0])->SetPosition(Vector3FromWendy(args[1]));
    return noneret_data();
}

struct data object_SetVelocity(struct vm* vm, struct data* args) {
    GetObjectFromArg(args[0])->SetVelocity(Vector3FromWendy(args[1]));
    return noneret_data();
}

struct data object_SetScale(struct vm* vm, struct data* args) {
    GetObjectFromArg(args[0])->SetScale(Vector3FromWendy(args[1]));
    return noneret_data();
}


struct data object_SetAirFriction(struct vm* vm, struct data* args) {
    GetObjectFromArg(args[0])->airFriction = Vector3FromWendy(args[1]);
    return noneret_data();
}

struct data object_SetRotation(struct vm* vm, struct data* args) {
    GetObjectFromArg(args[0])->SetRotation(QuaternionFromWendy(args[1]));
    return noneret_data();
}

struct data game_PlayAudio(struct vm* vm, struct data* args) {
    if (args[2].type == D_NUMBER) {
        // ID Version
        ScriptManager::game->PlayAudio(args[0].value.string, args[1].value.number,
            GetObjectFromArg(args[2]));
        return noneret_data();
    }
    ScriptManager::game->PlayAudio(args[0].value.string, args[1].value.number,
        Vector3FromWendy(args[2]));
    return noneret_data();
}

struct data game_DestroyObject(struct vm* vm, struct data* args) {
    ScriptManager::game->DestroyObject(args[0].value.number);
    return noneret_data();
}

struct data glm_Rotate(struct vm* vm, struct data* args) {
    Vector3 axis {
        (float) args[0].value.number,
        (float) args[1].value.number,
        (float) args[2].value.number,
    };
    float angle = (float) args[3].value.number;
    return QuaternionToWendy(glm::angleAxis(angle, axis));
}

ScriptManager::ScriptManager(Game* game) {
    ScriptManager::game = game;
    vm = vm_init();
    register_native_call("object_GetPosition", 1, &object_GetPosition);
    register_native_call("object_GetScale", 1, &object_GetScale);
    register_native_call("object_GetRotation", 1, &object_GetRotation);
    register_native_call("object_GetVelocity", 1, &object_GetVelocity);
    register_native_call("object_GetSpawnTime", 1, &object_GetSpawnTime);

    register_native_call("object_SetModel", 2, &object_SetModel);
    register_native_call("object_SetPosition", 2, &object_SetPosition);
    register_native_call("object_SetVelocity", 2, &object_SetVelocity);
    register_native_call("object_SetRotation", 2, &object_SetRotation);
    register_native_call("object_SetScale", 2, &object_SetScale);
    register_native_call("object_SetAirFriction", 2, &object_SetAirFriction);

    register_native_call("object_GenerateOBBCollidersFromModel", 1, &object_GenerateOBBCollidersFromModel);
    register_native_call("object_AddSphereCollider", 3, &object_AddSphereCollider);

    // Game Interface
    register_native_call("game_PlayAudio", 3, &game_PlayAudio);
    register_native_call("game_DestroyObject", 1, &game_DestroyObject);

    // Math Hooks
    register_native_call("glm_Rotate", 4, &glm_Rotate);
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

void ScriptInstance::InitializeInstance(const std::string& className, ObjectID id) {
    // Load VM up to create an instance
    this->className = className;

    // Load struct metaclass
    struct data* value = get_address_of_id(ScriptManager::vm->memory, className.c_str(), true, NULL);
    if (!value) {
        LOG_ERROR("Class " << className << " not found!");
        return;
    }
    push_arg(ScriptManager::vm->memory, make_data(D_END_OF_ARGUMENTS, data_value_num(0)));
    push_arg(ScriptManager::vm->memory, copy_data(*value));
    vm_run_instruction(ScriptManager::vm, OP_CALL);
    vm_run(ScriptManager::vm);
    classInstance = pop_arg(ScriptManager::vm->memory, ScriptManager::vm->line);
    if (classInstance.type != D_STRUCT_INSTANCE) {
        LOG_ERROR("Could not initialize script instance, not D_STRUCT_INSTANCE");
        throw "Could not initialize script instance, not D_STRUCT_INSTANCE";
    }

    // Setup ID
    push_arg(ScriptManager::vm->memory, make_data(D_NUMBER, data_value_num(id)));
    // Custom memptr
    struct data* ptr = struct_get_field(ScriptManager::vm, classInstance, "id");
    push_arg(ScriptManager::vm->memory, make_data(D_INTERNAL_POINTER, data_value_ptr(ptr)));
    vm_run_instruction(ScriptManager::vm, OP_WRITE);
}

void CallMemberFunction(struct data structInstance,
    const std::string& member, const std::vector<struct data> arguments) {

    push_arg(ScriptManager::vm->memory, make_data(D_END_OF_ARGUMENTS, data_value_num(0)));
    for (auto it = arguments.rbegin(); it != arguments.rend(); ++it) {
        push_arg(ScriptManager::vm->memory, copy_data(*it));
    }

    // Setup a member function call
    struct data* fn = struct_get_field(ScriptManager::vm, structInstance, member.c_str());
    push_arg(ScriptManager::vm->memory, copy_data(structInstance));
    struct data fn_copy = copy_data(*fn);
    fn_copy.type = D_STRUCT_FUNCTION;

    push_arg(ScriptManager::vm->memory, fn_copy);
    vm_run_instruction(ScriptManager::vm, OP_CALL);
    vm_run(ScriptManager::vm);
    if (get_error_flag()) {
        throw "Scripting Error";
    }
    // TODO: probably clean up stack here, might have a noneret?
}

// Serialization of Internal Wendy Structs
void ScriptInstance::Serialize(JSONWriter& obj) {
    Replicable::Serialize(obj);
    // obj.Key("s");
    // obj.StartArray();
    // // The number of params are stored at the struct instance header
    // if (classInstance.type != D_STRUCT_INSTANCE ||
    //     classInstance.value.reference[0].type != D_STRUCT_INSTANCE_HEADER) {
    //     LOG_ERROR("Could not serialize Wendy Struct, not D_STRUCT_INSTANCE_HEADER");
    //     throw "Could not serialize Wendy Struct, not D_STRUCT_INSTANCE_HEADER";
    // }

    // int numParams = (int)classInstance.value.reference[0].value.number;
    // // [0] is header [1] is reference to underlying metadata
    // // numParams includes the underlying metadata entry, so we -1
    // for (int i = 2; i < numParams - 1; i++) {
    //     struct data param = classInstance.value.reference[i];
    //     if (is_numeric(param)) {
    //         obj.Double(param.value.number);
    //     }
    //     else if (is_reference(param)) {
    //         // TODO: just serialize Lists and Tables
    //         LOG_ERROR("Serialization of references not yet supported");
    //         throw "Serialization of references not yet supported";
    //     }
    //     else {
    //         obj.String(param.value.string);
    //     }
    // }
    // obj.EndArray();
}

void ScriptInstance::ProcessReplication(json& obj) {
    Replicable::ProcessReplication(obj);

    // if (classInstance.type != D_STRUCT_INSTANCE ||
    //     classInstance.value.reference[0].type != D_STRUCT_INSTANCE_HEADER) {
    //     // Here is a weird timing thing. The script instance gets initialized
    //     //   on first replication by the script object, which potentially
    //     //   initializes after ScriptInstance::ProcessReplication in
    //     //   ScriptObject::OnClientCreate. This means we actually miss the first
    //     //   replication data, and won't update / catchup until the second replication.
    //     return;
    // }

    // int i = 2;
    // // Load Data from JSON Back into the script instance in the VM
    // for (auto& elem : obj["s"].GetArray()) {
    //     // TODO: if we ever replicate references we cannot destroy before
    //     //   we replace in case we drop the ref count to 0
    //     destroy_data_runtime(ScriptManager::vm->memory,
    //         &classInstance.value.reference[i]);
    //     if (elem.IsDouble()) {
    //         classInstance.value.reference[i] = make_data(D_NUMBER, data_value_num(elem.GetDouble()));
    //     }
    //     else if (elem.IsString()) {
    //         classInstance.value.reference[i] = make_data(D_STRING, data_value_str(elem.GetString()));
    //     }
    //     else {
    //         LOG_ERROR("Could not deserialize non string / double");
    //         throw "Could not deserialize non string / double";
    //     }
    //     i += 1;
    // }
}


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

void ScriptInstance::OnCollide(CollisionResult& collision) {
    CallMemberFunction(classInstance, "OnCollide", {
        make_data(D_NUMBER, data_value_num(collision.collidedWith->GetId())),
        Vector3ToWendy(collision.collisionDifference)
    });
}