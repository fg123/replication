# CMAKE generated file: DO NOT EDIT!
# Generated by "Unix Makefiles" Generator, CMake Version 3.19

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:


#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:


# Disable VCS-based implicit rules.
% : %,v


# Disable VCS-based implicit rules.
% : RCS/%


# Disable VCS-based implicit rules.
% : RCS/%,v


# Disable VCS-based implicit rules.
% : SCCS/s.%


# Disable VCS-based implicit rules.
% : s.%


.SUFFIXES: .hpux_make_needs_suffix_list


# Command-line flag to silence nested $(MAKE).
$(VERBOSE)MAKESILENT = -s

#Suppress display of executed commands.
$(VERBOSE).SILENT:

# A target that is always out of date.
cmake_force:

.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

# The shell in which to execute make rules.
SHELL = /bin/sh

# The CMake executable.
CMAKE_COMMAND = /opt/cmake-3.19.4-Linux-x86_64/bin/cmake

# The command to remove a file.
RM = /opt/cmake-3.19.4-Linux-x86_64/bin/cmake -E rm -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = /mnt/f/replication/server/lib/assimp-4.1.0

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /mnt/f/replication/server/lib/assimp-4.1.0

# Include any dependencies generated for this target.
include tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/depend.make

# Include the progress variables for this target.
include tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/progress.make

# Include the compile flags for this target's objects.
include tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/flags.make

tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/CompareDump.cpp.o: tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/flags.make
tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/CompareDump.cpp.o: tools/assimp_cmd/CompareDump.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/mnt/f/replication/server/lib/assimp-4.1.0/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building CXX object tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/CompareDump.cpp.o"
	cd /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/assimp_cmd.dir/CompareDump.cpp.o -c /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd/CompareDump.cpp

tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/CompareDump.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/assimp_cmd.dir/CompareDump.cpp.i"
	cd /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd/CompareDump.cpp > CMakeFiles/assimp_cmd.dir/CompareDump.cpp.i

tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/CompareDump.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/assimp_cmd.dir/CompareDump.cpp.s"
	cd /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd/CompareDump.cpp -o CMakeFiles/assimp_cmd.dir/CompareDump.cpp.s

tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/ImageExtractor.cpp.o: tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/flags.make
tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/ImageExtractor.cpp.o: tools/assimp_cmd/ImageExtractor.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/mnt/f/replication/server/lib/assimp-4.1.0/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Building CXX object tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/ImageExtractor.cpp.o"
	cd /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/assimp_cmd.dir/ImageExtractor.cpp.o -c /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd/ImageExtractor.cpp

tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/ImageExtractor.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/assimp_cmd.dir/ImageExtractor.cpp.i"
	cd /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd/ImageExtractor.cpp > CMakeFiles/assimp_cmd.dir/ImageExtractor.cpp.i

tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/ImageExtractor.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/assimp_cmd.dir/ImageExtractor.cpp.s"
	cd /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd/ImageExtractor.cpp -o CMakeFiles/assimp_cmd.dir/ImageExtractor.cpp.s

tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/Main.cpp.o: tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/flags.make
tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/Main.cpp.o: tools/assimp_cmd/Main.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/mnt/f/replication/server/lib/assimp-4.1.0/CMakeFiles --progress-num=$(CMAKE_PROGRESS_3) "Building CXX object tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/Main.cpp.o"
	cd /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/assimp_cmd.dir/Main.cpp.o -c /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd/Main.cpp

tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/Main.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/assimp_cmd.dir/Main.cpp.i"
	cd /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd/Main.cpp > CMakeFiles/assimp_cmd.dir/Main.cpp.i

tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/Main.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/assimp_cmd.dir/Main.cpp.s"
	cd /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd/Main.cpp -o CMakeFiles/assimp_cmd.dir/Main.cpp.s

tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/WriteDumb.cpp.o: tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/flags.make
tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/WriteDumb.cpp.o: tools/assimp_cmd/WriteDumb.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/mnt/f/replication/server/lib/assimp-4.1.0/CMakeFiles --progress-num=$(CMAKE_PROGRESS_4) "Building CXX object tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/WriteDumb.cpp.o"
	cd /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/assimp_cmd.dir/WriteDumb.cpp.o -c /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd/WriteDumb.cpp

tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/WriteDumb.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/assimp_cmd.dir/WriteDumb.cpp.i"
	cd /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd/WriteDumb.cpp > CMakeFiles/assimp_cmd.dir/WriteDumb.cpp.i

tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/WriteDumb.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/assimp_cmd.dir/WriteDumb.cpp.s"
	cd /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd/WriteDumb.cpp -o CMakeFiles/assimp_cmd.dir/WriteDumb.cpp.s

tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/Info.cpp.o: tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/flags.make
tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/Info.cpp.o: tools/assimp_cmd/Info.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/mnt/f/replication/server/lib/assimp-4.1.0/CMakeFiles --progress-num=$(CMAKE_PROGRESS_5) "Building CXX object tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/Info.cpp.o"
	cd /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/assimp_cmd.dir/Info.cpp.o -c /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd/Info.cpp

tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/Info.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/assimp_cmd.dir/Info.cpp.i"
	cd /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd/Info.cpp > CMakeFiles/assimp_cmd.dir/Info.cpp.i

tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/Info.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/assimp_cmd.dir/Info.cpp.s"
	cd /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd/Info.cpp -o CMakeFiles/assimp_cmd.dir/Info.cpp.s

tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/Export.cpp.o: tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/flags.make
tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/Export.cpp.o: tools/assimp_cmd/Export.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/mnt/f/replication/server/lib/assimp-4.1.0/CMakeFiles --progress-num=$(CMAKE_PROGRESS_6) "Building CXX object tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/Export.cpp.o"
	cd /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/assimp_cmd.dir/Export.cpp.o -c /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd/Export.cpp

tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/Export.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/assimp_cmd.dir/Export.cpp.i"
	cd /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd/Export.cpp > CMakeFiles/assimp_cmd.dir/Export.cpp.i

tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/Export.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/assimp_cmd.dir/Export.cpp.s"
	cd /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd/Export.cpp -o CMakeFiles/assimp_cmd.dir/Export.cpp.s

# Object files for target assimp_cmd
assimp_cmd_OBJECTS = \
"CMakeFiles/assimp_cmd.dir/CompareDump.cpp.o" \
"CMakeFiles/assimp_cmd.dir/ImageExtractor.cpp.o" \
"CMakeFiles/assimp_cmd.dir/Main.cpp.o" \
"CMakeFiles/assimp_cmd.dir/WriteDumb.cpp.o" \
"CMakeFiles/assimp_cmd.dir/Info.cpp.o" \
"CMakeFiles/assimp_cmd.dir/Export.cpp.o"

# External object files for target assimp_cmd
assimp_cmd_EXTERNAL_OBJECTS =

bin/assimp: tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/CompareDump.cpp.o
bin/assimp: tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/ImageExtractor.cpp.o
bin/assimp: tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/Main.cpp.o
bin/assimp: tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/WriteDumb.cpp.o
bin/assimp: tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/Info.cpp.o
bin/assimp: tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/Export.cpp.o
bin/assimp: tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/build.make
bin/assimp: lib/libassimp.a
bin/assimp: /usr/lib/x86_64-linux-gnu/libz.so
bin/assimp: lib/libIrrXML.a
bin/assimp: /usr/lib/x86_64-linux-gnu/librt.so
bin/assimp: tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/link.txt
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --bold --progress-dir=/mnt/f/replication/server/lib/assimp-4.1.0/CMakeFiles --progress-num=$(CMAKE_PROGRESS_7) "Linking CXX executable ../../bin/assimp"
	cd /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd && $(CMAKE_COMMAND) -E cmake_link_script CMakeFiles/assimp_cmd.dir/link.txt --verbose=$(VERBOSE)

# Rule to build all files generated by this target.
tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/build: bin/assimp

.PHONY : tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/build

tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/clean:
	cd /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd && $(CMAKE_COMMAND) -P CMakeFiles/assimp_cmd.dir/cmake_clean.cmake
.PHONY : tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/clean

tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/depend:
	cd /mnt/f/replication/server/lib/assimp-4.1.0 && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /mnt/f/replication/server/lib/assimp-4.1.0 /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd /mnt/f/replication/server/lib/assimp-4.1.0 /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd /mnt/f/replication/server/lib/assimp-4.1.0/tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : tools/assimp_cmd/CMakeFiles/assimp_cmd.dir/depend

