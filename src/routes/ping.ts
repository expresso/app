const env = require('sugar-env')
import { IExpressoAppConfig } from '../config'
import { Request, Response, RequestHandler } from 'express'


export function factory (config: IExpressoAppConfig): RequestHandler {
  return (_req: Request, res: Response) => {
    if (env.is(env.DEVELOPMENT)) {
      res.append('x-config', JSON.stringify(config))
    }

    res.status(200)
      .send('Pong!')
      .end()
  }
}
