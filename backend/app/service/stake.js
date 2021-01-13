/* eslint-disable no-bitwise */
'use strict';
const Service = require('egg').Service;
const { ethers } = require('ethers');
const StakingBuild = require('../constants/abi/MatatakiStakingLocker.json');
const FetcherAbi = require('../constants/abi/Fetcher.json');


class StakeService extends Service {
  constructor(ctx, app) {
    super(ctx, app);
    const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
    this.stakingContract = new ethers.Contract('0xec7580145Ff335Ab4b6724CE7131eB799F86B3aE', StakingBuild.abi, provider);
    this.stakingFetcher = new ethers.Contract('0x9f0866cAd81756726CD142f8468054806ee252AF', FetcherAbi, provider);
  }

  async getStakeStatus(who) {
    const { stakeBalance, lockExpiry } = await this.stakingFetcher.getStakeStatus(this.stakingContract.address, who);
    const stakeExpireAt = new Date(lockExpiry.toNumber() * 1000);
    return { stakeBalance, stakeExpireAt };
  }

  getAddressFrom(value, signature) {
    const recovered = ethers.utils.verifyTypedData({
      name: 'Matataki Public Management',
      version: '1',
      chainId: '56',
      verifyingContract: this.stakingContract.address,
      salt: '0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558',
    }, {
      Login: [
        { name: 'timestamp', type: 'uint256' },
        { name: 'action', type: 'string' },
      ],
    }, value, signature);
    return recovered;
  }

  verifySignature(who, value, signature) {
    return who === this.getAddressFrom(value, signature);
  }
}

module.exports = StakeService;
