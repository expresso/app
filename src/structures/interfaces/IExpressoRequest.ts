import { Request } from 'express'

export interface IExpressoRequest<TBody = unknown, TParams = unknown, TQuery = unknown> extends Request {
  body: TBody,
  params: TParams,
  onBehalfOf?: string | string[],
  query: TQuery
}
