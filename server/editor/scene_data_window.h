#pragma once

#include "scene.h"

class Editor;

class SceneDataWindow {
public:
    bool isVisible = true;
    Node* selectedNode = nullptr;

    void Draw(Editor& editor);
};