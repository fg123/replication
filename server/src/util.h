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