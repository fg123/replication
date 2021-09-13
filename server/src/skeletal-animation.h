#pragma once

#include "skeleton.h"
#include "timer.h"
#include "replicable.h"

struct SkeletalAnimationKeyFrame {
    Vector3 position;
    Quaternion rotation;

    // Maybe needs interpolation parameters
};

struct SkeletalAnimationKeyFrameWithTime {
    Time time;
    SkeletalAnimationKeyFrame keyFrame;
};

struct SkeletalAnimationClip {
    std::vector<SkeletalAnimationKeyFrameWithTime> keyFrames;
    bool loop;
};

struct SkeletalAnimationTransition {
    size_t transitionTo;
    Time transitionTime;
};

struct SkeletalAnimationGroup {
    std::vector<SkeletalAnimationClip> clips;
    std::vector<SkeletalAnimationTransition> transitions;
};

struct SkeletalAnimationState {
    SkeletalAnimationGroup& group;
    size_t clip;

    // This is the *previous* keyFrame we're interpolating from
    size_t keyFrame;
    Time clipTime;

    void TickState(Time deltaTime);
};