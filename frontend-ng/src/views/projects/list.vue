<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="项目ID">
        <el-input v-model="search.ProjectId" placeholder="请输入项目ID" clearable size="small" />
      </el-form-item>
      <el-form-item label="公链">
        <el-select v-model="search.BlockChainName" placeholder="请选择公链" clearable size="small">
          <el-option
            v-for="item in BlockChainNameOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!--<el-form-item label="时间">
        <el-date-picker
          size="small"
          v-model="createDate"
          type="daterange"
          range-separator="-"
          value-format="timestamp"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>-->
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
      <el-table-column label="项目ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.ProjectId }}
        </template>
      </el-table-column>
      <el-table-column label="公链" width="110" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.BlockChainName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="代币名称" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.TokenName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代币标准" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.TokenStandard }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Website" align="center">
        <template slot-scope="scope">
          {{ scope.row.Website }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Logo" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.Logo }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="200">
        <template slot-scope="scope">
          <span>{{ statusOptions[scope.row.Status] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="toDetail(scope.row.ProjectId)">详情</el-button>
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
  data() {
    return {
      list: null,
      count: 0,
      listLoading: true,
      pageSize: 10,
      pageIndex: 1,
      createDate: null,
      search: {
        ProjectId: '',
        BlockChainName: '',
        StartDate: '',
        EndDate: ''
      },
      BlockChainNameOptions: [
        {
          value: 'ETH',
          label: 'Ethereum'
        },
        {
          value: 'ONT',
          label: 'Ontology'
        },
        {
          value: 'BNB',
          label: 'Binance'
        }
      ],
      statusOptions: {
        1: '初始化',
        3: '进行中',
        6: '已结束'
      }
    }
  },
  watch: {
    createDate(val) {
      if (isNull(val)) {
        this.search.StartDate = ''
        this.search.EndDate = ''
      } else {
        this.search.StartDate = this.toUnixTimestamp(val[0])
        this.search.EndDate = this.toUnixTimestamp(val[1])
      }
    }
  },
  created() {
    this.getList(1)
  },
  methods: {
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
        path: `/projects/detail/${id}`
      })
    },
    getList(pageIndex) {
      this.listLoading = true
      this.request({
        url: this.apis.project,
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
