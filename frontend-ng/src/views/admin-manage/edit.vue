<template>
  <div class="edit-admin">
    <h1 class="title">管理员资料修改</h1>
    <el-alert
      v-if="savedNewUser"
      title="目前仅支持修改本人的管理员资料"
      type="warning"
      show-icon
    >
      为了安全考虑，如果是忘记密码，请联系可以接触到数据库的工程师协助修改密码工作。
    </el-alert>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="昵称">
        <el-input v-model="form.nickname" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input id="password" v-model="form.password" name="password" required show-password />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">修改</el-button>
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
  }),
  async mounted() {
      const result = await this.request({
        url: this.apis.admin + '/me',
      });
      this.form = result.data;
  },
  methods: {
    async onSubmit() {
      this.request({
        url: this.apis.admin + '/edit',
        method: 'patch',
        data: this.form
      }).then(() => {
        this.$notify({
          title: '创建成功',
          message: '让他去登陆吧',
          type: 'success'
        })
      }).catch(() => {
        this.$notify({
          title: '创建失败',
          message: '可能是用户名同名',
          type: 'error'
        })
      })
    },
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
