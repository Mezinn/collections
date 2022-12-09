interface ContextPrototypeProxyConstructor {
  new <T, H extends object>(target: T, handler: ProxyHandler<H>): H;
}

export const ContextPrototypeProxy = Proxy as ContextPrototypeProxyConstructor;
