
ARG GB_BASE_IMAGE=ghcr.io/gobletqa/goblet-base:develop

FROM $GB_BASE_IMAGE as goblet-installer
WORKDIR /keg/tap
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn install --frozen-lockfile
COPY . .

FROM $GB_BASE_IMAGE as goblet-runner
WORKDIR /keg/tap
ARG DOC_APP_PATH=/keg/tap
ARG KEG_PROXY_PORT=19006
COPY --from=goblet-installer /keg/tap /keg/tap
RUN ln -s /keg/tap/node_modules $HOME/.node_modules && \
    ln -s /keg/tap/node_modules /keg/node_modules
EXPOSE $KEG_PROXY_PORT
CMD [ "/bin/bash", "container/initialize.sh" ]
