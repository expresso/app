import { Request } from 'express'

export interface IExpressoRequest<TBody = unknown, TParams = unknown> extends Request {
  body: TBody,
  params: TParams,
  onBehalfOf: string | string[] | undefined
}
