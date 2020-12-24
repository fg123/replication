FROM mhart/alpine-node:15.4.0

RUN apk add --no-cache bash

ADD package.json /app/
WORKDIR /app

COPY . .

RUN npm install --production
CMD ["npm", "run", "prod-client"]