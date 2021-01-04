#ifndef LOGGING_H
#define LOGGING_H

#define LOG_TIME_FORMAT "[%OH:%OM:%OS] "

#include <iostream>
#include <ctime>
#include <iomanip>

static std::time_t time_now = std::time(nullptr);

class _Log {
    std::ostream* stream = &std::cout;
public:
    template <class T>
    _Log &operator<<(const T &msg) {
        *stream << msg;
        return *this;
    }
    _Log const &operator<<(std::ostream &(*F)(std::ostream &)) const {
        F(*stream);
        return *this;
    }
};

// Wraps the prefix
class LogWithPrefix {
    const char* prefix;
    _Log underlying;
public:
    LogWithPrefix(const char* prefix) : prefix(prefix) {

    }
    template <class T>
    _Log &operator<<(const T &msg) {
        auto time = std::put_time(std::localtime(&time_now), LOG_TIME_FORMAT);
        underlying << time << prefix << msg;
        return underlying;
    }
};

namespace Log {
    static LogWithPrefix Debug  ("\033[36m[DEBUG]\033[0m ");
    static LogWithPrefix Info   ("\033[34m[INFO]\033[0m ");
    static LogWithPrefix Warning("\033[33m[WARN]\033[0m ");
    static LogWithPrefix Error  ("\033[31m[ERROR]\033[0m ");
};

#define LOG_INFO(...) Log::Info << __VA_ARGS__ << std::endl
#define LOG_DEBUG(...) Log::Debug << __VA_ARGS__ << std::endl
#define LOG_WARN(...) Log::Warning << __VA_ARGS__ << std::endl
#define LOG_ERROR(...) Log::Error << __VA_ARGS__ << std::endl

#define LOG_BREADCRUMB() Log::Debug << __FILE__ << ": " << __LINE__ << std::endl
#endif