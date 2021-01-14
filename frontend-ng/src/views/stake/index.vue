<template>
  <div class="stake">
    <h1 class="title">进入 Matataki 治理委员会</h1>
    <h2 class="subtitle">持有 META 即可参与 Matataki 的平台治理</h2>
    <environment-check />
    <div class="panels">
      <ul>
        <li><el-button type="text"><a href="https://bscscan.com/address/0xec7580145ff335ab4b6724ce7131eb799f86b3ae#code" target="_blank">在 BSCScan 查看抵押合约代码 ↗️</a></el-button></li>
      </ul>
    </div>
    <div v-if="isStaked" class="staked">
      <ul>
        <li>🔒 你已经抵押了 {{ myStakedMeta }} 个 META</li>
        <li>抵押至 {{ readableExpiryDate }}</li>
        <li>👛 钱包里还有 {{ myMeta }} 个 META</li>
        <!-- @todo: 需要有人实现输入框什么的 -->
        <!-- <el-button>添加新抵押（并锁定30天）</el-button> -->
        <el-button @click="extendExpiry">延长抵押到30天后</el-button>
      </ul>
    </div>
    <div v-else class="not-staked">
      <p>你还没有抵押过 META，👛 钱包里还有 {{ myMeta }} 个 META</p>
      <el-button v-if="!isApproved" @click="approveStake"> 授权扣除 META </el-button>
      <el-button v-if="isApproved" @click="stake1Meta"> 抵押 1 META（锁定30天）以获得登陆权限</el-button>
    </div>

  </div>
</template>

<script>
import { BigNumber, ethers, utils } from 'ethers'
import { approveToStaking, extendLockdown, getAllowance, getStakingStatus, metaBalanceOf, stake } from '../../utils/ethers'
import EnvironmentCheck from '../../components/EnvironmentCheck.vue'

export default {
  name: 'Stake',
  components: {
    EnvironmentCheck
  },
  data() {
    return {
      // balance of META
      balanceOfStaked: '0',
      balanceOfWallet: '0',
      // User's staking, default is 1970-1-1 0:0, as not staked
      stakingExpiry: new Date(0),
      allowanceToStake: '0',
      transferLoading: false,
      //   interval: null,
      isMetaMaskActive: false,
      isOnBsc: false,
      selectedWallet: null
    }
  },
  computed: {
    isStaked() {
      return BigNumber.from(this.balanceOfStaked).gt(0)
    },
    isApproved() {
      return BigNumber.from(this.allowanceToStake).gte(utils.parseUnits('1', 4))
    },
    myStakedMeta() {
      return utils.formatUnits(this.balanceOfStaked, 4)
    },
    myMeta() {
      return utils.formatUnits(this.balanceOfWallet, 4)
    },
    readableExpiryDate() {
      return this.stakingExpiry.toLocaleString()
    }
  },
  watch: {
    // isLogined(val) {
    //   if (val && this.isMetaMaskActive) this.fetchData()
    //   // 每一分钟刷新一次
    //   this.interval = setInterval(() => {
    //     this.fetchData()
    //   }, 1000 * 60)
    // }
  },
  async mounted() {
    this.isMetaMaskActive = (typeof window.ethereum !== 'undefined')
    if (!window.ethereum) return
    const { networkVersion, selectedAddress } = window.ethereum
    this.selectedWallet = selectedAddress
    this.isOnBsc = Number(networkVersion) === 56
    if (selectedAddress) { this.fetchData() }
    window.ethereum.on('chainChanged', chainId => {
      // handle the new network
      this.isOnBsc = Number(chainId) === 56
    })
    window.ethereum.on('accountsChanged', ([primaryAcc]) => {
      this.selectedWallet = primaryAcc
      if (primaryAcc) {
        this.fetchData()
      }
    })
  },
  methods: {
    async fetchData() {
      const { selectedWallet } = this
      // fetch allowance
      this.allowanceToStake = await getAllowance(selectedWallet)

      // fetch staking status
      const { stakeBalance, stakeExpireAt } = await getStakingStatus(selectedWallet)
      this.balanceOfStaked = stakeBalance
      this.stakingExpiry = stakeExpireAt

      this.balanceOfWallet = await metaBalanceOf(selectedWallet)
    },
    renderIconWithBool(val) {
      return val ? '☑️' : '✖️'
    },
    async approveStake() {
      try {
        const receipt = await approveToStaking()
        console.info('Approved, receipt: ', receipt)
        await this.fetchData()
      } catch (error) {
        alert('Error', error)
      }
    },
    async stake1Meta() {
      return this.stakeMeta(utils.parseUnits('1', 4))
    },
    async stakeMeta(amount) {
      this.transferLoading = true
      const receipt = await stake(amount)
      console.info('receipt', receipt)
      this.transferLoading = false
      await this.fetchData()
      alert(`抵押成功，锁仓日期为： ${this.stakingExpiry.toLocaleString()}`)
    },
    async extendExpiry() {
      this.transferLoading = true
      const receipt = await extendLockdown()
      console.info('receipt', receipt)
      this.transferLoading = false
      await this.fetchData()
      alert(`延长锁仓成功，锁仓日期更新为： ${this.stakingExpiry.toLocaleString()}`)
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
