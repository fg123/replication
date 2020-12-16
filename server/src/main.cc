#include "game.h"
#include "timer.h"
#include "objects/player.h"

#include <thread>
#include <mutex>

#include "uWebSocket/App.h"

static bool gameRunning = true;

static const int TickRate = 128;
static const int ReplicateRate = 15;

void GameLoop(Timer& gameTimer) {
    while (gameRunning) {
        gameTimer.Tick();
    }
}

int main() {
    Timer gameTimer;
    Game game;
    gameTimer.ScheduleInterval(std::bind(&Game::Tick, &game, std::placeholders::_1),
            1000.0 / TickRate);
#ifdef BUILD_SERVER
    gameTimer.ScheduleInterval(std::bind(&Game::Replicate, &game, std::placeholders::_1),
        1000.0 / ReplicateRate);
#endif

    std::thread s { GameLoop, std::ref(gameTimer) };
    
    uWS::App().get("/hello", [](auto *res, auto *req) {
        res->end("Hello World!");
    }).ws<PlayerSocketData>("/connect", {
        .compression = uWS::SHARED_COMPRESSOR,
        .maxPayloadLength = 16 * 1024,
        .idleTimeout = 10,
        .maxBackpressure = 1 * 1024 * 1024,
        /* Handlers */
        .upgrade = nullptr,
        .open = [&game](auto* ws) {
            /* Open event here, you may access ws->getUserData() which points to a PerSocketData struct */
            std::cout << "Connection Opened" << std::endl;
            PlayerSocketData* data = static_cast<PlayerSocketData*>(ws->getUserData());
            data->ws = ws;
            game.AddPlayer(data);
        },
        .message = [](auto *ws, std::string_view message, uWS::OpCode opCode) {
            std::cout << message << std::endl;
            PlayerSocketData* data = static_cast<PlayerSocketData*>(ws->getUserData());
            if (!data->playerObject) {
                // Next tick hasn't been scheduled yet
                return;
            }
            json obj = json::parse(message);
            if (obj["event"] == "keyup") {
                //std::cout << "KEYUP " << obj["key"] << std::endl;
                std::string key = obj["key"];
                std::scoped_lock lock(data->playerObject->socketDataMutex);
                data->playerObject->keyboardState.erase(key);
            }
            else if (obj["event"] == "keydown") {
                //std::cout << "KEYDOWN " << obj["key"] << std::endl;
                std::string key = obj["key"];
                std::scoped_lock lock(data->playerObject->socketDataMutex);
                data->playerObject->keyboardState.insert(key);
            }
            else if (obj["event"] == "mousemove") {
                std::scoped_lock lock(data->playerObject->socketDataMutex);
                data->playerObject->mousePosition.x = obj["x"];
                data->playerObject->mousePosition.y = obj["y"];
            }
        },
        .drain = [](auto */*ws*/) {
            /* Check ws->getBufferedAmount() here */
        },
        .ping = [](auto */*ws*/) {
            /* Not implemented yet */
        },
        .pong = [](auto */*ws*/) {
            /* Not implemented yet */
        },
        .close = [&game](auto* ws, int /*code*/, std::string_view /*message*/) {
            /* You may access ws->getUserData() here */
            game.RemovePlayer(static_cast<PlayerSocketData*>(ws->getUserData()));
        }
    }).listen(8080, [](auto *listenSocket) {
        if (listenSocket) {
            std::cout << "Listening for connections..." << std::endl;
        }
    }).run();

    gameRunning = false;
}