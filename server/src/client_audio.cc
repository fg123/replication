#include "client_audio.h"
#include "player.h"

void ClientAudio::SetupContext() {
    ALCdevice* openALDevice = alcOpenDevice(nullptr);
    if (!openALDevice) {
        LOG_ERROR("Could not acquire audio device");
        throw "Could not acquire audio device";
    }

    ALCcontext* openALContext = alcCreateContext(openALDevice, nullptr);
    if (!openALContext) {
        LOG_ERROR("Could not create audio context");
        throw "Could not create audio context";
    }
    ALCboolean contextMadeCurrent = alcMakeContextCurrent(openALContext);
    if (contextMadeCurrent != ALC_TRUE) {
        LOG_ERROR("Could not make audio context current");
        throw "Could not make audio context current";
    }
}

void ClientAudio::Tick() {
    if (PlayerObject* p = game.GetLocalPlayer()) {
        Vector3 player = p->GetPosition();
        Vector3 look = p->GetLookDirection();
        alListener3f(AL_POSITION, player.x, player.y, player.z);
        ALfloat listenerOri[]= { look.x, look.y, look.z, 0.0, 1.0, 0.0 };
        alListenerfv(AL_ORIENTATION, listenerOri);
    }

    // Start all audios that were queued up
    for (auto& request : game.audioRequests) {
        AudioPlayback* playback = new AudioPlayback;
        playback->boundObject = request.boundObject;
        playback->state = AL_PLAYING;
        playback->position = request.location;
        alGenSources(1, &playback->source);
        alSourcef(playback->source, AL_PITCH, 1);
        alSourcef(playback->source, AL_GAIN, request.volume);
        alSource3f(playback->source, AL_VELOCITY, 0, 0, 0);
        alSourcei(playback->source, AL_LOOPING, AL_FALSE);
        alSourcei(playback->source, AL_BUFFER, request.audio->audioBuffer);
        alSourcePlay(playback->source);
        sources.insert(playback);
    }
    game.audioRequests.clear();


    for (auto it = sources.begin(); it != sources.end();) {
        AudioPlayback* source = *it;
        if (Object* bound = game.GetObject<Object>(source->boundObject)) {
            LOG_DEBUG("Updating position " << bound->GetClass());
            source->position = bound->GetPosition();
        }
        alSource3f(source->source, AL_POSITION, source->position.x, source->position.y, source->position.z);
        alGetSourcei(source->source, AL_SOURCE_STATE, &source->state);
        // Remove all sources that ended
        if (source->state != AL_PLAYING) {
            alDeleteSources(1, &source->source);
            delete source;
            it = sources.erase(it);
        }
        else {
            it++;
        }
    }
}