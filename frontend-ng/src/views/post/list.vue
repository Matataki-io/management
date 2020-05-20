<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="id">
        <el-input v-model="search.id" placeholder="请输入文章ID" clearable size="small" />
      </el-form-item>
      <el-form-item label="文章标题">
        <el-input v-model="search.title" placeholder="请输入文章标题" clearable size="small" />
      </el-form-item>
      <el-form-item label="作者">
        <el-input v-model="search.author" placeholder="请输入作者Id/昵称/账号" clearable size="small" />
      </el-form-item>
      <el-form-item label="只看推荐">
        <el-switch v-model="search.is_recommend" @change="getList(1)" />
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
      highlight-current-row
    >
      <el-table-column label="id" prop="id" align="center" fixed />
      <el-table-column label="文章hash" prop="hash" align="center" fixed />
      <el-table-column label="文章标题" prop="title" align="center" fixed />
      <el-table-column label="作者" prop="author" align="center" />
      <el-table-column label="作者用户名" prop="username" align="center" />
      <el-table-column label="摘要" prop="short_content" align="center" width="300">
        <template slot-scope="scope">
          {{ scope.row.short_content.slice(0, 25) + '...' }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="状态" prop="status" align="center" /> -->
      <el-table-column label="隐藏文章" align="center" fixed="right">
        <template slot-scope="scope">
          <el-switch
            :value="Boolean(scope.row.status)"
            @change="handleChange($event, scope.$index)"
          />
        </template>
      </el-table-column>
      <el-table-column label="推荐" align="center" fixed="right">
        <template slot-scope="scope">
          <el-switch
            :value="Boolean(scope.row.is_recommend)"
            @change="handlePromoteChange($event, scope.$index)"
          />
        </template>
      </el-table-column>

      <el-table-column label="发布时间" prop="create_time" width="105" align="center">
        <template slot-scope="scope">
          {{ new Date(scope.row.create_time).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="封面" align="center">
        <template slot-scope="scope">
          <img v-if="scope.row.cover" :src="getImg(scope.row.cover)" alt="封面" width="100px">
        </template>
      </el-table-column>
      <el-table-column label="是否原创" prop="is_original" align="center">
        <template slot-scope="scope">
          {{ scope.row.is_original ? "是" : "否" }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="是否被推荐" prop="is_recommend" align="center" /> -->
      <el-table-column label="评论需要支付的积分" prop="comment_pay_point" align="center" />
      <el-table-column label="干预时间排序" prop="time_down" align="center" />
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
      @current-change="handleCurrentChange"
    />
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
  // watch: {
  //   search: {
  //     deep: true,
  //     handler() {
  //       this.getList(1);
  //     }
  //   }
  // },
  data() {
    return {
      list: null,
      count: 0,
      listLoading: true,
      pageSize: 10,
      pageIndex: 1,
      search: {
        id: '',
        title: '',
        author: '',
        is_recommend: false
      }
    }
  },
  created() {
    this.getList(1)
  },
  methods: {
    handleChange(e, index) {
      this.listLoading = true
      const id = this.list[index].id
      this.request({
        url: `${this.apis.posts}/${id}`,
        method: 'put',
        data: {
          status: Number(e)
        }
      }).then(res => {
        this.listLoading = false
        if (res.code === 0) {
          this.list[index].status = Number(e)
          this.$message.success(`修改成功，${e ? '已被删除' : '已被释出'}`)
        } else {
          this.$message.success('修改失败')
        }
      })
    },
    handlePromoteChange(e, index) {
      this.listLoading = true
      const id = this.list[index].id
      this.request({
        url: `${this.apis.posts}/${id}`,
        method: 'put',
        data: {
          is_recommend: Number(e)
        }
      }).then(res => {
        this.listLoading = false
        if (res.code === 0) {
          this.list[index].is_recommend = Number(e)
          this.$message.success(`修改成功，${e ? '已推荐' : '已取消推荐'}`)
        } else {
          this.$message.success('修改失败')
        }
      })
    },
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
      // debugger;
      for (const item in this.search) {
        if (!isNull(this.search[item])) {
          if (item === 'is_recommend') {
            search[item] = this.search[item] ? '1' : ''
          } else {
            search[item] = this.search[item]
          }
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
      })
        .then(res => {
          this.listLoading = false
          this.list = res.data.rows
          this.count = res.data.count
        })
        .catch(error => {
          if (error.response.status === 401) {
            console.log('登录超时')
            this.$store.dispatch('FedLogOut').then(() => {
              location.reload() // 为了重新实例化vue-router对象 避免bug
            })
          }
        })
    }
  }
}
</script>

<style scoped>
</style>
