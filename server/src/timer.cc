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


Time Timer::NowMicro() {
    using namespace std::chrono;
    return time_point_cast<microseconds>(
        steady_clock::now()).time_since_epoch().count();
}


void Timer::Tick() {
    Time current = Now();
    for (auto it = schedule.begin(); it != schedule.end(); it++) {
        auto& event = *it;
        if (current > event->nextScheduled) {
            event->function(event->nextScheduled);
            event->intervalTime.InsertValue(current - event->lastRealtimeTick);
            event->callRuntime.InsertValue(Now() - current);

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

std::string TimeToString(Time time) {
    std::ostringstream output;
    output << std::setfill('0') << std::setw(2);
    bool mustFill = false;
    Time hours = time / (1000 * 3600);
    if (hours > 0) {
        output << hours << ":";
        mustFill = true;
    }
    time %= (1000 * 3600);
    Time minutes = time / (60 * 1000);
    if (minutes > 0 || mustFill) {
        output << minutes << ":";
        mustFill = true;
    }
    time %= (1000 * 60);
    Time seconds = time / 1000;
    output << seconds << ".";
    time %= 1000;
    output << std::setw(3) << time;
    return output.str();
}