FROM alpine:3.7

RUN apk add --no-cache bash

WORKDIR /app

COPY . .

RUN chmod +x server/bin/game_server_prod

ENTRYPOINT ["./server/bin/game_server_prod"]