#pragma once

#include "scene.h"
#include "deferred_renderer.h"

class Editor;

class RenderSettingsWindow {
public:
    bool isVisible = true;

    RenderFrameParameters parameters;

    void Draw(Editor& editor);
};