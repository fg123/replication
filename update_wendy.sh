#!/bin/bash
set -x

cd server/scripting/wendy
git pull
cp src/*.h ../../src/external/wendy/

