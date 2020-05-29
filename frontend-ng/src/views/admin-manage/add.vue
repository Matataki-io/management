<template>
  <div class="add-admin">
    <h1 class="title">添加管理员</h1>
    <el-alert
      v-if="savedNewUser"
      title="管理员创建成功"
      type="success"
      show-icon
    >
      新管理员的用户名：<code>{{ savedNewUser.username }}</code> 密码：<code>{{ savedNewUser.password }}</code>
    </el-alert>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="昵称">
        <el-input v-model="form.nickname" />
      </el-form-item>
      <el-form-item label="用户名">
        <el-input id="username" v-model="form.username" name="username" required />
      </el-form-item>
      <el-form-item label="密码">
        <el-input id="password" v-model="form.password" name="password" required show-password />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data: () => ({
    form: {
      username: '',
      nickname: '',
      password: ''
    },
    savedNewUser: null
  }),
  methods: {
    async onSubmit() {
      this.request({
        url: this.apis.admin + '/addUser',
        method: 'post',
        data: this.form
      }).then(() => {
        this.$notify({
          title: '创建成功',
          message: '让他去登陆吧',
          type: 'success'
        })
        this.saveAndReset()
      }).catch(() => {
        this.$notify({
          title: '创建失败',
          message: '可能是用户名同名',
          type: 'error'
        })
      })
    },
    saveAndReset() {
      this.savedNewUser = this.form
      this.form = {
        username: '',
        nickname: '',
        password: ''
      }
    }
  }
}
</script>

<style scoped>
.add-admin {
    padding: 10px;
}

.add-admin *:not(:last-child) {
    margin-bottom: 10px;
}
</style>
