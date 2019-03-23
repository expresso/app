const env = require('sugar-env')
import { Request, Response, RequestHandler } from 'express'


export function factory (config: unknown): RequestHandler {
  return (_req: Request, res: Response) => {
    if (env.is(env.DEVELOPMENT)) {
      res.append('x-config', JSON.stringify(config))
    }

    res.status(200)
      .send('Pong!')
      .end()
  }
}
