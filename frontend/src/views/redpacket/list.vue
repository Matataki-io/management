<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="用户ONTID">
        <el-input v-model="search.ONTID" placeholder="请输入用户ONTID" clearable size="small"/>
      </el-form-item>
      <el-form-item label="红包状态">
        <el-select v-model="search.Status" placeholder="请选择红包状态" clearable size="small">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchList">查询</el-button>
      </el-form-item>
    </el-form>
    <RpLog :list="list" :list-loading="listLoading"/>
    <el-pagination
      :total="count"
      background
      layout="prev, pager, next"
      @current-change="handleCurrentChange"/>
  </div>
</template>

<script>
import { isNull } from '@/utils/validate'
import RpLog from './components/rpLog'
export default {
  components: {
    RpLog
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
        ONTID: '',
        Status: ''
      },
      statusOptions: [{
        value: 0,
        label: '不可开'
      }, {
        value: 1,
        label: '可开'
      }, {
        value: 2,
        label: '已开'
      }]
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
      const search = {}
      for (const item in this.search) {
        if (!isNull(this.search[item])) {
          search[item] = this.search[item]
        }
      }
      this.request({
        url: this.apis.redpacketLog,
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
