<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        <span>用户基础数据</span>
      </div>
      <div>
        <el-form ref="form" label-width="120px" class="sun-form">
          <el-form-item label="id："><span class="my-value">{{ u.id }}</span></el-form-item>
          <el-form-item label="用户名："><span class="my-value">{{ u.username }}</span></el-form-item>
          <el-form-item label="邮箱："><span class="my-value">{{ u.email }}</span></el-form-item>
          <el-form-item label="昵称："><span class="my-value">{{ u.nickname }}</span></el-form-item>
          <el-form-item label="头像："><img v-if="u.avatar" :src="getImg(u.avatar)" alt="头像" width="100px"></el-form-item>
          <el-form-item label="自我介绍："><span class="my-value">{{ u.introduction }}</span></el-form-item>
          <el-form-item label="来源平台："><span class="my-value">{{ u.platform }}</span></el-form-item>
          <el-form-item label="注册时间："><span class="my-value">{{ u.create_time }}</span></el-form-item>
          <el-form-item label="最后登录时间："><span class="my-value">{{ u.last_login_time }}</span></el-form-item>
          <el-form-item label="注册IP："><span class="my-value">{{ u.reg_ip }}</span></el-form-item>
          <el-form-item label="最后登录IP："><span class="my-value">{{ u.last_login_ip }}</span></el-form-item>
        </el-form>
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
import { userStatus } from '@/utils/consts'
import axios from 'axios'
export default {
  name: 'Detail',
  components: {
  },
  data() {
    return {
      id: 0,
      u: {},
      p: {},
      isSeed: false,
      isMint: false,
      isExchange: false,
    }
  },
  mounted() {
    const id = this.$route.params.id
    this.id = id
    this.getDetail(id)
  },
  computed: {
  },
  methods: {
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
          this.$message.success('修改成功');
        }
      })
    },
    getImg(hash) {
      return `${this.apis.imgHost}${hash}`
    },
    getDetail(id) {
      this.request({
        url: `${this.apis.posts}/${id}`,
        method: 'get'
      }).then(res => {
        this.p = res.data
        this.getArticleDatafromIPFS(res.data.hash)
      })
    },
    getArticleDatafromIPFS(hash) {
      this.request({
        url: `${this.apis.ipfs}/${hash}`,
        method: 'get'
      }).then(res => {
        console.log(res)
      })
    },
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
