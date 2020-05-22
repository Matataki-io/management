<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        <span>用户基础数据</span>
        <el-button
          style="float: right;"
          type="text"
          icon="el-icon-close"
          @click="closePage"
        >关闭</el-button>
      </div>
      <div>
        <el-form ref="form" label-width="120px" class="sun-form">
          <el-form-item label="id：">
            <span class="my-value">{{ u.id }}</span>
          </el-form-item>
          <el-form-item label="用户名：">
            <span class="my-value">{{ u.username }}</span>
          </el-form-item>
          <el-form-item label="邮箱：">
            <span class="my-value">{{ u.email }}</span>
          </el-form-item>
          <el-form-item label="昵称：">
            <span class="my-value">{{ u.nickname }}</span>
          </el-form-item>
          <el-form-item label="头像：">
            <img v-if="u.avatar" :src="getImg(u.avatar)" alt="头像" width="100px">
          </el-form-item>
          <el-form-item label="自我介绍：">
            <span class="my-value">{{ u.introduction }}</span>
          </el-form-item>
          <el-form-item label="来源平台：">
            <span class="my-value">{{ u.platform }}</span>
          </el-form-item>
          <el-form-item label="注册时间：">
            <span class="my-value">{{ u.create_time }}</span>
          </el-form-item>
          <el-form-item label="最后登录时间：">
            <span class="my-value">{{ u.last_login_time }}</span>
          </el-form-item>
          <el-form-item label="注册IP：">
            <span class="my-value">{{ u.reg_ip }}</span>
          </el-form-item>
          <el-form-item label="最后登录IP：">
            <span class="my-value">{{ u.last_login_ip }}</span>
          </el-form-item>
          <el-form-item label="推荐用户：">
            <el-switch v-model="isRecommend" @change="handleChange($event, 'isRecommend')" />
          </el-form-item>
          <el-form-item label="种子用户：">
            <el-switch v-model="isSeed" @change="handleChange($event, 'isSeed')" />
          </el-form-item>
          <el-form-item label="发币用户：">
            <el-switch v-model="isMint" @change="handleChange($event, 'isMint')" />
          </el-form-item>
          <el-form-item label="交易权限：">
            <el-switch v-model="isExchange" @change="handleChange($event, 'isExchange')" />
          </el-form-item>
        </el-form>
        <!-- <p>id: {{ u.id }}</p>
        <p>用户名: {{ u.username }}</p>
        <p>邮箱: {{ u.email }}</p>
        <p>昵称: {{ u.nickname }}</p>
        <p>头像:
          <img v-if="u.avatar" :src="getImg(u.avatar)" alt="头像" width="100px">
        </p>
        <p>自我介绍: {{ u.introduction }}</p>
        <p>来源平台: {{ u.platform }}</p>
        <p>注册时间: {{ u.create_time }}</p>
        <p>最后登录时间: {{ u.last_login_time }} 秒/点</p>
        <p>注册IP: {{ u.reg_ip }}</p>
        <p>最后登录IP: {{ u.last_login_ip }}</p>-->
      </div>
    </el-card>
    <el-card style="margin-top: 20px;">
      <div slot="header">
        <span>ces1</span>
      </div>
    </el-card>
    <el-card style="margin-top: 20px;">
      <div slot="header">
        <span>ces2</span>
      </div>
    </el-card>
  </div>
</template>

<script>
// import RpLog from '@/views/redpacket/components/rpLog'
// import TokenList from './components/tokenList'
import { userStatus } from '@/utils/consts'
export default {
  name: 'Detail',
  components: {
    // RpLog,
    // TokenList
  },
  data() {
    return {
      id: 0,
      u: {},
      isSeed: false,
      isMint: false,
      isExchange: false,
      isRecommend: false
    }
  },
  computed: {},
  mounted() {
    const id = this.$route.params.id
    this.id = id
    this.getDetail(id)
  },
  methods: {
    closePage() {
      window.close()
    },
    handleChange(value, type) {
      console.log(value, type)
      this.request({
        url: `${this.apis.user}/${this.id}`,
        method: 'put',
        data: {
          [type]: value
        }
      }).then(res => {
        if (res.code === 0) {
          this.$message.success('修改成功')
        }
      })
    },
    getImg(hash) {
      return `${this.apis.imgHost}${hash}`
    },
    updateTitle(u) {
      let displayName = u.nickname || u.username
      if (displayName.length > 5) {
        displayName = displayName.slice(0, 5) + '...'
      }
      document.title = `👩 ${displayName} (UID:${u.id}) 的资料`
    },
    getDetail(id) {
      this.request({
        url: `${this.apis.user}/${id}`,
        method: 'get'
      }).then(res => {
        this.u = res.data
        const status = res.data.status
        this.isSeed = (status & userStatus.isSeed) === userStatus.isSeed
        this.isMint = (status & userStatus.isMint) === userStatus.isMint
        this.isExchange =
          (status & userStatus.isExchange) === userStatus.isExchange
        this.isRecommend = res.data.is_recommend
        this.updateTitle(res.data)
      })
    }
  }
}
</script>

<style lang="scss">
.sun-form {
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
<style scoped>
.my-value {
  font-size: 16px;
}
</style>
