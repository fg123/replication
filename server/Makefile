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

all: server client

server: $(SERVER_OBJ) $(USOCKET)/uSockets.a
	mkdir -p bin
	$(CXX) $(LDFLAGS) $^ $(SERVER_LDLIBS) -o bin/$(EXE)_server

client: $(CLIENT_OBJ)
	em++ -O2 $(LDFLAGS) $^ $(LDLIBS) -g -s MODULARIZE -s EXPORTED_RUNTIME_METHODS=['ccall'] -s EXTRA_EXPORTED_RUNTIME_METHODS=['stringToUTF8','lengthBytesUTF8'] -o bin/$(EXE)_client.js
	cp bin/$(EXE)_client.wasm ../client/dist/
	cp bin/$(EXE)_client.js ../client/

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