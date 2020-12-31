#include "timer.h"

Timer::Timer() {

}

Timer::~Timer() {
    for (auto& p : schedule) {
        delete p;
    }
    schedule.clear();
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
        if (current > event->nextScheduled) {
            event->function(event->nextScheduled);
            event->performance.InsertValue(current - event->lastRealtimeTick);

            event->lastRealtimeTick = current;

            if (event->shouldRepeat) {
                event->nextScheduled += event->interval;
            }
            else {
                it = schedule.erase(it);
            }
        }
    }
}

void Timer::ScheduleCall(std::function<void(Time)> function, Time delay) {
    schedule.push_back(new ScheduledCall(function, Now() + delay));
}

ScheduledCall* Timer::ScheduleInterval(std::function<void(Time)> function, Time interval) {
    ScheduledCall* call = new ScheduledCall(function, Now(), interval);
    schedule.push_back(call);
    return call;
}