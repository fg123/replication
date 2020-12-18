FROM mhart/alpine-node:10

RUN apk add --no-cache bash git gcc g++ make libc-dev zlib-dev

ADD package.json /app/
WORKDIR /app
RUN npm install --production

COPY . .

RUN cd server && make server_prod

CMD ["npm", "run", "prod"]