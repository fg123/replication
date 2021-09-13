#include "skeletal-animation.h"

void SkeletalAnimationState::TickState(Time dt) {
    clipTime += dt;
    // Next-keyframe
    auto nextKeyframe = group.clips[clip].keyFrames[keyFrame + 1];
    if (clipTime < nextKeyframe.time) {
        return;
    }
    keyFrame += 1;
    if (keyFrame < group.clips[clip].keyFrames.size() - 1) {
        return;
    }
    if (group.clips[clip].loop) {
        keyFrame = 0;
        return;
    }

    auto transition = group.transitions[clip];
    // TODO(felix): implement transition time
    clip = transition.transitionTo;
}
