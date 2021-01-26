FROM mhart/alpine-node:15.4.0

RUN apk add --no-cache bash

ADD package.json /app/
WORKDIR /app
RUN npm install --production

COPY . .

RUN chmod +x server/bin/game_server_prod

CMD ["npm", "run", "run-both"]

EXPOSE 80
EXPOSE 8080