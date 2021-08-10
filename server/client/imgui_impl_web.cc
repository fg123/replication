#include "imgui_impl_web.h"
#include "timer.h"

struct ImGui_ImplWeb_Data
{
    double                  Time;
    bool                    MouseJustPressed[ImGuiMouseButton_COUNT];
    // GLFWcursor*             MouseCursors[ImGuiMouseCursor_COUNT];

    ImGui_ImplWeb_Data()   { memset(this, 0, sizeof(*this)); }
};

bool ImGui_ImplWeb_Init() {
    ImGuiIO& io = ImGui::GetIO();
    IM_ASSERT(io.BackendPlatformUserData == NULL && "Already initialized a platform backend!");

    // Setup backend capabilities flags
    ImGui_ImplWeb_Data* bd = IM_NEW(ImGui_ImplWeb_Data)();
    io.BackendPlatformUserData = (void*)bd;
    io.BackendPlatformName = "imgui_impl_web";
    io.BackendFlags |= ImGuiBackendFlags_HasMouseCursors;         // We can honor GetMouseCursor() values (optional)
    io.BackendFlags |= ImGuiBackendFlags_HasSetMousePos;          // We can honor io.WantSetMousePos requests (optional, rarely used)

    // bd->Window = window;
    bd->Time = 0.0;

    // Keyboard mapping. Dear ImGui will use those indices to peek into the io.KeysDown[] array.
    // io.KeyMap[ImGuiKey_Tab] = 9;
    io.KeyMap[ImGuiKey_LeftArrow] = 37;
    io.KeyMap[ImGuiKey_RightArrow] = 39;
    io.KeyMap[ImGuiKey_UpArrow] = 38;
    io.KeyMap[ImGuiKey_DownArrow] = 40;
    io.KeyMap[ImGuiKey_PageUp] = 33;
    io.KeyMap[ImGuiKey_PageDown] = 34;
    io.KeyMap[ImGuiKey_Home] = 36;
    io.KeyMap[ImGuiKey_End] = 35;
    io.KeyMap[ImGuiKey_Insert] = 45;
    io.KeyMap[ImGuiKey_Delete] = 46;
    io.KeyMap[ImGuiKey_Backspace] = 8;
    io.KeyMap[ImGuiKey_Space] = 32;
    io.KeyMap[ImGuiKey_Enter] = 13;
    io.KeyMap[ImGuiKey_Escape] = 27;
    io.KeyMap[ImGuiKey_KeyPadEnter] = 13;
    io.KeyMap[ImGuiKey_A] = 65;
    io.KeyMap[ImGuiKey_C] = 67;
    io.KeyMap[ImGuiKey_V] = 86;
    io.KeyMap[ImGuiKey_X] = 88;
    io.KeyMap[ImGuiKey_Y] = 89;
    io.KeyMap[ImGuiKey_Z] = 90;

//     io.SetClipboardTextFn = ImGui_ImplGlfw_SetClipboardText;
//     io.GetClipboardTextFn = ImGui_ImplGlfw_GetClipboardText;
//     io.ClipboardUserData = bd->Window;
// #if defined(_WIN32)
//     io.ImeWindowHandle = (void*)glfwGetWin32Window(bd->Window);
// #endif

//     // Create mouse cursors
//     // (By design, on X11 cursors are user configurable and some cursors may be missing. When a cursor doesn't exist,
//     // GLFW will emit an error which will often be printed by the app, so we temporarily disable error reporting.
//     // Missing cursors will return NULL and our _UpdateMouseCursor() function will use the Arrow cursor instead.)
//     GLFWerrorfun prev_error_callback = glfwSetErrorCallback(NULL);
//     bd->MouseCursors[ImGuiMouseCursor_Arrow] = glfwCreateStandardCursor(GLFW_ARROW_CURSOR);
//     bd->MouseCursors[ImGuiMouseCursor_TextInput] = glfwCreateStandardCursor(GLFW_IBEAM_CURSOR);
//     bd->MouseCursors[ImGuiMouseCursor_ResizeNS] = glfwCreateStandardCursor(GLFW_VRESIZE_CURSOR);
//     bd->MouseCursors[ImGuiMouseCursor_ResizeEW] = glfwCreateStandardCursor(GLFW_HRESIZE_CURSOR);
//     bd->MouseCursors[ImGuiMouseCursor_Hand] = glfwCreateStandardCursor(GLFW_HAND_CURSOR);
// #if GLFW_HAS_NEW_CURSORS
//     bd->MouseCursors[ImGuiMouseCursor_ResizeAll] = glfwCreateStandardCursor(GLFW_RESIZE_ALL_CURSOR);
//     bd->MouseCursors[ImGuiMouseCursor_ResizeNESW] = glfwCreateStandardCursor(GLFW_RESIZE_NESW_CURSOR);
//     bd->MouseCursors[ImGuiMouseCursor_ResizeNWSE] = glfwCreateStandardCursor(GLFW_RESIZE_NWSE_CURSOR);
//     bd->MouseCursors[ImGuiMouseCursor_NotAllowed] = glfwCreateStandardCursor(GLFW_NOT_ALLOWED_CURSOR);
// #else
//     bd->MouseCursors[ImGuiMouseCursor_ResizeAll] = glfwCreateStandardCursor(GLFW_ARROW_CURSOR);
//     bd->MouseCursors[ImGuiMouseCursor_ResizeNESW] = glfwCreateStandardCursor(GLFW_ARROW_CURSOR);
//     bd->MouseCursors[ImGuiMouseCursor_ResizeNWSE] = glfwCreateStandardCursor(GLFW_ARROW_CURSOR);
//     bd->MouseCursors[ImGuiMouseCursor_NotAllowed] = glfwCreateStandardCursor(GLFW_ARROW_CURSOR);
// #endif
    // glfwSetErrorCallback(prev_error_callback);

    // // Chain GLFW callbacks: our callbacks will call the user's previously installed callbacks, if any.
    // bd->PrevUserCallbackMousebutton = NULL;
    // bd->PrevUserCallbackScroll = NULL;
    // bd->PrevUserCallbackKey = NULL;
    // bd->PrevUserCallbackChar = NULL;
    // bd->PrevUserCallbackMonitor = NULL;
    // if (install_callbacks)
    // {
    //     bd->InstalledCallbacks = true;
    //     bd->PrevUserCallbackMousebutton = glfwSetMouseButtonCallback(window, ImGui_ImplGlfw_MouseButtonCallback);
    //     bd->PrevUserCallbackScroll = glfwSetScrollCallback(window, ImGui_ImplGlfw_ScrollCallback);
    //     bd->PrevUserCallbackKey = glfwSetKeyCallback(window, ImGui_ImplGlfw_KeyCallback);
    //     bd->PrevUserCallbackChar = glfwSetCharCallback(window, ImGui_ImplGlfw_CharCallback);
    //     bd->PrevUserCallbackMonitor = glfwSetMonitorCallback(ImGui_ImplGlfw_MonitorCallback);
    // }

    // bd->ClientApi = client_api;
    return true;
}

