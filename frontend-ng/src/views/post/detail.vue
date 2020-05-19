<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        <span>文章基础数据</span>
      </div>
      <div>
        <el-form ref="form" label-width="140px" class="sun-form">
          <el-form-item label="id：">
            <span class="my-value">{{ p.id }}</span>
          </el-form-item>
          <el-form-item label="标题：">
            <span class="my-value">{{ detail.title }}</span>
          </el-form-item>
          <el-form-item label="作者：">
            <span class="my-value">{{ detail.author }}</span>
          </el-form-item>
          <el-form-item label="头图：">
            <img v-if="p.cover" :src="getImg(p.cover)" alt="头图" width="100px">
          </el-form-item>
          <el-form-item label="发布时间：">
            <span class="my-value">{{ p.create_time }}</span>
          </el-form-item>
          <el-form-item label="来源平台：">
            <span class="my-value">{{ p.platform }}</span>
          </el-form-item>
          <el-form-item label="是否需要持币阅读：">
            <span class="my-value">{{ p.require_holdtokens }}</span>
          </el-form-item>
          <el-form-item label="推荐文章">
            <el-switch v-model="is_recommend" @change="updateRecommend" />
          </el-form-item>
          <el-form-item label="修改时间排序">
            <el-input-number v-model="timeDown" :min="0" placeholder="默认0，越大越靠后" />
            <el-button @click="updateTime">更新</el-button>
          </el-form-item>
          <el-form-item label="修改热门排序">
            <el-input-number v-model="hotDown" :min="0" placeholder="默认0，越大越靠后" />
            <el-button @click="updateHot">更新</el-button>
          </el-form-item>
          <el-form-item label="隐藏文章">
            <el-switch v-model="status" @change="updateStatus" />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card v-loading="contentLoading" style="margin-top: 20px;">
      <div slot="header">
        <span>文章内容数据</span>
      </div>
      <div>{{ detail.content }}</div>
    </el-card>
  </div>
</template>

<script>
// import { userStatus } from '@/utils/consts'
// import axios from 'axios'
export default {
  name: 'Detail',
  components: {},
  data() {
    return {
      id: 0,
      p: {},
      detail: {},
      timeDown: '',
      hotDown: '',
      status: 0,
      is_recommend: 0,
      contentLoading: false
    }
  },
  computed: {},
  mounted() {
    const id = this.$route.params.id
    this.id = id
    this.getDetail(id)
  },
  methods: {
    // 更新推荐
    updateRecommend(v) {
      this.updatePost({ is_recommend: Number(v) })
    },
    // 更新时间排序
    updateTime() {
      this.updatePost({
        time_down: this.timeDown
      })
    },
    // 更新热门排序
    updateHot() {
      this.updatePost({
        down: this.hotDown
      })
    },
    // 隐藏文章
    updateStatus(v) {
      console.log()
      this.updatePost({
        status: Number(v)
      })
    },
    updatePost(data) {
      /* data格式
      {
        time_down: this.timeDown,
        down: this.hotDown,
        status: this.status
      }
      */
      this.request({
        url: `${this.apis.posts}/${this.id}`,
        method: 'put',
        data
      }).then(res => {
        if (res.code === 0) {
          this.$message.success('修改成功')
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
        this.timeDown = res.data.time_down
        this.hotDown = res.data.down
        this.status = Boolean(res.data.status)
        this.is_recommend = Boolean(res.data.is_recommend)
        this.getArticleDatafromIPFS(res.data.hash)
      })
    },
    getArticleDatafromIPFS(hash) {
      this.contentLoading = true
      this.request({
        url: `${this.apis.ipfs}/${hash}`,
        method: 'get',
        noLoading: true
      }).then(res => {
        this.contentLoading = false
        this.detail = res.data
        console.log(res)
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
