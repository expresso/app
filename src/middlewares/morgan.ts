import merge from 'lodash.merge'
const env = require('sugar-env')
import morgan, { Options } from 'morgan'

export interface IMorganConfig extends Options {
  format: string
}

export function factory ({ format, ...config }: IMorganConfig, environment: string) {
  const options = merge(config, { skip: () => { return environment === env.TEST } })

  return morgan(format, options)
}
