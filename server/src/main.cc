#include "game.h"
#include "timer.h"
#include "tests.h"
#include "characters/marine.h"
#include "characters/archer.h"
#include "characters/hookman.h"
#include "characters/bombmaker.h"
#include "logging.h"
#include "global.h"

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

void Usage(char* arg0) {
    std::cout << "usage: " << arg0 << " [options] mapPath" << std::endl;
    std::cout << "    options: " << std::endl;
    std::cout << "        --production              : production mode" << std::endl;
    std::cout << "        --test                    : run only tests" << std::endl;
    std::cout << "        --client-draw-bvh         : draw bvh on client" << std::endl;
    std::cout << "        --client-draw-colliders   : draw colliders on client" << std::endl;
    std::cout << "        --help                    : shows this message" << std::endl;
}

int main(int argc, char** argv) {
    try {
        for (int i = 1; i < argc; i++) {
            std::string arg { argv[i] };
            if (arg == "--production") {
                GlobalSettings.IsProduction = true;
            }
            else if (arg == "--test") {
                GlobalSettings.RunTests = true;
            }
            else if (arg == "--client-draw-bvh") {
                GlobalSettings.Client_DrawBVH = true;
                GlobalSettings.Client_DrawColliders = true;
            }
            else if (arg == "--client-draw-colliders") {
                GlobalSettings.Client_DrawColliders = true;
            }
            else if (arg == "--help") {
                Usage(argv[0]);
                exit(1);
            }
            else {
                GlobalSettings.MapPath = arg;
            }
        }

        if (GlobalSettings.RunTests) {
            Game game;
            Tests tests { game };
            return tests.Run();
        }

        Timer gameTimer;

        Game game;
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
                data->nextRespawnCharacter = "Marine";
                PlayerObject* playerObject = new Marine(game, Vector3(0, 30, 0));
                data->playerObject = playerObject;

                game.AddPlayer(data, playerObject);
            },
            .message = [](auto *ws, std::string_view message, uWS::OpCode opCode) {
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
                else if (obj["event"] == "globalSettings") {
                    LOG_DEBUG("Sending Global Settings");
                    rapidjson::StringBuffer buffer;
                    rapidjson::Writer<rapidjson::StringBuffer> writer(buffer);
                    writer.StartObject();
                    writer.Key("globalSettings");
                    writer.StartObject();
                    GlobalSettings.Serialize(writer);
                    writer.EndObject();
                    writer.EndObject();
                    ws->send(buffer.GetString(), uWS::OpCode::TEXT);
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