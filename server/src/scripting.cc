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
}

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

struct data Vector3ToList(const Vector3& vec) {
    struct data* list = wendy_list_malloc(ScriptManager::vm->memory, 3);
    list[1] = make_data(D_NUMBER, data_value_num(vec.x));
    list[2] = make_data(D_NUMBER, data_value_num(vec.y));
    list[3] = make_data(D_NUMBER, data_value_num(vec.z));
    return make_data(D_LIST, data_value_ptr(list));
}

Object* GetObjectFromArg(struct data id) {
    Object* obj = ScriptManager::game->GetObject<Object>((uint64_t)id.value.number);
    if (!obj) {
        LOG_ERROR("Could not obtain object from id in script instance!");
        throw "Could not obtain object from id in script instance!";
    }
    return obj;
}

struct data object_GetPosition(struct vm* vm, struct data* args) {
    return Vector3ToList(GetObjectFromArg(args[0])->GetPosition());
}

struct data object_SetPosition(struct vm* vm, struct data* args) {
    Vector3 pos {
        (float) args[1].value.reference[2].value.number,
        (float) args[1].value.reference[3].value.number,
        (float) args[1].value.reference[4].value.number
    };
    GetObjectFromArg(args[0])->SetPosition(pos);
    return noneret_data();
}

struct data object_SetModel(struct vm* vm, struct data* args) {
    GetObjectFromArg(args[0])->SetModel(ScriptManager::game->GetModel(args[1].value.string));
    return noneret_data();
}

ScriptManager::ScriptManager(Game* game) {
    ScriptManager::game = game;
    vm = vm_init();
    register_native_call("object_GetPosition", 1, &object_GetPosition);
    register_native_call("object_SetModel", 2, &object_SetModel);
    register_native_call("object_SetPosition", 2, &object_SetPosition);
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
    for (const auto& arg : arguments) {
        push_arg(ScriptManager::vm->memory, copy_data(arg));
    }

    // Setup a member function call
    struct data* fn = struct_get_field(ScriptManager::vm, structInstance, member.c_str());
    push_arg(ScriptManager::vm->memory, copy_data(structInstance));
    struct data fn_copy = copy_data(*fn);
    fn_copy.type = D_STRUCT_FUNCTION;

    push_arg(ScriptManager::vm->memory, fn_copy);
    vm_run_instruction(ScriptManager::vm, OP_CALL);
    vm_run(ScriptManager::vm);
    // TODO: probably clean up stack here, might have a noneret?
}