const DeepTrace = require('deeptrace-express')

// TODO: Make this reflect the whole possibility of deepstream configuration options
export interface IDeepTraceOptions {
  dsn: string,
  shouldSendCallback: () => boolean,
  timeout: number,
  tags: { [key: string]: unknown }
}

/**
 * Creates a deeptrace middleware
 * @param config - Deepstream's configuration options
 */
export function factory (config: IDeepTraceOptions) {
  return DeepTrace.middleware(config)
}
