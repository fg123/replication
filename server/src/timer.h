#pragma once

#include <chrono>
#include <functional>
#include <vector>
#include <sstream>

#include "perf.h"

// For now otherwise it doesn't pass correctly
using Time = uint64_t;

struct ScheduledCall {
    std::function<void(Time)> function;
    Time nextScheduled;
    Time interval;

    Time lastRealtimeTick;
    bool shouldRepeat;

    PerformanceBuffer<Time> callRuntime { 100 };
    PerformanceBuffer<Time> intervalTime { 100 };

    ScheduledCall(std::function<void(Time)> function, Time nextScheduled) :
        function(function),
        nextScheduled(nextScheduled),
        interval(0),
        lastRealtimeTick(0),
        shouldRepeat(false) {}

    ScheduledCall(std::function<void(Time)> function, Time nextScheduled,
        Time interval) :
        function(function),
        nextScheduled(nextScheduled),
        interval(interval),
        lastRealtimeTick(0),
        shouldRepeat(true) {}
};

class Timer {
    std::vector<ScheduledCall*> schedule;

public:
    static Time Now();
    static Time NowMicro();

    Timer();
    ~Timer();

    void Tick();

    void ScheduleCall(std::function<void(Time)> function, Time delay);
    ScheduledCall* ScheduleInterval(std::function<void(Time)> function, Time interval);

};

std::string TimeToString(Time time);