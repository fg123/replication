#pragma once

#include "scene.h"
#include "deferred_renderer.h"

class Editor;

class RenderSettingsWindow {
public:
    RenderSettingsWindow();
    bool isVisible = true;
    bool lockShadowMapToViewport = true;

    RenderFrameParameters parameters;

    void Draw(Editor& editor);
};