import { ethers } from 'ethers'
import StakingBuild from '../constants/abi/MatatakiStakingLocker.json'
import IERC20ABI from '../constants/abi/IERC20.json'
import FetcherAbi from '../constants/abi/Fetcher.json'

const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/')

const stakingContract = new ethers.Contract('0xec7580145Ff335Ab4b6724CE7131eB799F86B3aE', StakingBuild.abi, provider)
const metaTokenContract = new ethers.Contract('0xacae234ea5fddd1657038b7aa6b597664056c954', IERC20ABI, provider)
const stakingFetcher = new ethers.Contract('0x9f0866cAd81756726CD142f8468054806ee252AF', FetcherAbi, provider)

export const CONTRACTS = {
  META_TOKEN: metaTokenContract,
  STAKING_FETCHER: stakingFetcher,
  STAKING: stakingContract
}

export async function getAllowance(who) {
  const allowance = await metaTokenContract.allowance(who, stakingContract.address)
  return allowance.toString()
}

export async function metaBalanceOf(who) {
  const balanceOf = await metaTokenContract.balanceOf(who)
  return balanceOf.toString()
}

export async function getStakingStatus(who) {
  const { stakeBalance, lockExpiry } = await stakingFetcher.getStakeStatus(stakingContract.address, who)
  const stakeExpireAt = new Date(lockExpiry.toNumber() * 1000)
  return { stakeBalance: stakeBalance.toString(), stakeExpireAt }
}

export function getMetaMaskSigner() {
  const provider = new ethers.providers.Web3Provider(
    window.ethereum
  ).getSigner()
  return provider
}

export async function approveToStaking() {
  const UINT256_MAX = '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'
  const txRequest = await metaTokenContract.connect(getMetaMaskSigner()).approve(stakingContract.address, UINT256_MAX)
  const receipt = await txRequest.wait()
  return receipt
}

export async function extendLockdown() {
  const request = await stakingContract.connect(getMetaMaskSigner()).extendLockdown()
  const receipt = await request.wait()
  return receipt
}

export async function stake(amount) {
  const request = await stakingContract.connect(getMetaMaskSigner()).stake(amount)
  const receipt = await request.wait()
  return receipt
}
