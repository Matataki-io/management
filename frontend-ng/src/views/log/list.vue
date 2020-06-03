<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="管理员ID" prop="uid" align="center" width="100" fixed />
      <el-table-column label="时间" prop="timestamp" align="center" width="200" fixed>
        <template slot-scope="scope">
          {{ new Date(scope.row.timestamp).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="来源模块" prop="data" width="100" align="center">
        <template slot-scope="scope">
          {{ fromMod(scope.row.source) }}
        </template>
      </el-table-column>
      <el-table-column label="级别" prop="data" width="100" align="center">
        <template slot-scope="scope">
          {{ logType(scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column label="日志数据" prop="data" align="center">
        <template slot-scope="scope">
          <DataRenderer :log="scope.row" />
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
import DataRenderer from "../../components/Logging/DataRenderer";

export default {
  components: {
    DataRenderer
  },
  data() {
    return {
      list: null,
      count: 0,
      listLoading: true,
      pageSize: 10,
      pageIndex: 1,
      search: {
        id: '',
        username: '',
        nickname: '',
        is_recommend: false,
        isMint: false
      }
    }
  },
  created() {
    this.getList(1)
  },
  methods: {
    handleCurrentChange(v) {
      this.getList(v)
    },
    fromMod(v) {
      switch (v) {
        case 'post': return '文章管理'
        case 'user': return '用户管理'
        default: return v
      }
    },
    parseDataWithIndent(v) {
      const obj = JSON.parse(v)
      return JSON.stringify(obj, null, 2)
    },
    logType(v) {
      switch (v) {
        case 'info': return '普通'
        case 'warn': return '警告'
        default: return v
      }
    },
    getList(pageIndex) {
      this.listLoading = true
      //   const search = {}
      //   for (const item in this.search) {
      //     if (!isNull(this.search[item])) {
      //       if (['is_recommend', 'isMint'].indexOf(item) >= 0) {
      //         search[item] = this.search[item] ? '1' : ''
      //       } else {
      //         search[item] = this.search[item]
      //       }
      //     }
      //   }
      this.request({
        url: `api/logs`,
        method: 'get',
        noLoading: true,
        params: {
          pageSize: this.pageSize,
          pageIndex: pageIndex || this.pageIndex
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
