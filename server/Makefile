EXE = game
SRC_DIR = src
SRC = $(shell find src/ -name "*.cc" | grep -v "main")
SERVER_SRC = $(SRC) src/main.cc
CLIENT_SRC = $(SRC) src/client_main.cc
SERVER_OBJ = $(SERVER_SRC:%.cc=%.o)
# Use .wo for webassembly
CLIENT_OBJ = $(CLIENT_SRC:%.cc=%.wo)
HEADERS = $(shell find src/ -name "*.h")
USOCKET = $(SRC_DIR)/uWebSocket/uSocket

CPPFLAGS += -std=c++17
CFLAGS += -g -Wall -I $(SRC_DIR) -I $(USOCKET)/src 
LDLIBS = -L/usr/lib
SERVER_LDLIBS = $(LDLIBS) -L$(USOCKET) -lz -l:uSockets.a -lpthread
WASM_FLAGS = -g4 -s ASSERTIONS=2 -s SAFE_HEAP=1 -s STACK_OVERFLOW_CHECK=1 \
	-s MODULARIZE -s EXPORTED_RUNTIME_METHODS=['ccall'] \
	-s EXTRA_EXPORTED_RUNTIME_METHODS=['stringToUTF8','lengthBytesUTF8','UTF8ToString'] \
	--source-map-base http://localhost:8000/ \
	-s ALLOW_MEMORY_GROWTH=1

all: server client

server: $(SERVER_OBJ) $(USOCKET)/uSockets.a
	mkdir -p bin
	$(CXX) $(LDFLAGS) $^ $(SERVER_LDLIBS) -g -o bin/$(EXE)_server

client: $(CLIENT_OBJ)
	em++ -O2 $(LDFLAGS) $^ $(LDLIBS) $(WASM_FLAGS) -o bin/$(EXE)_client.js
	cp bin/$(EXE)_client.wasm ../client/dist/
	cp bin/$(EXE)_client.js ../client/
	cp bin/$(EXE)_client.wasm.map ../client/dist/

%.o: %.cc $(HEADERS)
	$(CXX) $(CPPFLAGS) $(CFLAGS) -DBUILD_SERVER -c $< -o $@

%.wo: %.cc $(HEADERS)
	em++ -O2 $(CPPFLAGS) $(CFLAGS) -DBUILD_CLIENT -c $< -o $@

$(USOCKET)/uSockets.a:
	$(MAKE) $(USOCKET)

.PHONY: all clean release

clean:
	find . -name "*.o" -type f -delete
	find . -name "*.wo" -type f -delete
	rm -f *~ core $(SRC_DIR)/*~