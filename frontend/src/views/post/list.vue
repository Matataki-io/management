<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="id">
        <el-input v-model="search.id" placeholder="请输入用户ID" clearable size="small"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchList">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column label="id" prop="id" align="center" fixed/>
      <el-table-column label="文章hash" prop="hash" align="center" fixed/>
      <el-table-column label="文章标题" prop="title" align="center" fixed/>
      <el-table-column label="作者" prop="author" align="center"/>
      <el-table-column label="作者用户名" prop="username" align="center"/>
      <!-- <el-table-column label="摘要" prop="short_content" align="center" fixed/> -->
      <el-table-column label="状态" prop="status" align="center"/>
      <el-table-column label="发布时间" prop="create_time" align="center"/>
      <el-table-column label="封面" align="center">
        <template slot-scope="scope">
          <img v-if="scope.row.cover" :src="getImg(scope.row.cover)" alt="封面" width="100px">
        </template>
      </el-table-column>
      <el-table-column label="是否原创" prop="is_original" align="center"/>
      <el-table-column label="是否被推荐" prop="is_recommend" align="center"/>
      <el-table-column label="评论需要支付的积分" prop="comment_pay_point" align="center"/>
      <el-table-column label="干预时间排序" prop="time_down" align="center"/>
      <el-table-column align="center" label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="toDetail(scope.row.id)">详情</el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination
      :total="count"
      background
      layout="prev, pager, next"
      @current-change="handleCurrentChange"/>
  </div>
</template>

<script>
import { isNull } from '@/utils/validate'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      count: 0,
      listLoading: true,
      pageSize: 10,
      pageIndex: 1,
      search: {
        id: ''
      }
    }
  },
  created() {
    this.getList(1)
  },
  methods: {
    getImg(hash) {
      return `${this.apis.imgHost}${hash}`
    },
    fromUnixTimestamp(v) {
      return v * 1000
    },
    toUnixTimestamp(v) {
      return Math.round(v / 1000)
    },
    searchList() {
      this.getList(1)
    },
    handleCurrentChange(v) {
      this.getList(v)
    },
    toDetail(id) {
      this.$router.push({
        path: `/p/detail/${id}`
      })
    },
    getList(pageIndex) {
      this.listLoading = true
      const search = {}
      for (const item in this.search) {
        if (!isNull(this.search[item])) {
          search[item] = this.search[item]
        }
      }
      this.request({
        url: this.apis.posts,
        method: 'get',
        noLoading: true,
        params: {
          pageSize: this.pageSize,
          pageIndex: pageIndex || this.pageIndex,
          ...search
        }
      }).then(res => {
        this.listLoading = false
        this.list = res.data.rows
        this.count = res.data.count
      })
    }
  }
}
</script>

<style scoped>

</style>
