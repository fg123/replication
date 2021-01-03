FROM mhart/alpine-node:15.4.0

RUN apk add --no-cache bash

WORKDIR /app

COPY . .
CMD ["npm", "run", "prod-client"]