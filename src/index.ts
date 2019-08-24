import cors from 'cors'
import helmet from 'helmet'
import routes from './routes'
const env = require('sugar-env')
import * as Sentry from '@sentry/node'
import middlewares from './middlewares'
import express, { Express } from 'express'
import { makeConfig, IExpressoConfigOptions } from './config'
import bodyParser, { OptionsJson, OptionsUrlencoded } from 'body-parser'

/**
 * Creates express app and registers boilerplate middlewares
 * @param transformer - Custom app configuration function
 */
export function app<TConfig extends IExpressoConfigOptions> (transformer: (app: Express, config: TConfig & Required<IExpressoConfigOptions>, environment: string) => void) {
  /**
   * @param options - Expresso config options object, wich can be extended with additional properties
   * @param environment - Current sugar-env environment string
   */
  return async (options: TConfig, environment: string) => {
    const config = makeConfig(options, environment)

    if (environment !== env.TEST && (!config.sentry || !config.sentry.dsn)) {
      process.on('unhandledRejection', (err) => {
        console.error(err)
        process.exit(1)
      })
    }

    if (config.sentry && config.sentry.dsn) Sentry.init({ dsn: config.sentry.dsn })

    const app = express()

    if (config.sentry && config.sentry.dsn) app.use(Sentry.Handlers.requestHandler(config.sentry.requestHandler))
    app.use(middlewares.deeptrace.factory(config.deeptrace))
    app.use(helmet())
    app.use(cors(config.cors))

    if (config.bodyParser.json) Object.keys(config.bodyParser.json).length > 0 ? app.use(bodyParser.json(config.bodyParser.json as OptionsJson)) : app.use(bodyParser.json())
    if (config.bodyParser.urlEncoded) Object.keys(config.bodyParser.urlEncoded).length > 0 ? app.use(bodyParser.urlencoded(config.bodyParser.urlEncoded as OptionsUrlencoded)) : app.use(bodyParser.urlencoded({ extended: true }))

    app.use(middlewares.onBehalfOf.factory())
    app.use(middlewares.morgan.factory(config.morgan, environment))

    app.get('/ping', routes.ping.factory(config))
    app.get('/teapot', routes.teapot.factory())

    await transformer(app, config, environment)

    app.use('*', routes.unmatched.factory())

    if (config.sentry && config.sentry.dsn) app.use(Sentry.Handlers.errorHandler(config.sentry.errorHandler))

    return app
  }
}

export default app
export { IExpressoConfigOptions } from './config'
