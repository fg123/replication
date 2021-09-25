EXE = game

# The primary files are stored in src/ aka all the shared ones
#   We build a couple of binaries:
#    * game_server - the game executable
#    * game_client* - client wasm data for frontend
#    * game_collider - collider test
#    * game_editor - local editor for scene editing

SRC_DIR = src
SRC = $(shell find src/ -name "*.cc")
WENDY_SRC = $(shell find scripting/wendy/src/ -name "*.c" | grep -v "main")

LDLIBS = -L/usr/lib

RENDERING_SRC = $(shell find rendering/ -name "*.cc")

# For Each Subproject, define following + entry in the main linker
# Use .wo for webassembly
SERVER_SRC = $(SRC) $(WENDY_SRC) $(shell find server/ -name "*.cc")
SERVER_OBJ = $(patsubst %.cc,%.o,$(patsubst %.c,%.o,$(SERVER_SRC)))
SERVER_DEPS = $(SERVER_OBJ:%.o=%.d)
SERVER_LDLIBS = $(LDLIBS) -lz -lpthread -lstdc++fs

CLIENT_SRC = $(SRC) $(WENDY_SRC) $(shell find client/ -name "*.cc") $(RENDERING_SRC)
CLIENT_OBJ = $(patsubst %.cc,%.wo,$(patsubst %.c,%.wo,$(CLIENT_SRC)))
CLIENT_DEPS = $(CLIENT_OBJ:%.wo=%.wd)

COLLIDER_TEST_SRC = $(SRC) $(WENDY_SRC) $(shell find collider-test/ -name "*.cc")
COLLIDER_TEST_OBJ = $(patsubst %.cc,%.o,$(patsubst %.c,%.o,$(COLLIDER_TEST_SRC)))
COLLIDER_TEST_DEPS = $(COLLIDER_TEST_OBJ:%.o=%.d)
COLLIDER_TEST_OUTPUT = bin/$(EXE)_collider
COLLIDER_TEST_LDLIBS = $(SERVER_LDLIBS) -lglfw -lGL -lGLEW

EDITOR_SRC = $(SRC) $(WENDY_SRC) $(shell find editor/ -name "*.cc") $(RENDERING_SRC)
EDITOR_OBJ = $(patsubst %.cc,%.eo,$(patsubst %.c,%.eo,$(EDITOR_SRC)))
EDITOR_DEPS = $(EDITOR_OBJ:%.eo=%.ed)
EDITOR_OUTPUT = bin/$(EXE)_editor
EDITOR_LDLIBS = $(SERVER_LDLIBS) -lz -lpthread -lGL -lGLEW -lglfw -lopenal

DATA_DIRS = $(shell find ../data/ -type d)
DATA_FILES = $(shell find ../data/ -type f -name '*')

HEADERS = $(shell find src/ -name "*.h") Makefile

USOCKET = $(SRC_DIR)/uWebSocket/uSocket
EXTERNAL_INCLUDE = src/external/
# LIBASSIMP = lib/assimp-4.1.0/lib/cc-libassimp.a lib/assimp-4.1.0/lib/libIrrXml.a
# EMLIBASSIMP = lib/assimp-4.1.0/lib/em-libassimp.a lib/assimp-4.1.0/lib/libIrrXml.a

CPPFLAGS = -std=c++17 -Wall \
	-I $(SRC_DIR) \
	-I $(USOCKET)/src \
	-I $(SRC_DIR)/objects \
	-I $(SRC_DIR)/animations \
	-I $(SRC_DIR)/imgui \
	-I rendering/ \
	-I $(EXTERNAL_INCLUDE) \
	-I scripting

CFLAGS = -Wall \
	-I scripting/wendy/src/

# -I lib/assimp-4.1.0/include

SERVER_DEBUG = -g -O2
SERVER_PROD = -O2
# -s SAFE_HEAP=1
WASM_DEBUG = -g4 -s ASSERTIONS=2 -s STACK_OVERFLOW_CHECK=1
WASM_FLAGS =

WASM_LINKING_FLAGS = \
	-lopenal \
	-s EXTRA_EXPORTED_RUNTIME_METHODS=['stringToUTF8','lengthBytesUTF8','UTF8ToString'] \
	-s ALLOW_MEMORY_GROWTH=1 \
	-s INITIAL_MEMORY=128MB \
	-s MIN_WEBGL_VERSION=2 \
	-s MAX_WEBGL_VERSION=2 \
	-s FORCE_FILESYSTEM=1 \
	--source-map-base http://localhost:8000/

GCC_FLAGS = -Wno-class-memaccess -fmax-errors=5

SERVER_OUTPUT = bin/$(EXE)_server
SERVER_OUTPUT_PROD = bin/$(EXE)_server_prod

CLIENT_OUTPUT = ../client/dist/$(EXE)_client.js
CLIENT_DATA = ../client/dist/$(EXE)_client.data
CLIENT_DATA_JS = ../client/dist/$(EXE)_client_data.js

