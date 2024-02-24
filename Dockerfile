FROM node:18.19.0-bookworm-slim

WORKDIR /app
COPY . /app

# You may have an easier time just copying everything... or creating a dev container to do this.

VOLUME [ "/app/data/patients" ]

RUN yarn install --frozen-lockfile && yarn cache clean

CMD [ "yarn", "start" ]