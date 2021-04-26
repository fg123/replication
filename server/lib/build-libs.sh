#!/bin/bash

cd $(dirname "$BASH_SOURCE")
cd assimp-4.1.0
cmake CMakeLists.txt -DBUILD_SHARED_LIBS=OFF
make -j4
