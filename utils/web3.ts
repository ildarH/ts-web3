import Web3 from 'web3'
import * as yup from 'yup'

import BigNumber from 'bignumber.js'
import Moralis from 'moralis'

import { InferType } from 'yup'
import {
  ERC20TokenBalanceSchema,
  IERC20TokenBalance,
  IResponse,
  ISwitchEthereumChainParameter
} from '~/@types/interfaces'

import { ERC20 } from '~/utils/abi/ERC20'
import { error, output } from '~/utils/index'

const MORALIS_SERVER = process.env.MORALIS_SERVER || ''
const MORALIS_API_KEY = process.env.MORALIS_API_KEY || ''

declare global {
  interface Window {
    ethereum: any;
  }
}

BigNumber.config({ EXPONENTIAL_AT: 60 })

const IS_MAINNET = process.env.IS_MAINNET
const DEFAULT_CHAIN_ID = IS_MAINNET ? process.env.DEFAULT_CHAIN_ID_MAINNET : process.env.DEFAULT_CHAIN_ID_TESTNET

const { ethereum } = window || null

let web3Wallet: any
let userAddress: string
let chainId: string | number

const _initMoralis = async (serverUrl: string, appId: string): Promise<void> => {
  await Moralis.start({ serverUrl, appId })
}

const _initMoralisWeb3Service = async (): Promise<void> => {
  const web3Moralis = await Moralis.Web3.enableWeb3({ provider: 'metamask' })
  console.log('web3Moralis: ', web3Moralis)
}

const _fetchContractData = async (web3: any, method: string, abi: Array<any>, address: string, params?: Array<any>): Promise<IResponse> => {
  try {
    const contract = new web3.eth.Contract(abi, address)
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
    web3Wallet = new Web3(ethereum)

    userAddress = await web3Wallet.eth.getCoinbase()
    if (!userAddress) {
      await ethereum.enable()
      userAddress = await web3Wallet.eth.getCoinbase()
    }
    chainId = await web3Wallet.eth.net.getId()
    return output({ userAddress, chainId })
  } catch (err) {
    return error(401, 'Connection error', err)
  }
}

export const requestCheckChainId = async (): Promise<IResponse> => {
  try {
    const requestChainId = await web3Wallet.eth.net.getId()
    if (DEFAULT_CHAIN_ID && requestChainId === +DEFAULT_CHAIN_ID) {
      return output()
    } else {
      return error()
    }
  } catch (e) {
    return error()
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

export const requestTokenBalances = async (networkName: string, walletAddress: string): Promise<IResponse> => {
  if (networkName && walletAddress) {
    await _initMoralis(MORALIS_SERVER, MORALIS_API_KEY)
    let blockNumber: number
    let balances: IERC20TokenBalance[]

    try {
      const getBlock = await web3Wallet.eth.getBlock('latest')
      blockNumber = getBlock.number
    } catch (err: any) {
      return error(500, 'Request block number', err)
    }

    try {
      const options = {
        chain: <Moralis.RinkebyChain>networkName,
        address: walletAddress,
        to_block: blockNumber
      }
      balances = <IERC20TokenBalance[]><unknown> await Moralis.Web3API.account.getTokenBalances(options)

      if (Array.isArray(balances)) {
        await yup.array().of(ERC20TokenBalanceSchema).validate(balances)
      }
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        console.log('ValidationError: ', err)
      }
      return error(501, 'Request balances', err)
    }

    return output(balances)
  }
  return error(404, 'missing args')
}

export const requestTokenAllowance = async (networkName: string, owner: string, spender: string, tokenAddress: string): Promise<IResponse> => {
  if (networkName && owner && spender && tokenAddress) {
    await _initMoralis(MORALIS_SERVER, MORALIS_API_KEY)
    let allowanceRequest: { allowance: string }

    try {
      const options = {
        chain: <Moralis.RinkebyChain>networkName,
        owner_address: owner,
        spender_address: spender,
        address: tokenAddress
      }
      allowanceRequest = await Moralis.Web3API.token.getTokenAllowance(options)
      await yup.object({
        allowance: yup.string()
      }).validate(allowanceRequest)
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        console.log('ValidationError: ', err)
      }
      return error(501, 'Request allowance')
    }

    return output(allowanceRequest.allowance)
  }
  return error(404, 'missing args')
}

export const requestApprove = async (recipientAddress: string, tokenAddress: string, decimals: string, amount: string): Promise<IResponse> => {
  if (recipientAddress && tokenAddress && decimals && amount) {
    await _initMoralis(MORALIS_SERVER, MORALIS_API_KEY)
    await _initMoralisWeb3Service()
    let receipt

    try {
      const options = {
        contractAddress: tokenAddress,
        functionName: 'approve',
        abi: ERC20,
        params: {
          spender: recipientAddress,
          amount: Moralis.Units.Token(amount, +(decimals || 18))
        }
      }

      receipt = await Moralis.Web3.executeFunction(options)
      console.log('receipt: ', receipt)
      return output({ receipt })
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        console.log('ValidationError: ', err)
      }
      return error(501, 'Request allowance')
    }
  }
  return error(404, 'missing args')
}

export const requestTransfer = async (recipientAddress: string, amount: string, decimals: string, tokenAddress: string): Promise<IResponse> => {
  if (recipientAddress && amount && decimals && tokenAddress) {
    try {
      await _initMoralis(MORALIS_SERVER, MORALIS_API_KEY)
      await _initMoralisWeb3Service()
      // let receipt: Moralis.TransferResult
      const options = {
        type: <Moralis.TransferType>'erc20',
        amount: Moralis.Units.Token(amount, +(decimals || 18)),
        receiver: recipientAddress,
        contractAddress: tokenAddress
      }
      const receipt = await Moralis.Web3.transfer(options)

      console.log('receipt: ', receipt)
      return output(receipt)
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        console.log('ValidationError: ', err)
      }
      return error(501, 'Request allowance')
    }
  }
  return error(404, 'missing args')
}
