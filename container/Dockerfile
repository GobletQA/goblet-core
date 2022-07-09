
ARG GB_BASE_IMAGE=ghcr.io/gobletqa/goblet-base:develop

FROM $GB_BASE_IMAGE as goblet-builder
WORKDIR /keg/tap
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn install --non-interactive --ignore-optional
COPY . .

FROM $GB_BASE_IMAGE as goblet-runner
WORKDIR /keg/tap
ARG DOC_APP_PATH=/keg/tap
ARG KEG_PROXY_PORT=19006
COPY --from=goblet-builder /keg/tap /keg/tap
EXPOSE $KEG_PROXY_PORT
CMD [ "/bin/bash", "container/run.sh" ]
