import { Request, Response, RequestHandler } from 'express'

export function factory (): RequestHandler {
  return (_req: Request, res: Response) => {
    res.status(418)
      .send("I'm a teapot")
      .end()
  }
}
