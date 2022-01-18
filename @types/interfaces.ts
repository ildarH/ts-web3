import { NetworkName } from '~/@types/enums'

export interface IResponse {
  ok: boolean,
  result?: any,
  code?: number,
  msg?: string,
  data?: any
}

export interface ISwitchEthereumChainParameter {
  chainId: string;
}

export interface IAppState {
  theme: string
}

export interface IWeb3State {
  userAddress: string,
  isConnected: boolean,
  chainId: number,
  isDefaultChainId: boolean,
  networkName: string | NetworkName
}

export interface IRootState {
  app: IAppState,
  web3: IWeb3State
}

export interface IHistory {
  type: string,
  from: string,
  to: string,
  amount: string
}
