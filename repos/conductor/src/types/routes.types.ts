
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
  route: TProxyRoute
}

export type TUrlsMap = {
  meta?: Record<string, any>
  map: Record<string, TUrlMap>
}


export type TUrls = {
  [key:string]: string
}
