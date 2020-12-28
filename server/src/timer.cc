#include "timer.h"

Timer::Timer() {

}

Time Timer::Now() {
    using namespace std::chrono;
    return time_point_cast<milliseconds>(
        steady_clock::now()).time_since_epoch().count();
}

void Timer::Tick() {
    Time current = Now();
    for (auto it = schedule.begin(); it != schedule.end(); it++) {
        auto& event = *it;
        if (current > event.nextScheduled) {
            event.function(event.nextScheduled);
            if (event.shouldRepeat) {
                event.nextScheduled += event.interval;
            }
            else {
                it = schedule.erase(it);
            }
        }
    }
}

void Timer::ScheduleCall(std::function<void(Time)> function, Time delay) {
    schedule.emplace_back(function, Now() + delay);
}

void Timer::ScheduleInterval(std::function<void(Time)> function, Time interval) {
    schedule.emplace_back(function, Now(), interval);
}