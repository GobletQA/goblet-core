
ARG GB_BASE_IMAGE=ghcr.io/gobletqa/goblet-base:develop

FROM $GB_BASE_IMAGE as goblet-installer
WORKDIR /keg/tap
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn install --non-interactive --ignore-optional --frozen-lockfile
COPY . .

# Commenting out for now until the compile script it finished
# FROM $GB_BASE_IMAGE as goblet-builder
# WORKDIR /keg/tap
# ARG DOC_APP_PATH=/keg/tap
# ARG KEG_PROXY_PORT=19006
# COPY --from=goblet-installer /keg/tap /keg/tap
# RUN yarn make

FROM $GB_BASE_IMAGE as goblet-runner
WORKDIR /keg/tap
ARG DOC_APP_PATH=/keg/tap
ARG KEG_PROXY_PORT=19006
COPY --from=goblet-installer /keg/tap /keg/tap
RUN ln -s /keg/tap/node_modules $HOME/.node_modules && \
    ln -s /keg/tap/node_modules /keg/node_modules
EXPOSE $KEG_PROXY_PORT
CMD [ "/bin/bash", "container/run.sh" ]
