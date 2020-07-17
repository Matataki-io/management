<template>
  <div class="app-container">
    <div class="postform">
      <div class="postform-entry">
        <p>
          标题
        </p>
        <div class="postform-entry-input">
          <el-input
            v-model="from.title"
            type="text"
            placeholder="请输入标题"
            maxlength="255"
            show-word-limit
          />
        </div>
      </div>

      <div class="postform-entry">
        <p>
          正文
        </p>
        <div class="postform-entry-input">
          <el-input
            v-model="from.content"
            type="textarea"
            :autosize="{ minRows: 10 }"
            placeholder="请输入正文"
            maxlength="1000"
            show-word-limit
          />
        </div>
      </div>

      <div class="postform-entry">
        <p>
          引用文章
        </p>
        <div class="postform-entry-input">
          <el-switch
            v-model="from.postSwitch"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </div>
      </div>

      <div v-if="from.postSwitch" class="postform-entry">
        <p>
          引用文章ID
        </p>
        <div class="postform-entry-input">
          <el-input-number
            v-model="from.postId"
            :controls="false"
            :precision="0"
            :min="0"
            :max="999999"
            label="【可选】引用文章"
            @change="handleChange"
          />
        </div>
      </div>
      <div v-if="from.postSwitch" class="postform-entry">
        <p>
          文章预览
        </p>
        <div class="postform-entry-input">
          <postCard v-loading="postLoding" :p="post" />
        </div>
      </div>
      <el-divider content-position="left">通知方式</el-divider>
      <div class="postform-entry">
        <p>
          即时通知
        </p>
        <div class="postform-entry-input">
          <el-switch
            v-model="from.informInstant"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="updateInformInstant"
          />
        </div>
      </div>
      <div class="postform-entry">
        <p>
          新用户通知
        </p>
        <div class="postform-entry-input">
          <el-switch
            v-model="from.informNewUser"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="updateInformNewUser"
          />
        </div>
      </div>
      <div v-if="from.informNewUser" class="postform-entry">
        <p>
          失效时间
        </p>
        <div class="postform-entry-input">
          <el-date-picker
            v-model="from.expireTime"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions"
          />
        </div>
      </div>
      <div class="postform-button">
        <el-button type="primary" @click="confirm">
          发布
        </el-button>
      </div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="400px"
      center
    >
      <span>确定要发布么？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="postAnnouncement(finalFrom)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'

function newDatePicker(time) {
  const date = new Date()
  date.setTime(date.getTime() + time)
  return date
}

import postCard from '@/components/PostCard/index.vue'

export default {
  components: {
    postCard
  },
  data() {
    return {
      from: {
        title: '',
        content: '',
        postSwitch: false,
        postId: null,
        informInstant: true,
        informNewUser: false,
        expireTime: ''
      },
      post: null,
      timeout: null,
      postLoding: false,
      centerDialogVisible: false,
      finalFrom: null,
      pickerOptions: {
        shortcuts: [
          {
            text: '一小时后',
            onClick(picker) {
              picker.$emit('pick', newDatePicker(3600 * 1000))
            }
          },
          {
            text: '明天',
            onClick(picker) {
              picker.$emit('pick', newDatePicker(3600 * 1000 * 24))
            }
          },
          {
            text: '后天',
            onClick(picker) {
              picker.$emit('pick', newDatePicker(3600 * 1000 * 48))
            }
          },
          {
            text: '一周后',
            onClick(picker) {
              picker.$emit('pick', newDatePicker(3600 * 1000 * 24 * 7))
            }
          }
        ]
      }
    }
  },
  computed: {
  },
  watch: {},
  created() {
  },
  methods: {
    getPost(id) {
      this.request({
        url: `${this.apis.posts}/${id}`,
        method: 'get'
      }).then(res => {
        this.postLoding = false
        if (res.data && res.data.id) this.post = res.data
        else this.post = null
      }).catch(() => {
        this.postLoding = false
        this.$notify({
          title: '失败',
          message: '无法获取文章',
          type: 'error'
        })
      })
    },
    getImg(hash) {
      return `${this.apis.imgHost}${hash}`
    },
    confirm() {
      // console.log(JSON.stringify(this.from))
      // 有效性检查
      const { title, content, postSwitch, postId, informInstant, informNewUser, expireTime } = this.from
      if (!title || !content) return this.$message.error('请完整填写表单')
      else if (postSwitch) {
        if (!postId) return this.$message.error('请完整填写表单')
        if (this.postLoding) return this.$message.error('正在获取文章，请稍后重试')
        if (!this.post) return this.$message.error('您输入的文章ID有误')
      } else if (informNewUser && expireTime) {
        const date = new Date()
        if (expireTime <= date) return this.$message.error('失效时间不能小于当前时间')
      }
      // 整理表单
      const from = { title, content, informInstant, informNewUser }
      if (postSwitch) from.postId = postId
      if (informNewUser && expireTime) from.expireTime = moment(expireTime).utc().format('YYYY-MM-DD HH:mm:ss')
      this.finalFrom = from
      this.centerDialogVisible = true
    },
    postAnnouncement(form) {
      this.centerDialogVisible = false
      this.request({
        url: this.apis.announcement,
        method: 'post',
        data: form
      }).then(() => {
        this.$notify({
          title: '成功',
          message: '公告发布成功',
          type: 'success'
        })
        this.clearForm()
      }).catch(() => {
        this.$notify({
          title: '失败',
          message: '公告发布失败',
          type: 'error'
        })
      })
    },
    handleChange(val) {
      console.log(val)
      if (this.timeout) clearTimeout(this.timeout)
      if (!val) {
        this.post = null
        return
      }
      this.postLoding = true
      this.timeout = setTimeout(() => this.getPost(this.from.postId), 1000)
    },
    clearForm() {
      this.from = {
        title: '',
        content: '',
        postSwitch: false,
        postId: null,
        informInstant: true,
        informNewUser: false,
        expireTime: ''
      }
      this.finalFrom = null
    },
    updateInformInstant(newVal) {
      if (!newVal) this.from.informNewUser = true
    },
    updateInformNewUser(newVal) {
      if (!newVal) this.from.informInstant = true
    }
  }
}
</script>

<style scoped>

.postform-entry {
  display: flex;
  margin-bottom: 20px;
}

.postform-entry p {
  font-size: 16px;
  margin: 0 10px 0 0;
  min-width: 90px;
}

.postform-entry-input {
  max-width: 600px;
  flex: 1;
}

.postform-button {
  margin-top: 40px;
  margin-left: 100px;
}
.postform-button button {
  width: 180px;
}
</style>
