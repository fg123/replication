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

// trim from start (in place)
inline void ltrim(std::string &s) {
    s.erase(s.begin(), std::find_if(s.begin(), s.end(), [](unsigned char ch) {
        return !std::isspace(ch);
    }));
}

// trim from end (in place)
inline void rtrim(std::string &s) {
    s.erase(std::find_if(s.rbegin(), s.rend(), [](unsigned char ch) {
        return !std::isspace(ch);
    }).base(), s.end());
}

// trim from both ends (in place)
inline void trim(std::string &s) {
    ltrim(s);
    rtrim(s);
}

// trim from start (copying)
inline std::string ltrim_copy(std::string s) {
    ltrim(s);
    return s;
}

// trim from end (copying)
inline std::string rtrim_copy(std::string s) {
    rtrim(s);
    return s;
}

// trim from both ends (copying)
static inline std::string trim_copy(std::string s) {
    trim(s);
    return s;
}

inline float AngleLerpDegrees(float a, float b, float t) {
    float d = b - a;
    if (d > 180) {
        d -= 360;
    } else if (d < -180) {
        d += 360;
    }
    return a + d * t;
}