
ARG GB_BASE_IMAGE=ghcr.io/gobletqa/goblet-base:develop

# ---- Prune Stage ---- #
FROM $GB_BASE_IMAGE as goblet-pruner
WORKDIR /keg/tap
COPY . .
RUN cd /keg/tap/repos && \
    mkdir -p ../out/json/repos && \
    find . -name 'package.json' -print0 -exec cp -fprv --parents '{}' '../out/json/repos' ';' && \
    cd /keg/tap/out/json/repos && \
    rm -rf ./**/node_modules && \
    cp /keg/tap/yarn.lock /keg/tap/out/json/yarn.lock && \
    cp /keg/tap/package.json /keg/tap/out/json/package.json
# ---- End Stage ---- #

# ---- Install Stage  ---- #
FROM $GB_BASE_IMAGE as goblet-installer
WORKDIR /keg/tap
COPY --from=goblet-pruner /keg/tap/out/json/ .
RUN yarn install --frozen-lockfile
# ---- End Stage ---- #

# ---- Build Stage ---- #
FROM $GB_BASE_IMAGE as goblet-build
ARG NPM_TOKEN
ENV NPM_TOKEN=$NPM_TOKEN
WORKDIR /keg/tap
COPY --from=goblet-installer /keg/tap/ .
COPY . .
RUN yarn build
# ---- End Stage ---- #

# ---- Run Stage  ---- #
FROM $GB_BASE_IMAGE as goblet-runner
WORKDIR /keg/tap
EXPOSE $KEG_PROXY_PORT
ARG DOC_APP_PATH=/keg/tap
ARG KEG_PROXY_PORT=19006
ARG PLAYWRIGHT_BROWSERS_VERSION
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
    PLAYWRIGHT_BROWSERS_VERSION=$PLAYWRIGHT_BROWSERS_VERSION

COPY . .
COPY --from=goblet-installer /keg/tap /keg/tap
RUN ln -s /keg/tap/node_modules $HOME/.node_modules && \
    ln -s /keg/tap/node_modules /keg/node_modules

CMD [ "/bin/bash", "container/initialize.sh" ]
