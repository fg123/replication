#include "skeletal-animation.h"
#include "logging.h"
#include "scene.h"

#include <fstream>

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

// Parsing Utilities
void Expect(std::ifstream& s, const std::string& str) {
    std::string word;
    s >> word;
    if (word != str) {
        LOG_ERROR("Expected " << str << " but got " << word);
        throw std::runtime_error("Expected " + str + " but got " + word);
    }
}

size_t ParseBone(std::ifstream& bvh, Skeleton& skeleton)
{
    size_t index = skeleton.bones.size();
    Bone* bone = new Bone;
    skeleton.bones.push_back(bone);
    bvh >> bone->name;
    Expect(bvh, "{");
    std::string next;
    while (true) {
        bvh >> next;
        if (next == "}") break;
        if (next == "OFFSET") {
            bvh >> bone->offset.x >> bone->offset.y >> bone->offset.z;
        }
        else if (next == "CHANNELS") {
            int channelCount;
            bvh >> channelCount;
            std::string channel;
            for (int i = 0; i < channelCount; i++) {
                bvh >> channel;
                if (channel == "Xposition") {
                    skeleton.channels.push_back(&bone->position.x);
                }
                else if (channel == "Yposition") {
                    skeleton.channels.push_back(&bone->position.y);
                }
                else if (channel == "Zposition") {
                    skeleton.channels.push_back(&bone->position.z);
                }
                else if (channel == "Xrotation") {
                    skeleton.channels.push_back(&bone->rotation.x);
                }
                else if (channel == "Yrotation") {
                    skeleton.channels.push_back(&bone->rotation.y);
                }
                else if (channel == "Zrotation") {
                    skeleton.channels.push_back(&bone->rotation.z);
                }
                else {
                    LOG_ERROR("Unknown channel " << channel);
                    throw std::runtime_error("Unknown channel " + channel);
                }
            }
        }
        else if (next == "JOINT") {
            bone->children.push_back(ParseBone(bvh, skeleton));
        }
        else if (next == "End") {
            Expect(bvh, "Site");
            Expect(bvh, "{");
            Expect(bvh, "OFFSET");
            bvh >> bone->offsetEnd.x >> bone->offsetEnd.y >> bone->offsetEnd.z;
            Expect(bvh, "}");
        }
        else {
            LOG_ERROR("Unknown token " << next);
            throw std::runtime_error("Unknown token " + next);
        }
    }
    return index;
}

void SkeletalAnimationState::ParseBVH(const std::string& path) {
    // BVH Parsing
    std::ifstream bvh(RESOURCE_PATH(path));

    if (!bvh) {
        throw std::runtime_error("Could not read file " + path);
    }

    LOG_INFO("Reading BVH " << path);

    // Parse Skeleton Part

    Expect(bvh, "HIERARCHY");
    Expect(bvh, "ROOT");
    ParseBone(bvh, skeleton);

    LOG_DEBUG(skeleton.ToString());
}