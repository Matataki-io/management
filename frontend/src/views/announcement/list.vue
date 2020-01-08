<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="生效区域">
        <el-select v-model="search.CountryCode" clearable placeholder="有效区域">
          <el-option
            v-for="item in countryCodes"
            :key="item.locale"
            :label="item.zh"
            :value="item.locale"
          />
        </el-select>
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
      <el-table-column label="ID" width="80" align="center">
        <template slot-scope="scope">{{ scope.row.Id }}</template>
      </el-table-column>
      <el-table-column label="开始时间" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Start|dateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.End|dateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生效区域" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.CountryCodes||'全部' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="中文内容" align="center">
        <template slot-scope="scope">{{ scope.row.Content }}</template>
      </el-table-column>
      <el-table-column label="有效" width="110" align="center">
        <template slot-scope="scope">{{ (scope.row.IsActive ?"有效":"无效") }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="toDetail(scope.row.Id)">详情</el-button>
          <el-button type="text" size="small" @click="del(scope.row.Id)">删除</el-button>
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
import moment from 'moment'

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

  filters: {
    dateFilter: function(val) {
      return moment(val).format('YYYY-MM-DD HH:mm')
    }
  },
  data() {
    return {
      list: null,
      count: 0,
      listLoading: true,
      pageSize: 10,
      pageIndex: 1,
      createDate: null,
      search: {
        CountryCode: ''
      }
    }
  },
  computed: {
    countryCodes: function() {
      return this.utils.countryCode()
    }
  },
  watch: {},
  created() {
    this.getList(1)
  },
  methods: {
    del(id) {
      this.$confirm('确认删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.request({
            url: this.apis.announcement + '/' + id,
            method: 'delete',
            noLoading: true
          }).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList(1)
          })
        })
        .catch(() => {})
    },
    searchList() {
      this.getList(1)
    },
    handleCurrentChange(v) {
      this.getList(v)
    },
    toDetail(id) {
      this.$router.push({
        path: `/announcement/detail/${id}`
      })
    },
    getList(pageIndex) {
      this.listLoading = true
      this.request({
        url: this.apis.announcement,
        method: 'get',
        noLoading: true,
        params: {
          pageSize: this.pageSize,
          pageIndex: pageIndex || this.pageIndex,
          ...this.search
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
