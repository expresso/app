import { Request, Response, NextFunction, RequestHandler } from 'express'

/**
 * Returns an express
 */
export function factory (): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    Object.defineProperty(req, 'onBehalfOf', { get () { return req.headers['x-on-behalf-of'] } })
    next()
  }
}
