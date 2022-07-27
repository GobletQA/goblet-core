

### FN CMDs
* [See here](https://github.com/fnproject/cli/blob/master/CONTEXT.md) for more info
* Start the FN server
  * `fn start`
* Update a context to use a specific host and port
  * `fn update context api-url http://localhost:8080`
* Use a context
  * `fn use context <context-name>`
* Set the image registry for the context
  * `fn update context registry <name-of-registry>`
  * Uses `fndemouser` by default
* Use the actions to interact with contexts => `create | use | delete | unset`
  * `fn <action> context <context-name>`
  * Create context options
    * `--api-url <api-url-w-port> --provider <docker-provider> --registry <docker-username>`


### Full steps to run
```sh

  # Use the goblet context 
  fn use context goblet

  # Create the function
  fn init --runtime goblet-api serverless

  # Navigate to the functions directory
  cd serverless


  # Create the goblet-api app
  fn create app goblet-api

  # Ensure the functions docker image is built
  docker buildx build --load .

  # Deploy the goblet app - locally
  fn --verbose deploy --app goblet-api --local --no-bump
  
  # Run the function
  fn invoke goblet-api serverless
  # echo -n '{"name":"Bob"}' | fn invoke nodeapp serverless --content-type application/json
  
  # Inspect the function
  fn inspect function goblet-api serverless
  # Output looks like this
  {
    "annotations": {
      # This is the endpoint the can be called vai http
      "fnproject.io/fn/invokeEndpoint": "http://localhost:8080/invoke/01G8YMXKZRNG8G00RZJ0000002"
    },
    "app_id": "01G8YMX2DCNG8G00RZJ0000001",
    "created_at": "2022-07-27T01:39:11.480Z",
    "id": "01G8YMXKZRNG8G00RZJ0000002",
    "idle_timeout": 30,
    "image": "fndemouser/serverless:0.0.2",
    "memory": 128,
    "name": "serverless",
    "timeout": 30,
    "updated_at": "2022-07-27T01:39:11.480Z"
  }


  # Add config values after deploying a function
  # fn config function <app-name> <fn-name> <key> <value>

  # Invoke the function with http
  curl -X "POST" -H "Content-Type: application/json" http://localhost:8080/invoke/01G8YMXKZRNG8G00RZJ0000002


  # RUN the UI
  docker run --rm -it --link fnserver:api -p 4000:4000 -e "FN_API_URL=http://host.docker.internal:8080" fnproject/ui

  # See https://github.com/fnproject/docs/blob/master/fn/operate/options.md for runtime envs

# Run docker production server
docker run --privileged \
  --rm \
  --name fns \
  -it \
  -v $PWD/data:/app/data \
  -v $PWD/data/iofs:/iofs \
  -e "FN_IOFS_DOCKER_PATH=$PWD/data/iofs" \
  -e "FN_IOFS_PATH=/iofs" \
  -p 80:8080 \
  fnproject/fnserver

```