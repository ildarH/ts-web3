import * as yup from 'yup'
import { InferType } from 'yup/es'
import { NetworkName } from '~/utils/constants'

export interface ISwitchEthereumChainParameter {
  chainId: string;
}

export interface IResponse {
  ok: boolean,
  result?: any,
  code?: number,
  msg?: string,
  data?: any
}

const tokenSchema = yup.object({
  address: yup.string().defined(),
  symbol: yup.string().defined(),
  decimals: yup.string().defined()
})

export interface IToken extends InferType<typeof tokenSchema> {}

const balanceSchema = yup.object({
  token: tokenSchema,
  amount: yup.string(),
  allowance: yup.string()
})

export interface IBalance extends InferType<typeof balanceSchema> {}

const transactionsSchema = yup.object({
  type: yup.string().defined(),
  from: yup.string().defined(),
  to: yup.string().defined(),
  token: tokenSchema
})

export interface ITransactions extends InferType<typeof transactionsSchema>{}

export interface ITokensMap {
  [key: string]: string
}

export interface IAppState {
  theme: string
}

export interface IWeb3State {
  isMainnet: boolean,
  userAddress: string,
  isConnected: boolean,
  chainId: number,
  isDefaultChainId: boolean,
  networkName: string | NetworkName
}

export interface ITokensState {
  tokens: IBalance[],
  transaction: ITransactions[]
}

export interface IRootState {
  app: IAppState,
  web3: IWeb3State,
  token: ITokensState
}
