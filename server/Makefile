EXE = game
SRC_DIR = src
SRC = $(shell find src/ -name "*.cc" | grep -v "main" | grep -v "client")
SERVER_SRC = $(SRC) src/main.cc
COLLLIDER_TEST_SRC = $(SRC) src/collider-test-main.cc
CLIENT_SRC = $(SRC) src/client_main.cc src/client_gl.cc src/client_shader.cc src/client_audio.cc


DATA_DIRS = $(shell find ../data/ -type d)
DATA_FILES = $(shell find ../data/ -type f -name '*')

# Use .wo for webassembly
SERVER_OBJ = $(SERVER_SRC:%.cc=%.o)
SERVER_DEPS = $(SERVER_OBJ:%.o=%.d)

COLLIDER_TEST_OBJ = $(COLLLIDER_TEST_SRC:%.cc=%.o)
COLLIDER_TEST_DEPS = $(COLLIDER_TEST_OBJ:%.o=%.d)

CLIENT_OBJ = $(CLIENT_SRC:%.cc=%.wo)
CLIENT_DEPS = $(CLIENT_OBJ:%.wo=%.wd)

HEADERS = $(shell find src/ -name "*.h") Makefile

USOCKET = $(SRC_DIR)/uWebSocket/uSocket
# LIBASSIMP = lib/assimp-4.1.0/lib/cc-libassimp.a lib/assimp-4.1.0/lib/libIrrXml.a
# EMLIBASSIMP = lib/assimp-4.1.0/lib/em-libassimp.a lib/assimp-4.1.0/lib/libIrrXml.a

CPPFLAGS = -std=c++17 -Wall \
	-I $(SRC_DIR) \
	-I $(USOCKET)/src \
	-I $(SRC_DIR)/objects \
	-I $(SRC_DIR)/animations \
# -I lib/assimp-4.1.0/include

LDLIBS = -L/usr/lib
SERVER_DEBUG = -g -O2
SERVER_PROD = -O2
SERVER_LDLIBS = $(LDLIBS) -lz -lpthread
COLLIDER_TEST_LDLIBS = $(SERVER_LDLIBS) -lglfw -lGL -lGLEW
# -s SAFE_HEAP=1
WASM_DEBUG = -g4 -s ASSERTIONS=2 -s STACK_OVERFLOW_CHECK=1
WASM_FLAGS =

WASM_LINKING_FLAGS = \
	-lopenal \
	--preload-file ../data/maps@/maps \
	--preload-file ../data/models@/models \
	--preload-file ../data/shaders@/shaders \
	--preload-file ../data/sounds@/sounds \
	--preload-file ../data/textures@/textures \
	-s EXTRA_EXPORTED_RUNTIME_METHODS=['stringToUTF8','lengthBytesUTF8','UTF8ToString'] \
	-s ALLOW_MEMORY_GROWTH=1 \
	-s INITIAL_MEMORY=128MB \
	-s MIN_WEBGL_VERSION=2 \
	-s MAX_WEBGL_VERSION=2 \
	--source-map-base http://localhost:8000/

GCC_FLAGS = -Wno-class-memaccess -fmax-errors=5

SERVER_OUTPUT = bin/$(EXE)_server
SERVER_OUTPUT_PROD = bin/$(EXE)_server_prod

CLIENT_OUTPUT = bin/$(EXE)_client.js

COLLIDER_TEST_OUTPUT = bin/$(EXE)_collider

all: $(SERVER_OUTPUT) $(CLIENT_OUTPUT) $(COLLIDER_TEST_OUTPUT)

server_prod: $(SERVER_OUTPUT_PROD)

$(SERVER_OUTPUT): $(SERVER_OBJ) $(USOCKET)/uSockets.a
	mkdir -p bin
	$(CXX) $(GCC_FLAGS) $(LDFLAGS) $^ $(SERVER_LDLIBS) $(SERVER_DEBUG) -o $(SERVER_OUTPUT)

$(COLLIDER_TEST_OUTPUT): $(COLLIDER_TEST_OBJ) $(USOCKET)/uSockets.a
	mkdir -p bin
	$(CXX) $(GCC_FLAGS) $(LDFLAGS) $^ $(COLLIDER_TEST_LDLIBS) $(SERVER_DEBUG) -o $(COLLIDER_TEST_OUTPUT)

$(SERVER_OUTPUT_PROD): $(SERVER_OBJ) $(USOCKET)/uSockets.a
	mkdir -p bin
	$(CXX) $(GCC_FLAGS) $(LDFLAGS) $^ $(SERVER_LDLIBS) $(SERVER_PROD) -o $(SERVER_OUTPUT_PROD)

$(CLIENT_OUTPUT): $(CLIENT_OBJ) $(DATA_DIRS) $(DATA_FILES)
	em++ -O2 $(LDFLAGS) $(CLIENT_OBJ) $(LDLIBS) $(WASM_FLAGS) $(WASM_DEBUG) $(WASM_LINKING_FLAGS) -o $(CLIENT_OUTPUT)
	cp bin/$(EXE)_client.wasm ../client/dist/
	cp bin/$(EXE)_client.js ../client/dist/
	cp bin/$(EXE)_client.data ../client/dist/

client_prod: $(CLIENT_OBJ) $(DATA_DIRS) $(DATA_FILES)
	em++ -O2 $(LDFLAGS) $(CLIENT_OBJ) $(LDLIBS) $(WASM_FLAGS) $(WASM_LINKING_FLAGS) -o $(CLIENT_OUTPUT)
	cp bin/$(EXE)_client.wasm ../client/dist/
	cp bin/$(EXE)_client.js ../client/dist/
	cp bin/$(EXE)_client.data ../client/dist/

%.o: %.cc
	$(CXX) -O2 $(GCC_FLAGS) $(CPPFLAGS) -DBUILD_SERVER -g -MMD -c $< -o $@

%.wo: %.cc
	em++ -O2 $(CPPFLAGS) $(WASM_FLAGS) -DBUILD_CLIENT -g4 -MMD -MF $(<:%.cc=%.wd) -c $< -o $@

$(USOCKET)/uSockets.a:
	$(MAKE) $(USOCKET)

-include $(SERVER_DEPS)

-include $(CLIENT_DEPS)

.PHONY: all clean release

clean:
	find . -name "*.o" -type f -delete
	find . -name "*.wo" -type f -delete
	find . -name "*.d" -type f -delete
	find . -name "*.wd" -type f -delete