static ImGui_ImplWeb_Data* ImGui_ImplWeb_GetBackendData()
{
    return ImGui::GetCurrentContext() ? (ImGui_ImplWeb_Data*)ImGui::GetIO().BackendPlatformUserData : NULL;
}

void ImGui_ImplWeb_Shutdown() {
    ImGuiIO& io = ImGui::GetIO();
    ImGui_ImplWeb_Data* bd = ImGui_ImplWeb_GetBackendData();
    IM_DELETE(bd);
}

void ImGui_ImplWeb_NewFrame() {
    ImGuiIO& io = ImGui::GetIO();
    ImGui_ImplWeb_Data* bd = ImGui_ImplWeb_GetBackendData();
    IM_ASSERT(bd != NULL && "Did you call ImGui_ImplWeb_InitForXXX()?");

    // Setup time step
    double current_time = Timer::Now() / 1000.0;
    io.DeltaTime = bd->Time > 0.0 ? (float)(current_time - bd->Time) : (float)(1.0f / 60.0f);
    bd->Time = current_time;
}

void ImGui_ImplWeb_ProcessEvent(JSONDocument& obj) {
    ImGuiIO& io = ImGui::GetIO();
    if (obj["event"] == "ku") {
        int key = obj["key"].GetInt();
        if (key >= 0 && key < IM_ARRAYSIZE(io.KeysDown)) {
            io.KeysDown[key] = false;
        }
        io.KeyCtrl = obj["ctrl"].GetBool();
        io.KeyShift = obj["shift"].GetBool();
        io.KeyAlt = obj["alt"].GetBool();
    }
    else if (obj["event"] == "kd") {
        int key = obj["key"].GetInt();
        if (key >= 0 && key < IM_ARRAYSIZE(io.KeysDown)) {
            io.KeysDown[key] = true;
        }
         if (std::isprint(key)) {
            io.AddInputCharacter(key);
        }
        io.KeyCtrl = obj["ctrl"].GetBool();
        io.KeyShift = obj["shift"].GetBool();
        io.KeyAlt = obj["alt"].GetBool();
    }
    else if (obj["event"] == "mm") {
        double mx = obj["rx"].GetDouble();
        double my = obj["ry"].GetDouble();
        io.MousePos = ImVec2((float)mx, (float)my);
    }
    else if (obj["event"] == "md") {
        int button = obj["button"].GetInt() - 1;
        if (button >= 0 && button < IM_ARRAYSIZE(io.MouseDown)) {
            io.MouseDown[button] = true;
        }
    }
    else if (obj["event"] == "mu") {
        int button = obj["button"].GetInt() - 1;
        if (button >= 0 && button < IM_ARRAYSIZE(io.MouseDown)) {
            io.MouseDown[button] = false;
        }
    }
    else if (obj["event"] == "mw") {
        int deltaX = obj["x"].GetInt();
        int deltaY = obj["y"].GetInt();
        io.MouseWheelH += deltaX < 0 ? 1 : -1;
        io.MouseWheel += deltaY < 0 ? 1 : -1;
    }
}
