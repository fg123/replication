#pragma once

#include "scene.h"

class Editor;

class RenderSettingsWindow {
public:
    bool isVisible = true;

    bool enableBloom = true;
    float bloomThreshold = 1.0f;

    bool enableToneMapping = true;
    float exposure = 1.0f;

    bool enableAntialiasing = true;

    void Draw(Editor& editor);
};