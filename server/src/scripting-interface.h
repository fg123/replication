// Provides utility functions for automagically binding calls between
//   C++ and WendyScript

// Some of the code here is sourced from: https://stackoverflow.com/questions/15036063/obtain-argument-index-while-unpacking-argument-list-with-variadic-templates


extern "C"
{
#include "wendy/src/source.h"
#include "wendy/src/scanner.h"
#include "wendy/src/ast.h"
#include "wendy/src/native.h"
#include "wendy/src/data.h"
#include "wendy/src/memory.h"
#include "wendy/src/struct.h"
#include "wendy/src/error.h"
}

// Collects internal details for generating index ranges [MIN, MAX)
namespace ScriptingInterface
{
    // The structure that encapsulates index lists
    template <size_t... Is>
    struct IndexList
    {
    };

    // Declare primary template for index range builder
    template <size_t min, size_t N, size_t... Is>
    struct RangeBuilder;

    // Base step
    template <size_t min, size_t... Is>
    struct RangeBuilder<min, min, Is...>
    {
        typedef IndexList<Is...> type;
    };

    // Induction step
    template <size_t min, size_t N, size_t... Is>
    struct RangeBuilder : public RangeBuilder<min, N - 1, N - 1, Is...>
    {
    };

    template<size_t min, size_t max>
    using IndexRange = typename RangeBuilder<min, max>::type;
}

template<typename T>
T ConvertToNative(struct data d);

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

Object* GetObjectFromArg(struct data id) {
    ObjectID objId = (ObjectID) id.value.number;
    #ifdef BUILD_SERVER
        Object* obj = ScriptManager::game->GetObjectIncludingNewQueued(objId);
    #endif
    #ifdef BUILD_CLIENT
        Object* obj = ScriptManager::game->GetObject(objId);
    #endif
    if (!obj) {
        // Try New-Queued objects
        LOG_ERROR("Could not obtain object from id in script instance!");
        throw "Could not obtain object from id in script instance!";
    }
    return obj;
}

template<>
Object* ConvertToNative(struct data data) {
    if (data.type != D_NUMBER) {
        LOG_ERROR("Expected parameter to be a number (ObjectID).");
        throw "Expected parameter to be a number (ObjectID).";
    }
    return GetObjectFromArg(data);
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

struct data ConvertToWendy(int t) {
    return make_data(D_NUMBER, data_value_num(t));
}

struct data ConvertToWendy(const std::string& t) {
    return make_data(D_STRING, data_value_str(t.c_str()));
}

struct data ConvertToWendy(Object* obj) {
    return make_data(D_NUMBER, data_value_num(obj->GetId()));
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

template<typename R, typename... Ts, size_t... Is>
R PerformCall(
    std::function<R(Ts...)> g,
    struct data* args,
    ScriptingInterface::IndexList<Is...>
) {
    return g(ConvertToNative<Ts>(args[Is])...);
}

template<typename R, typename... Ts>
auto CreateFunction(
    std::function<R(Ts...)> g,
    struct vm* vm,
    struct data* args
) {
    return ConvertToWendy(PerformCall<R, Ts...>(g, args,
        ScriptingInterface::IndexRange<0, sizeof...(Ts)>()));
}
template<typename... Ts>
auto CreateFunction(
    std::function<void(Ts...)> g,
    struct vm* vm,
    struct data* args
) {
    PerformCall<void, Ts...>(g, args,
        ScriptingInterface::IndexRange<0, sizeof...(Ts)>());
    return noneret_data();
}

template<typename R, typename... Ts>
constexpr auto GetFunctionArity(
    std::function<R(Ts...)> g
) {
    return sizeof...(Ts);
}

#define REGISTER_NATIVE_CALL(name, ...) \
    register_native_call((name), GetFunctionArity(std::function{__VA_ARGS__}),\
        +[](struct vm* vm, struct data* args) -> struct data {\
            return CreateFunction(std::function{__VA_ARGS__}, vm, args);\
        });
