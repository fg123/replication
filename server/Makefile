EXE = game
SRC_DIR = src
SRC = $(shell find src/ -name "*.cc" | grep -v "main")
SERVER_SRC = $(SRC) src/main.cc
CLIENT_SRC = $(SRC) src/client_main.cc
SERVER_OBJ = $(SERVER_SRC:%.cc=%.o)
# Use .wo for webassembly
CLIENT_OBJ = $(CLIENT_SRC:%.cc=%.wo)
SERVER_DEPS = $(SERVER_OBJ:%.o=%.d)
CLIENT_DEPS = $(CLIENT_OBJ:%.wo=%.wd)
HEADERS = $(shell find src/ -name "*.h") Makefile
USOCKET = $(SRC_DIR)/uWebSocket/uSocket

CPPFLAGS = -std=c++17 -Wall -I $(SRC_DIR) -I $(USOCKET)/src -I $(SRC_DIR)/objects
LDLIBS = -L/usr/lib
SERVER_DEBUG = -g
SERVER_PROD = -O2
SERVER_LDLIBS = $(LDLIBS) -L$(USOCKET) -lz -l:uSockets.a -lpthread
WASM_DEBUG = -g4 -s ASSERTIONS=2 -s SAFE_HEAP=1 -s STACK_OVERFLOW_CHECK=1
WASM_FLAGS = -s MODULARIZE \
	-s EXTRA_EXPORTED_RUNTIME_METHODS=['stringToUTF8','lengthBytesUTF8','UTF8ToString'] \
	-s ALLOW_MEMORY_GROWTH=1 \
	-s DISABLE_EXCEPTION_CATCHING=0

all: server client

server: $(SERVER_OBJ) $(USOCKET)/uSockets.a
	mkdir -p bin
	$(CXX) $(LDFLAGS) $^ $(SERVER_LDLIBS) $(SERVER_DEBUG) -o bin/$(EXE)_server

server_prod: $(SERVER_OBJ) $(USOCKET)/uSockets.a
	mkdir -p bin
	$(CXX) $(LDFLAGS) $^ $(SERVER_LDLIBS) $(SERVER_PROD) -o bin/$(EXE)_server_prod

client: $(CLIENT_OBJ)
	em++ $(LDFLAGS) $^ $(LDLIBS) $(WASM_FLAGS) $(WASM_DEBUG) -o bin/$(EXE)_client.js
	cp bin/$(EXE)_client.wasm ../client/dist/
	cp bin/$(EXE)_client.js ../client/

client_prod: $(CLIENT_OBJ)
	em++ -O2 $(LDFLAGS) $^ $(LDLIBS) $(WASM_FLAGS) -o bin/$(EXE)_client_prod.js
	cp bin/$(EXE)_client_prod.wasm ../client/dist/
	cp bin/$(EXE)_client_prod.js ../client/

%.o: %.cc
	$(CXX) $(CPPFLAGS) -DBUILD_SERVER -g -MMD -c $< -o $@

%.wo: %.cc
	em++ $(CPPFLAGS) $(WASM_FLAGS) -DBUILD_CLIENT -MMD -MF $(<:%.cc=%.wd) -c $< -o $@

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