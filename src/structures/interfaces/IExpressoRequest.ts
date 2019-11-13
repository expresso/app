import { Request } from 'express'

export interface IExpressoRequest<TBody = unknown, TParams extends Request['params'] = {}, TQuery = unknown> extends Request<TParams> {
  body: TBody,
  params: TParams,
  onBehalfOf?: string | string[],
  query: TQuery
}