all: $(SERVER_OUTPUT) $(CLIENT_OUTPUT) $(CLIENT_DATA)

server_prod: $(SERVER_OUTPUT_PROD)

wendy_includes:
	mkdir -p $(EXTERNAL_INCLUDE)/wendy
	cp scripting/wendy/src/*.h $(EXTERNAL_INCLUDE)/wendy/

$(SERVER_OUTPUT): $(SERVER_OBJ) $(USOCKET)/uSockets.a
	mkdir -p bin
	$(CXX) $(GCC_FLAGS) $(LDFLAGS) $^ $(SERVER_LDLIBS) $(SERVER_DEBUG) -o $(SERVER_OUTPUT)

$(COLLIDER_TEST_OUTPUT): $(COLLIDER_TEST_OBJ) $(USOCKET)/uSockets.a
	mkdir -p bin
	$(CXX) $(GCC_FLAGS) $(LDFLAGS) $^ $(COLLIDER_TEST_LDLIBS) $(SERVER_DEBUG) -o $(COLLIDER_TEST_OUTPUT)

$(EDITOR_OUTPUT): $(EDITOR_OBJ) $(USOCKET)/uSockets.a
	mkdir -p bin
	$(CXX) $(GCC_FLAGS) $(LDFLAGS) $^ $(EDITOR_LDLIBS) $(SERVER_DEBUG) -o $(EDITOR_OUTPUT)

$(SERVER_OUTPUT_PROD): $(SERVER_OBJ) $(USOCKET)/uSockets.a
	mkdir -p bin
	$(CXX) $(GCC_FLAGS) $(LDFLAGS) $^ $(SERVER_LDLIBS) $(SERVER_PROD) -o $(SERVER_OUTPUT_PROD)

$(CLIENT_DATA): $(DATA_DIRS) $(DATA_FILES)
	python3 ${EMSDK}/upstream/emscripten/tools/file_packager.py $(CLIENT_DATA) \
		--js-output=$(CLIENT_DATA_JS) \
		--preload ../data/maps@/maps \
		--preload ../data/textures@/textures \
		--preload ../data/models@/models \
		--preload ../data/shaders@/shaders \
		--preload ../data/sounds@/sounds \
		--preload ../data/scripts@/scripts

$(CLIENT_OUTPUT): $(CLIENT_OBJ)
	em++ -O2 $(LDFLAGS) $(CLIENT_OBJ) $(LDLIBS) $(WASM_FLAGS) $(WASM_DEBUG) $(WASM_LINKING_FLAGS) -o $(CLIENT_OUTPUT)

client_prod: $(CLIENT_OBJ) $(CLIENT_DATA)
	em++ -O2 $(LDFLAGS) $(CLIENT_OBJ) $(LDLIBS) $(WASM_FLAGS) $(WASM_LINKING_FLAGS) -o $(CLIENT_OUTPUT)

%.o: %.cc
	$(CXX) -O2 $(GCC_FLAGS) $(CPPFLAGS) -DBUILD_SERVER -g -MMD -c $< -o $@

%.o: %.c
	$(CC) -O2 $(CFLAGS) -DBUILD_SERVER -g -MMD -c $< -o $@

%.wo: %.cc
	em++ -O2 $(CPPFLAGS) $(WASM_FLAGS) -DBUILD_CLIENT -g4 -MMD -MF $(<:%.cc=%.wd) -c $< -o $@

%.wo: %.c
	emcc -O2 $(CFLAGS) $(WASM_FLAGS) -DBUILD_CLIENT -g4 -MMD -MF $(<:%.c=%.wd) -c $< -o $@

%.eo: %.cc
	$(CXX) -O2 $(GCC_FLAGS) $(CPPFLAGS) -DBUILD_CLIENT -DBUILD_EDITOR -g -MMD -c $< -o $@

%.eo: %.c
	$(CC) -O2 $(CFLAGS) -DBUILD_CLIENT -DBUILD_EDITOR -g -MMD -c $< -o $@

$(SRC_DIR)/objects.h:
	./gen_objects_h.sh $@ $(shell find src/objects -name "*.h") $(shell find src/weapons -name "*.h") $<

$(USOCKET)/uSockets.a:
	$(MAKE) $(USOCKET)

-include $(SERVER_DEPS)

-include $(CLIENT_DEPS)

-include $(EDITOR_DEPS)

.PHONY: all clean release clean_deps

clean: clean_deps
	find . -name "*.o" -type f -delete
	find . -name "*.wo" -type f -delete
	find . -name "*.eo" -type f -delete
	rm $(CLIENT_OUTPUT)
	rm $(CLIENT_DATA)
	rm $(CLIENT_DATA_JS)

clean_deps:
	find . -name "*.d" -type f -delete
	find . -name "*.wd" -type f -delete
	find . -name "*.ed" -type f -delete