<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="项目ID">
        <el-input v-model="search.ProjectId" placeholder="请输入项目ID" clearable size="small"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <a :href="downloadLink" target="_blank">
          <el-button type="success">导出</el-button>
        </a>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column label="项目ID" prop="ProjectId" width="100" align="center" fixed/>
      <el-table-column label="提现地址" align="center" prop="Address" />
      <el-table-column label="提交时间" width="110" align="center">
        <template slot-scope="scope">
          {{ formatTimestamp(scope.row.CreateDate) }}
        </template>
      </el-table-column>
      <el-table-column label="提现数量" align="center" prop="Amount" />
      <el-table-column label="ONTID" align="center" prop="ONTID" />
      <!--<el-table-column align="center" label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="toDetail(scope.row.ONTID)">详情</el-button>
        </template>
      </el-table-column>-->
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
        ProjectId: ''
      },
      AuthOptions: [
        {
          value: '0',
          label: '认证中'
        }, {
          value: '1',
          label: '认证失败'
        }, {
          value: '2',
          label: '认证成功'
        }
      ]
    }
  },
  computed: {
    downloadLink() {
      if (!isNull(this.search.ProjectId)) {
        return process.env.BASE_API + this.apis.exportWithdraw + `?ProjectId=${this.search.ProjectId}`
      }
      return process.env.BASE_API + this.apis.exportWithdraw
    }
  },
  created() {
    this.getList(1)
  },
  methods: {
    exportList() {
      const search = {}
      for (const item in this.search) {
        if (!isNull(this.search[item])) {
          search[item] = this.search[item]
        }
      }
      this.request({
        url: this.apis.exportWithdraw,
        method: 'get',
        params: {
          ...search
        },
        responseType: 'blob'
      }).then((res) => {
        this.download(res)
      })
    },
    formatTimestamp(time) {
      return this.utils.formatTimestamp(time)
    },
    getAuth(flag) {
      flag = parseInt(flag)
      if (flag === 0) return { text: '认证中', type: 'warning' }
      if (flag === 1) return { text: '认证失败', type: 'danger' }
      if (flag === 2) return { text: '认证成功', type: 'success' }
      return { text: '未认证', type: 'info' }
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
        path: `/user/detail/${id}`
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
        url: this.apis.withdrawRecord,
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
