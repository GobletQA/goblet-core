const fdk = require('@fnproject/fdk')

/**
  * Entry point function called by fn when the container runs
  ctx.config : An Object containing function config variables (from the environment ) (read only)
  ctx.headers : an object containing input headers for the event as lists of strings (read only)
  ctx.deadline : a Date object indicating when the function call must be processed by
  ctx.callID : The call ID of the current call
  ctx.fnID : The Function ID of the current function
  ctx.memory : Amount of ram in MB allocated to this function
  ctx.contentType : The incoming request content type (if set, otherwise null)
  ctx.setResponseHeader(key,values...) : Sets a response header to one or more values
  ctx.addResponseHeader(key,values...) : Appends values to an existing response header
  ctx.responseContentType set/read the response content type of the function (read/write)
  ctx.httpGateway The HTTP Gateway context for this function (if set) see HTTPGatewayContext below
  */

fdk.handle((input, ctx) => {

/**
  hctx.requestURL : Get the http request URL of the function as received by the gateway (null if not set)
  hctx.method : Get the HTTP request method used to invoke the gateway
  hctx.headers : Get the HTTP headers of the incoming request (read-only)
  hctx.statusCode : Set the the HTTP status code of the HTTP resposne & hctx.setResponseHeader(key,values..), hctx.addResponseHeader(key,values) Set/add response headers
 */
 const hctx = ctx.httpGateway


  return {'version': `Do the thing`}
})