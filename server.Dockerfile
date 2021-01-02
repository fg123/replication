FROM mhart/alpine-node:15.4.0

RUN apk add --no-cache bash

WORKDIR /app

COPY . .

RUN chmod +x server/bin/game_server_prod

CMD ["./server/bin/game_server_prod"]