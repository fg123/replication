#pragma once

#include "imgui.h"

IMGUI_IMPL_API bool     ImGui_ImplWeb_Init();
IMGUI_IMPL_API void     ImGui_ImplWeb_Shutdown();
IMGUI_IMPL_API void     ImGui_ImplWeb_NewFrame();
IMGUI_IMPL_API bool     ImGui_ImplWeb_ProcessEvent();
