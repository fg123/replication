#!/bin/bash

# store arguments in a special array
args=("$@")
# get number of elements
ELEMENTS=${#args[@]}

echo "// Autogenerated file from gen_objects_h.sh" > $1
for (( i=1;i<$ELEMENTS;i++)); do
    echo "#include \"${args[${i}]#src/}\"" >> $1
done