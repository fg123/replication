#pragma once

#include "scene.h"

class Editor;

class SceneGraphWindow {
public:
    Node* selectedNode = nullptr;

    void DrawCurrentProperties(Editor& editor);
    void DrawTreeNode(Node* node);
    void Draw(Editor& editor);
};