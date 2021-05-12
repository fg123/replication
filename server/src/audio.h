#pragma once

#ifdef BUILD_CLIENT

#include <cstdint>
#include <AL/al.h>
#include <AL/alc.h>

struct Audio {
    signed short* data;
    unsigned int channels;
    unsigned int sampleRate;
    uint64_t frames;

    ALuint audioBuffer;

    void InitializeAudio() {
        alGenBuffers(1, &audioBuffer);

        ALenum format;
        if (channels == 1) {
            format = AL_FORMAT_MONO16;
        }
        else if (channels == 2) {
            format = AL_FORMAT_STEREO16;
        }
        else {
            LOG_ERROR("ERROR: unrecognised wave format: "
                << channels << " channels");
            throw "Unrecognized audio format";
        }
        size_t bytes = frames * sizeof(signed short) * channels;
        alBufferData(audioBuffer, format, data, bytes, sampleRate);
    }
};

#endif