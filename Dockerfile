FROM mhart/alpine-node:15.4.0

RUN apk add --no-cache bash git gcc g++ make libc-dev zlib-dev libstdc++

ADD package.json /app/
WORKDIR /app

COPY . .

RUN cat /etc/os-release
RUN g++ -v

RUN cd server/src/uWebSocket/uSocket && make
RUN cd server && make server_prod

RUN npm install --production
CMD ["npm", "run", "prod"]