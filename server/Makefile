EXE = game
SRC_DIR = src
SRC = $(shell find src/ -name "*.cc")
OBJ = $(SRC:%.cc=%.o)
HEADERS = $(shell find src/ -name "*.h")
USOCKET = $(SRC_DIR)/uWebSocket/uSocket
CPPFLAGS += -std=c++17
CFLAGS += -g -Wall -fmax-errors=5 -I $(SRC_DIR) -I $(USOCKET)/src 
LDLIBS = -L/usr/lib -L$(USOCKET) -lz -l:uSockets.a -lpthread

all: $(USOCKET)/uSockets.a main

main: $(OBJ)
	mkdir -p bin
	$(CXX) $(LDFLAGS) $^ $(LDLIBS) -o bin/$(EXE)

%.o: %.cc $(HEADERS)
	$(CXX) $(CPPFLAGS) $(CFLAGS) -c $< -o $@

$(USOCKET)/uSockets.a:
	$(MAKE) $(USOCKET)

.PHONY: all clean release

clean:
	find . -name "*.o" -type f -delete
	rm -f *~ core $(SRC_DIR)/*~