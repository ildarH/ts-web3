import Web3 from 'web3'
import BigNumber from 'bignumber.js'
import { IResponse, ISwitchEthereumChainParameter } from '~/@types/interfaces'

import { ERC20 } from '~/utils/abi/ERC20'
import { error, output } from '~/utils/index'

declare global {
  interface Window {
    ethereum: any;
  }
}

BigNumber.config({ EXPONENTIAL_AT: 60 })

const IS_MAINNET = process.env.IS_MAINNET
const DEFAULT_CHAIN_ID = IS_MAINNET ? process.env.DEFAULT_CHAIN_ID_MAINNET : process.env.DEFAULT_CHAIN_ID_TESTNET

console.log('IS_MAINNET: ', IS_MAINNET)

const { ethereum } = window || null
console.log('ethereum: ', ethereum)

let web3Wallet: any
let userAddress: string
let chainId: string | number

const _fetchContractData = async (web3: any, method: string, abi: Array<any>, address: string, params?: Array<any>): Promise<IResponse> => {
  try {
    const contract = new web3.instance.eth.Contract(abi, address)
    return output(await contract.methods[method].apply(this, params).call())
  } catch (err) {
    return error(501, 'fetch contract data', { err })
  }
}

const _ethereumRequest = async (method: string, params: ISwitchEthereumChainParameter):Promise<any> => {
  await ethereum.request({ method, params: [params] })
}

export const initWallet = async (): Promise<IResponse> => {
  if (!ethereum) {
    return error(400, 'Metamask is not installed')
  }
  try {
    if (!web3Wallet) {
      web3Wallet = new Web3(ethereum)
      userAddress = await web3Wallet.eth.getCoinbase()
      chainId = await web3Wallet.eth.net.getId()
    }
    console.log('userAddress', userAddress, chainId)
    return output({ userAddress, chainId })
  } catch (err) {
    return error(401, 'Connection error', err)
  }
}

export const requestSwitchNetwork = async (chainId: number):Promise<IResponse> => {
  if (!chainId) { return error(402, 'Request switch network: no chain id provided') }
  try {
    const params: ISwitchEthereumChainParameter = {
      chainId: Web3.utils.toHex(chainId)
    }
    const requestSwitch = await _ethereumRequest('wallet_switchEthereumChain', params)
    return output({ requestSwitch })
  } catch (err) {
    return error(403, 'Request switch network', err)
  }
}
