#pragma once

class Editor;

class SceneDataWindow {
public:
    bool isVisible = true;

    void Draw(Editor& editor);
};