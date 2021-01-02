FROM mhart/alpine-node:15.4.0

RUN apk add --no-cache bash

COPY . .

CMD ["server/bin/game_server_prod"]