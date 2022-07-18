FROM node:16.14-alpine3.14

WORKDIR /app
COPY . /app

# You may have an easier time just copying everything... or creating a dev container to do this.

VOLUME [ "/app/data/patients" ]

RUN yarn install --frozen-lockfile && yarn cache clean

CMD [ "yarn", "start" ]