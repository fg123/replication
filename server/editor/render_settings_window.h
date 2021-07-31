#pragma once

#include "scene.h"

class Editor;

class RenderSettingsWindow {
public:
    bool isVisible = true;

    float bloomThreshold = 0.5f;

    void Draw(Editor& editor);
};