
export type TContainerRoute = {
  host: string
  port: string|number
  protocol?: 'http' | 'https'
}

export type TProxyRoute = {
  host: string,
  protocol: string,
  port: string|number,
}

export type TProxyRoutes = {
  [key:string]: TProxyRoute
}

export type TUrlMap = {
  internal: string
  external: string
  route: TProxyRoute
}

export type TUrlsMap = {
  urls: TUrls
  map: Record<string, TUrlMap>
}


export type TUrls = {
  [key:string]: string
}