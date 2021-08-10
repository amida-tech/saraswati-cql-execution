FROM node:13.10.1-alpine3.11

WORKDIR /app

COPY ./package.json .
COPY ./yarn.lock .
COPY ./config.js .
COPY ./.env.example ./.env
COPY ./bin/ /app/bin
COPY ./cql/ /app/cql
COPY ./data/codes/ /app/data/codes
COPY ./examples/ /app/examples
COPY ./exec-files/ /app/exec-files
COPY ./json-elm/ /app/json-elm
COPY ./src/ /app/src
COPY ./processor.js .

VOLUME [ "/app/data/patients" ]

RUN yarn install --frozen-lockfile && yarn cache clean
#EXPOSE 3000
CMD [ "yarn", "start" ]