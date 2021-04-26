# Install script for directory: /mnt/f/replication/server/lib/assimp-4.1.0/code

# Set the install prefix
if(NOT DEFINED CMAKE_INSTALL_PREFIX)
  set(CMAKE_INSTALL_PREFIX "/usr/local")
endif()
string(REGEX REPLACE "/$" "" CMAKE_INSTALL_PREFIX "${CMAKE_INSTALL_PREFIX}")

# Set the install configuration name.
if(NOT DEFINED CMAKE_INSTALL_CONFIG_NAME)
  if(BUILD_TYPE)
    string(REGEX REPLACE "^[^A-Za-z0-9_]+" ""
           CMAKE_INSTALL_CONFIG_NAME "${BUILD_TYPE}")
  else()
    set(CMAKE_INSTALL_CONFIG_NAME "")
  endif()
  message(STATUS "Install configuration: \"${CMAKE_INSTALL_CONFIG_NAME}\"")
endif()

# Set the component getting installed.
if(NOT CMAKE_INSTALL_COMPONENT)
  if(COMPONENT)
    message(STATUS "Install component: \"${COMPONENT}\"")
    set(CMAKE_INSTALL_COMPONENT "${COMPONENT}")
  else()
    set(CMAKE_INSTALL_COMPONENT)
  endif()
endif()

# Install shared libraries without execute permission?
if(NOT DEFINED CMAKE_INSTALL_SO_NO_EXE)
  set(CMAKE_INSTALL_SO_NO_EXE "1")
endif()

# Is this installation the result of a crosscompile?
if(NOT DEFINED CMAKE_CROSSCOMPILING)
  set(CMAKE_CROSSCOMPILING "FALSE")
endif()

# Set default install directory permissions.
if(NOT DEFINED CMAKE_OBJDUMP)
  set(CMAKE_OBJDUMP "/usr/bin/objdump")
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xUnspecifiedx" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE STATIC_LIBRARY FILES "/mnt/f/replication/server/lib/assimp-4.1.0/lib/libassimp.a")
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xassimp-devx" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/assimp" TYPE FILE FILES
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/anim.h"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/ai_assert.h"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/camera.h"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/color4.h"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/color4.inl"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/config.h"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/defs.h"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/Defines.h"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/cfileio.h"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/light.h"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/material.h"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/material.inl"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/matrix3x3.h"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/matrix3x3.inl"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/matrix4x4.h"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/matrix4x4.inl"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/mesh.h"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/postprocess.h"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/quaternion.h"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/quaternion.inl"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/scene.h"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/metadata.h"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/texture.h"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/types.h"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/vector2.h"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/vector2.inl"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/vector3.h"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/vector3.inl"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/version.h"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/cimport.h"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/importerdesc.h"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/Importer.hpp"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/DefaultLogger.hpp"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/ProgressHandler.hpp"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/IOStream.hpp"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/IOSystem.hpp"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/Logger.hpp"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/LogStream.hpp"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/NullLogger.hpp"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/cexport.h"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/Exporter.hpp"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/DefaultIOStream.h"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/DefaultIOSystem.h"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/SceneCombiner.h"
    )
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xassimp-devx" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/assimp/Compiler" TYPE FILE FILES
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/Compiler/pushpack1.h"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/Compiler/poppack1.h"
    "/mnt/f/replication/server/lib/assimp-4.1.0/code/../include/assimp/Compiler/pstdint.h"
    )
endif()

