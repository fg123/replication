#pragma once

#ifdef BUILD_EDITOR
    #define GL_GLEXT_PROTOTYPES
    #include <GL/glcorearb.h>

    #include <GLFW/glfw3.h>
#endif

#ifdef BUILD_CLIENT
    #include <GLES3/gl3.h>
    #include <GLES3/gl2ext.h>
#endif