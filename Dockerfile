FROM alpine:3.7

RUN apk add --no-cache bash

COPY . .

RUN chmod +x /server/bin/game_server_prod

CMD ["/server/bin/game_server_prod"]