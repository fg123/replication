#ifndef TIMER_H
#define TIMER_H

#include <chrono>
#include <functional>
#include <vector>

using Time = uint64_t;

struct ScheduledCall {
    std::function<void(Time)> function;
    Time nextScheduled;
    Time interval;
    bool shouldRepeat;

    ScheduledCall(std::function<void(Time)> function, Time nextScheduled) :
        function(function),
        nextScheduled(nextScheduled),
        interval(0),
        shouldRepeat(false) {}

    ScheduledCall(std::function<void(Time)> function, Time nextScheduled,
        Time interval) :
        function(function),
        nextScheduled(nextScheduled),
        interval(interval),
        shouldRepeat(true) {}
};

class Timer {
    std::vector<ScheduledCall> schedule;

    Time Now();
public:
    Timer();

    void Tick();

    void ScheduleCall(std::function<void(Time)> function, Time delay);
    void ScheduleInterval(std::function<void(Time)> function, Time interval);

};

#endif