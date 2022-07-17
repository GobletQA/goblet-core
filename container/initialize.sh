#!/usr/bin/env
set -Eeo pipefail

# Ensure required envs are set
[[ -z "$KEG_PROXY_PORT" ]] && KEG_PROXY_PORT=19006
[[ -z "$DOC_APP_PATH" ]] && DOC_APP_PATH=/keg/tap
[[ -z "$DOC_BUILD_PATH" ]] && DOC_BUILD_PATH=/keg/tap-build

# If the no KEG_DOCKER_EXEC env is set, just sleep forever
# This is to keep our container running forever
[[ -z "$KEG_DOCKER_EXEC" ]] && tail -f /dev/null && exit 0;

# Starts the screen cast servers when not using a websocket from the hostmachine
goblet_start_screen_cast(){
  cd /keg/tap/repos/screencast
  yarn sc:pm2 >> /proc/1/fd/1 &
}

# Serve the backend server API only
goblet_serve_backend(){
  echo $"[ KEG-CLI ] Running backend API server!" >&2
  node ./repos/backend/index.js &>> /proc/1/fd/1 &
  tail -f /dev/null && exit 0;
}

# Serve the screencast server API only
goblet_serve_screencast(){
  echo $"[ KEG-CLI ] Running screencast API server!" >&2
  node ./repos/screencast/index.js &>> /proc/1/fd/1 &
  tail -f /dev/null && exit 0;
}

# From the root navigate to the service directory
goblet_start_service(){
  cd /keg/tap/$1

  if [ -z $3 ] ; then
    yarn $2 &
  else
    yarn $2 >> /proc/1/fd/1 &
  fi
}

# Check if the vnc screen-cast servers should be started
START_VNC_SERVER=""
if [[ -z "$GOBLET_SUB_REPO" ]]; then
  START_VNC_SERVER=1
elif [[ "$GOBLET_SUB_REPO" == "screencast" ]]; then
  START_VNC_SERVER=1
fi

if [[ "$GOBLET_USE_VNC" == "true" || "$START_VNC_SERVER" ]]; then
  goblet_start_screen_cast
fi

# Check if the process to run is defined, then run it
if [[ "$GOBLET_SUB_REPO" ]]; then
  goblet_start_service "repos/$GOBLET_SUB_REPO" "watch" "pipe-output"
else
  # Start each of the services and canvas
  goblet_start_service "repos/backend" "watch" "pipe-output"
  goblet_start_service "repos/screencast" "watch" "pipe-output"
  goblet_start_service "repos/tap" "start" "pipe-output"
fi

# Tail /dev/null to keep the container running
tail -f /dev/null && exit 0;