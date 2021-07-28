#pragma once

#include "scene.h"

class Editor;

class SceneGraphWindow {
public:
    bool isVisible = true;
    Node* selectedNode = nullptr;

    void DrawCurrentProperties();
    void DrawTreeNode(Node* node);
    void Draw(Editor& editor);
};