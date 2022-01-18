import { IResponse } from '~/@types/interfaces'

export const output = (res?: any): IResponse => ({
  ok: true,
  result: res
})

export const error = (code?: number, msg?: string, data?: any): IResponse => ({
  ok: false,
  code,
  msg,
  data
})
