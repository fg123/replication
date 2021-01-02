FROM ubuntu:18.04

WORKDIR /app

COPY . .

RUN chmod +x server/bin/game_server_prod

CMD ["server/bin/game_server_prod", "data/maps/map1.json"]