#pragma once

#include "scene.h"

class Editor;

class RenderSettingsWindow {
public:
    bool isVisible = true;

    bool enableBloom = false;
    float bloomThreshold = 1.0f;

    bool enableToneMapping = false;
    float exposure = 1.0f;

    bool enableAntialiasing = false;

    void Draw(Editor& editor);
};