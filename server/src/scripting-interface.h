#pragma once
// Provides utility functions for automagically binding calls between
//   C++ and WendyScript

// Some of the code here is sourced from: https://stackoverflow.com/questions/15036063/obtain-argument-index-while-unpacking-argument-list-with-variadic-templates
#include "game.h"
#include "wendy-headers.h"

class PlayerObject;
class WeaponObject;

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
int ConvertToNative(struct data d);

template<>
ObjectID ConvertToNative(struct data d);

template<>
float ConvertToNative(struct data d);

template<>
std::string ConvertToNative(struct data d);

template<>
Vector3 ConvertToNative(struct data data);

template<>
Quaternion ConvertToNative(struct data data);

Object* GetObjectFromArg(struct data id);

template<>
Object* ConvertToNative(struct data data);

template<>
WeaponObject* ConvertToNative(struct data data);

template<>
PlayerObject* ConvertToNative(struct data data);

struct data ConvertToWendy(int t);
struct data ConvertToWendy(const std::string& t);
struct data ConvertToWendy(Object* obj);
struct data ConvertToWendy(const Vector3& vec);
struct data ConvertToWendy(const Quaternion& quat);

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
