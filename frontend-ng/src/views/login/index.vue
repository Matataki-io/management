<template>
  <div class="login-container">
    <div class="login-content">
      <h3 class="title">Matataki 治理委员会</h3>
      <el-alert
        title="恭喜你发现了试验功能"
        type="warning"
        show-icon
      >
        <template>
          <p>注意事项</p>
          <ul style="text-align: left;">
            <li>这是一个预览版，暂时仅限 META 代币持有者参与</li>
            <li>需要把 MetaMask 钱包切换到BSC网络</li>
            <li>需要你把 META 提现到 BSC 主网的私人钱包，并在下方参与 META 抵押锁仓30天，以获得30天的访问权限</li>
            <li>META 抵押锁仓有效期30天，到期可以解押提现离场，或手动申请延长锁仓30天</li>
            <li>治理委员会仍在开发中，未来可能会增删部分功能</li>
          </ul>
        </template>
      </el-alert>
      <el-button :loading="loading" type="primary" class="sign-in" @click.native.prevent="signToLogin">
        使用 MetaMask 一键登录
      </el-button>
      <br>
      <el-button type="primary" class="sign-in" @click.native.prevent="$router.push('/stake')">
        去抵押 META 以获得权限
      </el-button>
    </div>
  </div>
</template>

<script>
import { signLoginRequest } from '../../utils/signature'

export default {
  name: 'Login',
  data: () => ({
    loading: false,
    isMetaMaskActive: false,
    selectedWallet: null,
    isOnBsc: false
  }),
  async mounted() {
    this.isMetaMaskActive = (typeof window.ethereum !== 'undefined')
    if (!window.ethereum) return
    const { networkVersion, selectedAddress } = window.ethereum
    this.selectedWallet = selectedAddress
    this.isOnBsc = Number(networkVersion) === 56
    window.ethereum.on('chainChanged', chainId => {
      // handle the new network
      this.isOnBsc = Number(chainId) === 56
    })
    window.ethereum.on('accountsChanged', ([primaryAcc]) => {
      this.selectedWallet = primaryAcc
    })
  },
  methods: {
    async jumpToMttkOAuth() {
      window.location = process.env.VUE_APP_OAuthUrl
    },
    async signToLogin() {
      try {
        if (!this.selectedWallet) throw new Error('请连接 MetaMask 以进行签名')
        this.loading = true
        const { signature, message } = await signLoginRequest(this.selectedWallet)
        console.info('signature', signature)
        console.info('message', message)
        await this.$store.dispatch('Login', { signature, message })
        this.$router.push({ path: this.redirect || '/' })
        // const { data } = await this.request({
        //   url: this.apis.loginBySignature,
        //   method: 'post',
        //   data: {
        //     signature,
        //     data: message
        //   }
        // })
    
        // const token = `${data.token_type} ${data.access_token}`
        // console.info('login token', token)
      } catch (error) {
        alert('Error, msg: ', error.message)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 80px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>

<style lang="scss" scoped>
.login-content {
  max-width: 540px;
  margin: 200px auto 0;
  text-align: center;
  .sign-in {
    margin: 20px;
    width: 300px;
  }
}
</style>
