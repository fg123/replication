#pragma once

#include <vector>
#include "logging.h"

template<class NumericType>
class PerformanceBuffer {
    std::vector<NumericType> buffer;
    size_t nextFree = 0;

    NumericType fullSum = 0;
    size_t size;

public:
    PerformanceBuffer(size_t size) : size(size) {
        LOG_DEBUG("Initializing Performance Buffer " << size);
        for (size_t i = 0; i < size; i++) {
            buffer.emplace_back();
        }
        if (size == 0) {
            LOG_ERROR("Performance buffer must not have 0 size!");
            throw std::runtime_error("Performance buffer must not have 0 size!");
        }
    }

    void InsertValue(NumericType value) {
        fullSum -= buffer[nextFree];
        buffer[nextFree] = value;
        fullSum += value;
        // LOG_DEBUG("Insert Full Sum = " << fullSum);
        nextFree += 1;
        if (nextFree >= size) {
            nextFree = 0;
        }
    }

    double GetAverage() const {
        // LOG_DEBUG("Get Average " << fullSum << " " << size);
        return fullSum / size;
    }
};
