#pragma once

#include "scene.h"

class Editor;

class SceneGraphWindow {
    std::vector<std::string> gameObjectNames;
public:
    SceneGraphWindow();
    Node* selectedNode = nullptr;

    void DrawCurrentProperties(Editor& editor);
    void DrawTreeNode(Node* node);
    void Draw(Editor& editor);
};