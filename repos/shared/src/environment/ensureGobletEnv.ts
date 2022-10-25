
const { NODE_ENV } = process.env
if(!process.env.GOBLET_ENV && NODE_ENV !== `test`) process.env.GOBLET_ENV = NODE_ENV
const { GOBLET_ENV } = process.env
