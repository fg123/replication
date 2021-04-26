#pragma once

#include "glm/glm.hpp"
#include "glm/ext.hpp"
#include "glm/gtx/string_cast.hpp"
#include "glm/detail/setup.hpp"

#include <type_traits>

template <typename T, typename... Args>
class HasGlmToString
{
    template <typename C,
              typename = decltype(glm::detail::compute_to_string<C>::call(std::declval<C>(), std::declval<Args>()...))>
    static std::true_type test(int);
    template <typename C>
    static std::false_type test(...);

public:
    static constexpr bool value = decltype(test<T>(0))::value;
};

template <
    typename T,
    std::enable_if_t<HasGlmToString<T>::value, bool> = true
>
std::ostream& operator<<(std::ostream& os, const T& v) {
    os << glm::to_string(v);
    return os;
}