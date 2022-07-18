#!/usr/bin/env
set -Eeo pipefail

# Ensure required envs are set
[[ -z "$KEG_PROXY_PORT" ]] && KEG_PROXY_PORT=19006
[[ -z "$DOC_APP_PATH" ]] && DOC_APP_PATH=/keg/tap
[[ -z "$DOC_BUILD_PATH" ]] && DOC_BUILD_PATH=/keg/tap-build

# If the no KEG_DOCKER_EXEC env is set, just sleep forever
# This is to keep our container running forever
[[ -z "$KEG_DOCKER_EXEC" ]] && tail -f /dev/null && exit 0;

gobletRunScreencast(){

  # Check if the vnc screen-cast servers should be started
  START_VNC_SERVER=""
  if [[ -z "$GOBLET_SUB_REPO" ]]; then
    START_VNC_SERVER=1
  elif [[ "$GOBLET_SUB_REPO" == "screencast" ]]; then
    START_VNC_SERVER=1
  fi

  # Starts the screen cast servers when not using a websocket from the hostmachine
  if [[ "$GOBLET_USE_VNC" == "true" || "$START_VNC_SERVER" ]]; then
    echo "------ Runing VNC Screencast - $GOBLET_SUB_REPO --------"
    cd /keg/tap/repos/screencast
    yarn sc:pm2 >> /proc/1/fd/1 &
  fi
}

# Check if the process to run is defined, then run it
if [[ "$GOBLET_SUB_REPO" ]]; then
  echo "------ Runing Sub Repo - $GOBLET_SUB_REPO --------"
  gobletRunScreencast "$@"

  cd repos/$GOBLET_SUB_REPO
  yarn pm2 >> /proc/1/fd/1 &

else
  echo "------ Runing All via PM2 --------"
  # Start each of the services and canvas
  yarn pm2
  tail -f /keg/tap/logs/*.* >> /proc/1/fd/1 &
fi

# Tail /dev/null to keep the container running
tail -f /keg/tap/logs/*.* && exit 0;