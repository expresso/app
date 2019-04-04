import env from 'sugar-env'
import merge from 'lodash.merge'
import { CorsOptions } from 'cors'
import { IMorganConfig } from './middlewares/morgan'
import { IDeepTraceOptions } from './middlewares/deep-trace'

export interface IExpressoConfigOptions {
  name: string,
  version?: string,
  deeptrace?: IDeepTraceOptions,
  morgan?: IMorganConfig,
  cors?: CorsOptions,
  bodyParser?: {
    urlEncoded?: boolean,
    json?: boolean
  }
}

export function makeConfig <TOptions extends IExpressoConfigOptions>(options: TOptions, environment: string): Required<IExpressoConfigOptions> & TOptions {
  return merge({
    name: env.get([ 'APP_NAME', 'npm_package_name' ], 'app'),
    version: env.get('GIT_RELEASE'),
    deeptrace: {
      dsn: env.get('DEEPTRACE_DSN'),
      shouldSendCallback: () => true,
      timeout: env.get.int('DEEPTRACE_TIMEOUT', '3000'),
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
    },
    bodyParser: {
      urlEncoded: true,
      json: true
    }
  }, options)
}
