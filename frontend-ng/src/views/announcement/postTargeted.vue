<template>
  <div class="app-container">
    <div class="postform">
      <div class="postform-entry">
        <p>
          收件人
        </p>
        <div class="postform-entry-input">
          <div class="user-add">
            <searchUsers
              v-model="userData"
              class="user-input"
              placeholder="昵称/ID/用户名"
            />
            <el-button type="primary" @click="addUser">
              添加
            </el-button>
          </div>
          <div class="user-list">
            <div
              v-for="(user, index) in userList"
              :key="index"
              class="user-unit"
              @click="deleteUser(user.id)"
            >
              <avatar :src="cover(user.avatar)" size="30px" />
              <span class="username">{{ user.nickname || user.username }}</span>
              <i class="el-icon-delete" />
            </div>
          </div>
        </div>
      </div>
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
function newDatePicker(time) {
  const date = new Date()
  date.setTime(date.getTime() + time)
  return date
}

import postCard from '@/components/PostCard/index.vue'
import searchUsers from '@/components/SearchUsers'
import avatar from '@/components/avatar'

export default {
  components: {
    postCard,
    searchUsers,
    avatar
  },
  data() {
    return {
      from: {
        receivingIds: [],
        title: '',
        content: '',
        postSwitch: false,
        postId: null
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
      },
      userData: null,
      userList: []
    }
  },
  computed: {
  },
  watch: {
    userList(val) {
      this.from.receivingIds = this.userList.map(user => user.id)
    }
  },
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
      const { receivingIds, title, content, postSwitch, postId } = this.from
      if (!receivingIds || receivingIds.length === 0) return this.$message.error('未添加收件人')
      if (!title || !content) return this.$message.error('请完整填写表单')
      if (postSwitch) {
        if (!postId) return this.$message.error('请完整填写表单')
        if (this.postLoding) return this.$message.error('正在获取文章，请稍后重试')
        if (!this.post) return this.$message.error('您输入的文章ID有误')
      }
      // 整理表单
      const from = { title, content, receivingIds }
      if (postSwitch) from.postId = postId
      this.finalFrom = from
      this.centerDialogVisible = true
    },
    postAnnouncement(form) {
      this.centerDialogVisible = false
      this.request({
        url: this.apis.announcementTargeted,
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
    },
    addUser() {
      if (!this.userData) return this.$message.warning('未选择用户')
      if (this.userList.find(user => user.id === this.userData.id)) return this.$message.warning('该用户已被添加')
      this.userList.push(this.userData)
      this.userData = null
      console.log(this.userList)
    },
    deleteUser(id) {
      this.userList.splice(this.userList.findIndex(user => user.id === id), 1)
    },
    // logo
    cover(cover) {
      return cover ? `${this.apis.imgHost}${cover}` : ''
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

.user-add {
  display: flex;
}
.user-list {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(160px,1fr));
  grid-gap: 5px 5px;
  justify-content: space-between;
}
.user-unit {
  padding: 0 5px;
  display: flex;
  align-items: center;
  height: 40px;
  cursor: pointer;
  border-radius: 4px;
}
.user-unit:hover {
  background: #ededed;
}
.user-unit span {
  flex: 1;
  margin: 0 5px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  word-break: break-all;
}
.user-unit i {
  color: #f56c6c;
  display: none;
}

.user-unit:hover i {
  display: inline-flex;
}

.user-input {
  flex: 1;
  margin-right: 10px;
}
</style>
