<template>
  <div class="container">
    <el-page-header content="环境检查 & META 抵押管理" style=" margin: 20px; " @back="$router.back()" />
    <div class="stake">
      <h1 class="title">进入 Matataki 治理委员会</h1>
      <h2 class="subtitle">持有 META 即可参与 Matataki 的平台治理</h2>
      <environment-check />
      <div class="panels">
        <h4 class="item-title">
          合约代码
        </h4>
        <ul>
          <li>
            <a class="contract" href="https://bscscan.com/address/0xec7580145ff335ab4b6724ce7131eb799f86b3ae#code" target="_blank">在 BSCScan 查看抵押合约代码 ↗️</a>
          </li>
        </ul>
      </div>
      <div v-if="isStaked" class="staked">
        <h4 class="item-title">
          详情信息
        </h4>
        <ul>
          <li>🔒 你已经抵押了 {{ myStakedMeta }} 个 <a href="https://www.matataki.io/token/120" target="_blank">META</a></li>
          <li>🔒 抵押至 {{ readableExpiryDate }}</li>
          <li>👛 钱包里还有 {{ myMeta }} 个 <a href="https://www.matataki.io/token/120" target="_blank">META</a></li>
          <!-- @todo: 需要有人实现输入框什么的 -->
          <!-- <el-button>添加新抵押（并锁定30天）</el-button> -->
          <el-button @click="extendExpiry">延长抵押到30天后</el-button>
        </ul>
      </div>
      <div v-else class="not-staked">
        <el-alert type="warning" title="请不要使用硬件钱包">收到用户反馈，部分硬件钱包（如 Trezor）因为存在以太坊协议兼容性问题，MetaMask 提示设备不兼容而导致无法正常登陆本系统，请使用软件创建的钱包抵押 META</el-alert>
        <p>你还没有抵押过 <a href="https://www.matataki.io/token/120" target="_blank">META</a>，👛 钱包里还有 {{ myMeta }} 个 <a href="https://www.matataki.io/token/120" target="_blank">META</a></p>
        <el-button v-if="!isApproved" @click="approveStake"> 授权扣除 <a href="https://www.matataki.io/token/120" target="_blank">META</a> </el-button>
        <el-button v-if="isApproved" @click="stake1Meta"> 抵押 1 <a href="https://www.matataki.io/token/120" target="_blank">META</a>（锁定30天）以获得登陆权限</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { BigNumber, utils } from 'ethers'
import { approveToStaking, extendLockdown, getAllowance, getStakingStatus, metaBalanceOf, stake } from '../../utils/ethers'
import EnvironmentCheck from '../../components/EnvironmentCheck.vue'
import moment from 'moment'

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
      const time = this.stakingExpiry
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
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

<style lang="scss" scoped>
.container {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: #fff;
}
.stake {
  max-width: 700px;
  margin: 40px auto 0;
  /* background: #fff; */
  /* box-shadow: 0 0 10px rgba(0,0,0, 0.05); */
  padding: 40px 20px;
  box-sizing: border-box;
  border-radius: 3px;
  .title {
    text-align: center;
    font-size: 30px;
    color: #222;
    padding: 0;
    margin: 0;
  }
  .subtitle {
    text-align: center;
    font-size: 18px;
    color: #ababab;
    padding: 0;
    margin: 10px 0 50px;
    font-weight: 400;
    line-height: 1.2;
  }
  .panels,
  .staked {
    margin: 20px 0 0 0;
    .item-title {
      margin: 10px 0;
      padding: 0;
      font-size: 18px;
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      li {
        margin: 14px 0 14px 20px;
      }
    }
  }
  .panels {
    .contract {
      color: #3a8ee6;
      font-size: 14px;
      text-decoration: underline;
    }
  }
  .staked {
    ul li {
      font-size: 16px;
      color: #333;
    }
    a {
      text-decoration: underline;
    }
  }
  .not-staked {
    font-size: 16px;
    color: #333;
    padding: 0;
    margin: 10px 0;
    a {
      text-decoration: underline;
    }
  }

}
</style>
