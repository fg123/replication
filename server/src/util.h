#pragma once

#include <algorithm>
#include <cctype>
#include <string>

inline std::string ToLower(std::string data) {
    std::transform(data.begin(), data.end(), data.begin(),
        [](unsigned char c) { return std::tolower(c); });
    return data;
}

inline bool Contains(const std::string& haystack, const std::string& needle) {
    return haystack.find(needle) != std::string::npos;
}

template<typename T>
inline bool Contains(const std::vector<T>& haystack, const T& needle) {
    for (auto& obj : haystack) {
        if (obj == needle) return true;
    }
    return false;
}

inline Vector3 Average(const std::vector<Vector3>& vec) {
    if (vec.empty()) return Vector3();

    Vector3 result;
    for (auto& t : vec) {
        result += t;
    }
    return result / (float) vec.size();
}

template<typename T, typename R>
inline std::vector<R> Map(const std::vector<T>& vec, std::function<R(const T&)> func) {
    std::vector<R> result;
    for (auto& t : vec) {
        result.push_back(func(t));
    }
    return result;
}
