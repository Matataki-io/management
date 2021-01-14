<template>
  <div class="checklist">
    <h4 class="title">
      环境检查
    </h4>
    <ul class="info-list">
      <li>
        MetaMask: {{ renderIconWithBool(isMetaMaskActive) }}&nbsp;
        钱包连接: {{ renderIconWithBool(selectedWallet) }}&nbsp;
        网络: {{ renderIconWithBool(isOnBsc) }}
        <a
          v-if="!isOnBsc"
          class="link"
          href="https://www.readblocks.com/archives/32275"
          target="_blank"
          rel="noopener noreferrer"
        >👉在 MetaMask 添加币安智能链的指南 ↗️ 👈</a>
      </li>
      <li>
        <el-button v-if="!selectedWallet && isMetaMaskActive" @click="requestEtherumAccounts">
          连接钱包
        </el-button>
      </li>
      <li v-if="selectedWallet">
        👛&nbsp;地址: <a class="address" :href="`https://bscscan.com/address/${selectedWallet}`" target="_blank">{{ selectedWallet }}</a>
      </li>
      <li v-if="selectedWallet">
        👛&nbsp;余额: <b>{{ bnbBalance }}</b> BNB
      </li>
    </ul>
  </div>
</template>

<script>
import { ethers, utils } from 'ethers'

export default {
  data: () => ({
    isMetaMaskActive: false,
    isOnBsc: false,
    selectedWallet: null,
    bnbBalance: null
  }),
  computed: {
  },
  async mounted() {
    this.isMetaMaskActive = (typeof window.ethereum !== 'undefined')
    if (!window.ethereum) return
    const { networkVersion, selectedAddress } = window.ethereum
    this.selectedWallet = selectedAddress
    this.isOnBsc = Number(networkVersion) === 56
    if (selectedAddress) { this.fetchBNBBalance() }
    window.ethereum.on('chainChanged', chainId => {
      // handle the new network
      this.isOnBsc = Number(chainId) === 56
    })
    window.ethereum.on('accountsChanged', ([primaryAcc]) => {
      this.selectedWallet = primaryAcc
      if (primaryAcc) {
        this.fetchBNBBalance()
      } else {
        this.bnbBalance = null
      }
    })
  },
  methods: {
    renderIconWithBool(val) {
      return val ? '✅' : '❌'
    },
    async fetchBNBBalance() {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum
      )
      const balanceBN = await provider.getBalance(this.selectedWallet)
      this.bnbBalance = utils.formatEther(balanceBN)
    },
    async requestEtherumAccounts() {
      try {
        const [defaultAccount] = await window.ethereum.request({ method: 'eth_requestAccounts' })
        this.selectedWallet = defaultAccount
      } catch (error) {
        this.$message.error('对不起，这个操作需要你授权我们访问你的 MetaMask 钱包')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.checklist .title {
  margin: 10px 0;
  padding: 0;
  font-size: 18px;
}
.checklist .info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  .link {
    color: #3a8ee6;
    font-size: 14px;
    text-decoration: underline;
    margin-left: 10px;
  }
}
.checklist .info-list li {
  margin: 14px 0 14px 20px;
  font-size: 16px;
  color: #333;
}
.checklist .info-list li .address {
  font-size: 14px;
  color: #9f9f9f;
  font-weight: 400;
  text-decoration: underline;
}
</style>
