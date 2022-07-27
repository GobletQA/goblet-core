FROM ghcr.io/gobletqa/goblet:develop as action-installer
WORKDIR /function
COPY package.json package.json
RUN yarn install

FROM ghcr.io/gobletqa/goblet:develop as action-runner
WORKDIR /keg/tap
RUN npx playwright install --with-deps
WORKDIR /function
ADD . /function/
COPY --from=action-installer /function/node_modules/ /function/node_modules/

# fn - requires the entry point be set for it to work
ENTRYPOINT ["node", "func.js"]

