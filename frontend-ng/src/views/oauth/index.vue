<template>
  <div class="oauth">
    <p v-if="!error">登陆中...</p>
    <p v-else>
      登陆失败，请重试！
      <router-link :to="{ name: 'login' }">立即登陆</router-link>
    </p>
  </div>
</template>

<script>
import { setCookie } from '../../utils/cookie'
export default {
  data() {
    return {
      error: false
    }
  },
  mounted() {
    const { token: accessToken, path } = this.$route.query
    const toPath = path ? decodeURIComponent(path) : '/'

    // console.log('accessToken', accessToken, toPath)

    if (!accessToken) {
      this.error = true
      return
    }
    setCookie('access-token', accessToken)
    this.$router.push(toPath)
  }
}
</script>

<style lang="scss" scoped>
.oauth {
  p {
    text-align: center;
  }
  a {
    color: #3a8ee6;
    text-decoration: underline;
  }
}
</style>
