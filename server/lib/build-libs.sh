#!/bin/bash

cd $(dirname "$BASH_SOURCE")
cd assimp-4.1.0

rm lib/*

cmake CMakeLists.txt -DBUILD_SHARED_LIBS=OFF
make -j4

mv lib/libassimp.a lib/cc-libassimp.a
mv lib/liblrrXML.a lib/cc-liblrrXML.a

emcmake cmake CMakeLists.txt -DBUILD_SHARED_LIBS=OFF
emmake make -j4

mv lib/libassimp.a lib/em-libassimp.a
mv lib/liblrrXML.a lib/em-liblrrXML.a