import { Request, Response, RequestHandler } from 'express'

const ERR_MESSAGE = 'requested resource was not found'

/**
 * Creates an express middleware that handles unmatched routes
 */
export function factory (): RequestHandler {
  return (_req: Request, res: Response) => {
    res.status(404)
      .json({
        status: 404,
        error: {
          message: ERR_MESSAGE,
          code: 'not_found'
        }
      })
  }
}
