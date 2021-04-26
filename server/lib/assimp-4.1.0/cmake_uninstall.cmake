IF(NOT EXISTS "/mnt/f/replication/server/lib/assimp-4.1.0/install_manifest.txt")
  MESSAGE(FATAL_ERROR "Cannot find install manifest: \"/mnt/f/replication/server/lib/assimp-4.1.0/install_manifest.txt\"")
ENDIF(NOT EXISTS "/mnt/f/replication/server/lib/assimp-4.1.0/install_manifest.txt")

FILE(READ "/mnt/f/replication/server/lib/assimp-4.1.0/install_manifest.txt" files)
STRING(REGEX REPLACE "\n" ";" files "${files}")
FOREACH(file ${files})
  MESSAGE(STATUS "Uninstalling \"$ENV{DESTDIR}${file}\"")
  EXEC_PROGRAM(
    "/opt/cmake-3.19.4-Linux-x86_64/bin/cmake" ARGS "-E remove \"$ENV{DESTDIR}${file}\""
    OUTPUT_VARIABLE rm_out
    RETURN_VALUE rm_retval
    )
  IF(NOT "${rm_retval}" STREQUAL 0)
    MESSAGE(FATAL_ERROR "Problem when removing \"$ENV{DESTDIR}${file}\"")
  ENDIF(NOT "${rm_retval}" STREQUAL 0)
ENDFOREACH(file)
