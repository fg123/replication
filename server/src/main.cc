#include "game.h"
#include "timer.h"
#include "characters/marine.h"
#include "characters/archer.h"
#include "characters/hookman.h"
#include "characters/bombmaker.h"
#include "logging.h"

#include <thread>
#include <mutex>
#include <chrono>
#include <exception>

#include "uWebSocket/App.h"

static bool gameRunning = true;

void GameLoop(Timer& gameTimer) {
    LOG_DEBUG("Tick Interval: " << TickInterval);
    while (gameRunning) {
        gameTimer.Tick();
        // Reduce CPU load
        std::this_thread::yield();
    }
}

int main(int argc, char** argv) {
    try {
        std::string mapPath = "maps/map1.json";
        bool isProduction = false;
        for (int i = 1; i < argc; i++) {
            std::string arg { argv[i] };
            if (arg == "-p") {
                isProduction = true;
            }
            else {
                mapPath = arg;
            }
        }

        Timer gameTimer;

        Game game { mapPath, isProduction };
        ScheduledCall* gameTick = gameTimer.ScheduleInterval(
            std::bind(&Game::Tick, &game, std::placeholders::_1),
            TickInterval
        );

        gameTimer.ScheduleInterval([gameTick](Time time) {
            LOG_INFO("Average Tick Interval: " << gameTick->performance.GetAverage());
        }, 3000);

    #ifdef BUILD_SERVER
        gameTimer.ScheduleInterval(std::bind(&Game::QueueAllDirtyForReplication, &game, std::placeholders::_1),
            ReplicateInterval);
    #endif

        std::thread s { GameLoop, std::ref(gameTimer) };

        uWS::App().get("/status", [](auto *res, auto */*req*/) {
            res->end("ok");
        }).ws<PlayerSocketData>("/connect", {
            .compression = uWS::DEDICATED_COMPRESSOR_4KB,
            .maxPayloadLength = 16 * 1024,
            .idleTimeout = 30,
            .maxBackpressure = 1 * 1024 * 1024,
            /* Handlers */
            .upgrade = nullptr,
            .open = [&game](auto* ws) {
                /* Open event here, you may access ws->getUserData() which points to a PerSocketData struct */
                LOG_INFO("Connection Opened");
                PlayerSocketData* data = static_cast<PlayerSocketData*>(ws->getUserData());
                data->ws = ws;
                data->eventLoop = uWS::Loop::get();
                data->nextRespawnCharacter = "Archer";
                PlayerObject* playerObject = new Archer(game, Vector3(0, 30, 0));
                data->playerObject = playerObject;

                game.AddPlayer(data, playerObject);
            },
            .message = [&mapPath](auto *ws, std::string_view message, uWS::OpCode opCode) {
                PlayerSocketData* data = static_cast<PlayerSocketData*>(ws->getUserData());
                if (!data->playerObject) {
                    // Next tick hasn't been scheduled yet
                    return;
                }
                std::istringstream stream { std::string(message) };
                rapidjson::IStreamWrapper wrap(stream);

                JSONDocument obj;
                obj.ParseStream(wrap);
                // LOG_DEBUG(message);
                if (obj["event"] == "rdy") {
                    data->isReady = true;
                }
                else if (obj["event"] == "hb") {
                    ws->send(message, uWS::OpCode::TEXT);
                }
                else if (obj["event"] == "mapPath") {
                    LOG_DEBUG("Sending Map Path");
                    ws->send("{\"mapPath\": \"" + mapPath + "\"}", uWS::OpCode::TEXT);
                }
                else if (obj["event"] == "setchar") {
                    std::string charName { obj["char"].GetString(), obj["char"].GetStringLength() };
                    data->nextRespawnCharacter = charName;
                    LOG_DEBUG("Changing character to " << charName);
                    ws->send("{\"char-selected\": \"" + charName + "\"}", uWS::OpCode::TEXT);
                }
                else {
                    data->playerObject->OnInput(obj);
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
                LOG_INFO("Listening for connections...");
            }
        }).run();

        gameRunning = false;
    }
    catch (const std::system_error& e) {
        std::clog << e.what() << " (" << e.code() << ")" << std::endl;
    }
}