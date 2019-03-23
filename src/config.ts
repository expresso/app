const env = require('sugar-env')
import merge from 'lodash.merge'
import { CorsOptions } from 'cors'
import { IMorganConfig } from './middlewares/morgan'
import { IDeepTraceOptions } from './middlewares/deep-trace'

export interface IExpressoAppConfig {
  name: string,
  version: string,
  deeptrace: IDeepTraceOptions,
  morgan: IMorganConfig,
  cors: CorsOptions
}

export function makeConfig (options: Partial<IExpressoAppConfig>, environment: string): IExpressoAppConfig {
  return merge({
    name: env.get([ 'APP_NAME', 'npm_package_name' ], 'app'),
    version: env.get('GIT_RELEASE'),
    deeptrace: {
      dsn: env.get('DEEPTRACE_DSN'),
      shouldSendCallback: () => true,
      timeout: parseInt(env.get('DEEPTRACE_TIMEOUT', 3000)),
      tags: {
        environment,
        service: env.get('DEEPTRACE_TAGS_SERVICE', options.name),
        commit: env.get([ 'DEEPTRACE_TAGS_COMMIT', 'GIT_COMMIT' ]),
        release: env.get([ 'DEEPTRACE_TAGS_RELEASE', 'GIT_RELEASE' ])
      }
    },
    morgan: {
      format: ':method :url :status :: :response-time ms :: :res[deeptrace-id]'
    },
    cors: {
      origin: '*',
      methods: [ 'GET', 'POST', 'PUT', 'PATCH', 'DELETE' ],
      preflightContinue: false,
      optionsSuccessStatus: 204
    }
  }, options)
}
