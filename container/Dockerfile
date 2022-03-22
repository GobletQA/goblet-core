
# Define ARGS before anything else, to use them in the FROM directives
ARG KEG_BASE_IMAGE=mcr.microsoft.com/playwright:next-focal

FROM $KEG_BASE_IMAGE as keg-builder

# Copy in the package.json
COPY ./package.json /keg-cache/package.json

# Install node_modules in a cached directory
# This allows the Docker cache to be based off the package.json file 
# Instead of the entire repo folder
RUN cd /keg-cache; \
    yarn install --non-interactive --ignore-optional

# Copy in the root directory
COPY . /keg-temp/

# Flag to copy over the taps local folder instead of pulling from git
ARG KEG_COPY_LOCAL
ENV KEG_COPY_LOCAL=$KEG_COPY_LOCAL

ARG GIT_APP_BRANCH=master
ARG DOC_APP_PATH=/keg/tap
ARG GIT_APP_URL=https://github.com/KegHub/keg-herkin.git

ENV GIT_APP_URL=$GIT_APP_URL \
    DOC_APP_PATH=$DOC_APP_PATH \
    GIT_APP_BRANCH=$GIT_APP_BRANCH

WORKDIR $DOC_APP_PATH

# Check if we should use the local code copy, or pull from github
# Then copy over the previously installed node_modules
RUN if [[ -z "$KEG_COPY_LOCAL" ]]; then \
      apk add --update --no-cache git; \
      git clone --single-branch --branch $GIT_APP_BRANCH $GIT_APP_URL $DOC_APP_PATH; \
    else \
      cp -R /keg-temp/. $DOC_APP_PATH; \
    fi; \
    cp -R /keg-cache/. $DOC_APP_PATH/.

# Install and build gitfs for unbuntu-20
FROM $KEG_BASE_IMAGE as gitfs-builder

RUN apt-get update; \
    apt-get install -qy --no-install-recommends \
    virtualenv \
    python-dev \
    libfuse-dev \
    fuse \
    libffi-dev \
    libgit2-dev \
    python3.8-venv; \
    git clone https://github.com/lancetipton/gitfs.git /keg/gitfs; \
    cd /keg/gitfs; \
    python3 -m pip install build; \
    python3 -m build

# Multi-Stage build using the playwright image
FROM $KEG_BASE_IMAGE as builder

# Path of the tap within the docker container
ARG DOC_APP_PATH=/keg/tap
ARG EXPO_CLI_VERSION=5.0.3
ARG KEG_PROXY_PORT=19006

ENV HOME=/root \
    DISPLAY=:0.0 \
    DEBUG=pw:api* \
    LC_ALL=C.UTF-8 \
    LANG=en_US.UTF-8 \
    LANGUAGE=en_US.UTF-8 \
    DOC_APP_PATH=$DOC_APP_PATH \
    DEBIAN_FRONTEND=noninteractive \
    KEG_PROXY_PORT=$KEG_PROXY_PORT \
    EXPO_CLI_VERSION=$EXPO_CLI_VERSION \
    PATH=$PATH:/usr/local/share/.config/yarn/global/node_modules/.bin

# Set the current directory to tap repo
WORKDIR $DOC_APP_PATH

COPY --from=gitfs-builder /keg/gitfs/dist /keg/gitfs/dist

# Install the dependecies with yarn setup, nstall gitFS
RUN yarn global add npm-run-all nodemon expo-cli@$EXPO_CLI_VERSION; \
    apt-get update && apt-get install -y --no-install-recommends \
    novnc \
    tigervnc-standalone-server \
    fuse \
    libffi-dev \
    libgit2-dev; \
    mkdir -p /var/lib/gitfs; \
    python3 -m pip install /keg/gitfs/dist/gitfs-0.5.2-py3-none-any.whl; \
    apt-get clean && \
    apt-get autoclean; \
    rm -rf /var/cache/apk/*; \
    echo fs.inotify.max_user_watches=1048576 | tee -a /etc/sysctl.conf; \
    sysctl -p; \
    /bin/sed -i '1s|.*|root:x:0:0:root:/root:/bin/bash|g' /etc/passwd; \
    rm -rf /keg/gitfs; \
    rm -rf /ms-playwright; \
    rm -rf /ms-playwright-agent; \
    yarn add playwright@1.17.2; \
    npx playwright install chromium

# Copy over the app from builder
COPY --from=keg-builder $DOC_APP_PATH $DOC_APP_PATH

# Expose container ports
EXPOSE $KEG_PROXY_PORT

# Run the start script
CMD [ "/bin/bash", "container/run.sh" ]
