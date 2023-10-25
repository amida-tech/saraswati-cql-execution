FROM node:18.18.2-bookworm-slim

WORKDIR /app
COPY . /app

# You may have an easier time just copying everything... or creating a dev container to do this.

VOLUME [ "/app/data/patients" ]

RUN yarn install --frozen-lockfile && yarn cache clean

CMD [ "yarn", "start" ]