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
            :autosize="{ minRows: 5, maxRows: 15}"
            placeholder="请输入正文"
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
        postId: null
      },
      post: null,
      timeout: null,
      postLoding: false,
      centerDialogVisible: false,
      finalFrom: null
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
      const { title, content, postSwitch, postId } = this.from
      if (!title || !content) return this.$message.error('请完整填写表单')
      else if (postSwitch) {
        if (!postId) return this.$message.error('请完整填写表单')
        if (this.postLoding) this.$message.error('正在获取文章，请稍后重试')
        if (!this.post) this.$message.error('您输入的文章ID有误')
      }
      // 整理表单
      const from = { title, content }
      if (postSwitch) from.postId = postId
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
        postId: null
      }
      this.finalFrom = null
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
