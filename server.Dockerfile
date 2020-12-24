FROM mhart/alpine-node:15.4.0

RUN apk add --no-cache bash git gcc g++ make libc-dev zlib-dev libstdc++

COPY . .

RUN cd server/src/uWebSocket/uSocket && make
RUN cd server && make server_prod

CMD ["bin/game_server_prod"]