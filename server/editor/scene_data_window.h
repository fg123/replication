#pragma once

#include "scene.h"

class Editor;

class SceneDataWindow {
public:
    Node* selectedNode = nullptr;

    void Draw(Editor& editor);
};