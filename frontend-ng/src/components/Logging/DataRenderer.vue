<template>
  <div class="log-data-renderer" style="text-align: left;">
      <div class="login-detail" v-if="type === 'login'">
          IP <code>{{logData.ip}}</code> 在 <code>{{logData.os.name}} {{logData.os.version}}</code> 系统的 <code>{{logData.browser.name}}</code> 浏览器登陆管理后台
      </div>
      <div class="broadcast-detail" v-else-if="type === 'broadcast'">
          {{ logData.msgType }} 广播了这样的消息: 
          <pre v-html="logData.sentMessage">
         </pre>
      </div>
    <vue-json-pretty v-else
      :data="logData"
      :deep="2"
    />
  </div>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'

export default {
  name: 'LogDataRenderer',
  components: {
    VueJsonPretty
  },
  props: {
    log: Object
  },
  computed: {
    type() {
      return this.log.source
    },
    logData() {
        return JSON.parse(this.log.data)
    }
  },
  methods: {}
}
</script>

<style scoped>
.log-data-renderer { text-align: left; }
</style>