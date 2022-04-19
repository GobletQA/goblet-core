#!/usr/bin/env

# Ensure required envs are set
[[ -z "$KEG_PROXY_PORT" ]] && KEG_PROXY_PORT=19006
[[ -z "$DOC_APP_PATH" ]] && DOC_APP_PATH=/keg/tap
[[ -z "$DOC_BUILD_PATH" ]] && DOC_BUILD_PATH=/keg/tap-build

# If the no KEG_DOCKER_EXEC env is set, just sleep forever
# This is to keep our container running forever
[[ -z "$KEG_DOCKER_EXEC" ]] && tail -f /dev/null && exit 0;

# Starts the screen cast servers when not using a websocket from the hostmachine
keg_start_screen_cast(){
  cd $DOC_APP_PATH
  yarn sc:daemon
}

# Serve the backend server API only
keg_herkin_serve_backend(){
  echo $"[ KEG-CLI ] Running backend API server!" >&2
  node ./repos/backend/index.js &>> /proc/1/fd/1 &
  tail -f /dev/null && exit 0;
}

# Serve the screencast server API only
keg_herkin_serve_screencast(){
  echo $"[ KEG-CLI ] Running screencast API server!" >&2
  node ./repos/screencast/index.js &>> /proc/1/fd/1 &
  tail -f /dev/null && exit 0;
}

# Check if the vnc screen-cast servers should be started
if [[ "$HERKIN_USE_VNC" == "true" ]]; then
  keg_start_screen_cast
fi

# Check if we should be running only the backend API
if [[ "$HERKIN_API_TYPE" == "backend" ]]; then
  keg_herkin_serve_backend

# Check if we should be running only the screencast API
elif [[ "$HERKIN_API_TYPE" == "screencast" ]]; then
  keg_herkin_serve_screencast

# Check the NODE_ENV, and use that to know which environment to start
# For non-development environments, we want to serve the bundle if it exists
elif [[ ! " development develop local test " =~ " $NODE_ENV " ]]; then
  keg_herkin_serve_backend

# If none of the above exist, then we run the develop / local yarn command
# And Serve the app bundle in development environemnts
else
  echo $"[ KEG-CLI ] Running development server!" >&2
  cd $DOC_APP_PATH
  [[ -z "$KEG_EXEC_CMD" ]] && yarn web || yarn $KEG_EXEC_CMD
fi
