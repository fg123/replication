EXE = game
SRC_DIR = src
SRC = $(shell find src/ -name "*.cc" | grep -v "main" | grep -v "client")
SERVER_SRC = $(SRC) src/main.cc
CLIENT_SRC = $(SRC) src/client_main.cc src/client_gl.cc src/client_shader.cc src/client_audio.cc
SERVER_OBJ = $(SERVER_SRC:%.cc=%.o)
# Use .wo for webassembly
CLIENT_OBJ = $(CLIENT_SRC:%.cc=%.wo)
SERVER_DEPS = $(SERVER_OBJ:%.o=%.d)
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
SERVER_DEBUG = -g
SERVER_PROD = -O2
SERVER_LDLIBS = $(LDLIBS) -lz -lpthread
WASM_DEBUG = -g4 -s ASSERTIONS=2 -s SAFE_HEAP=1 -s STACK_OVERFLOW_CHECK=1
WASM_FLAGS = \
	-s EXTRA_EXPORTED_RUNTIME_METHODS=['stringToUTF8','lengthBytesUTF8','UTF8ToString'] \
	-s ALLOW_MEMORY_GROWTH=1 \
	-s DISABLE_EXCEPTION_CATCHING=0 \
	-s INITIAL_MEMORY=128MB \
	-s MIN_WEBGL_VERSION=2 \
	-s MAX_WEBGL_VERSION=2 \
	--source-map-base http://localhost:8000/

WASM_LINKING_FLAGS = \
	-lopenal \
	--preload-file ../data@/
GCC_FLAGS = -Wno-class-memaccess -fmax-errors=5

all: server client

server: $(SERVER_OBJ) $(USOCKET)/uSockets.a
	mkdir -p bin
	$(CXX) $(GCC_FLAGS) $(LDFLAGS) $^ $(SERVER_LDLIBS) $(SERVER_DEBUG) -o bin/$(EXE)_server

server_prod: $(SERVER_OBJ) $(USOCKET)/uSockets.a
	mkdir -p bin
	$(CXX) $(GCC_FLAGS) $(LDFLAGS) $^ $(SERVER_LDLIBS) $(SERVER_PROD) -o bin/$(EXE)_server_prod

client: $(CLIENT_OBJ)
	em++ -O3 $(LDFLAGS) $^ $(LDLIBS) $(WASM_FLAGS) $(WASM_DEBUG) $(WASM_LINKING_FLAGS) -o bin/$(EXE)_client.js
	cp bin/$(EXE)_client.wasm ../client/dist/
	cp bin/$(EXE)_client.js ../client/dist/
	cp bin/$(EXE)_client.data ../client/dist/

client_prod: $(CLIENT_OBJ)
	em++ -O3 $(LDFLAGS) $^ $(LDLIBS) $(WASM_FLAGS) $(WASM_LINKING_FLAGS) -o bin/$(EXE)_client_prod.js
	cp bin/$(EXE)_client_prod.wasm ../client/dist/
	cp bin/$(EXE)_client_prod.js ../client/dist/
	cp bin/$(EXE)_client_prod.data ../client/dist/

%.o: %.cc
	$(CXX) $(GCC_FLAGS) $(CPPFLAGS) -DBUILD_SERVER -g -MMD -c $< -o $@

%.wo: %.cc
	em++ -O3 $(CPPFLAGS) $(WASM_FLAGS) -DBUILD_CLIENT -g4 -MMD -MF $(<:%.cc=%.wd) -c $< -o $@

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