<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="50"
      />
      <el-table-column
        prop="sender"
        label="发件人"
        width="180"
      />
      <el-table-column
        prop="title"
        label="标题"
        width="240"
      />
      <el-table-column
        prop="content"
        label="正文"
      />
      <el-table-column
        prop="create_time"
        label="发送时间"
        width="200"
      />
      <el-table-column
        prop="remark"
        label="引用文章ID"
        width="100"
      />
      <el-table-column label="引用文章封面" width="120" align="center">
        <template slot-scope="scope">
          <img v-if="scope.row.cover" :src="getImg(scope.row.cover)" alt="封面" width="100px">
        </template>
      </el-table-column>
      <el-table-column
        prop="post_title"
        label="引用文章标题"
      />
    </el-table>
    <div class="pagination">
      <el-pagination
        :total="count"
        :page-size="pageSize"
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
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
    },
    dateFilter(val) {
      return moment(val).format('YYYY-MM-DD HH:mm')
    }
  },
  data() {
    return {
      list: null,
      count: 0,
      listLoading: true,
      pageSize: 10,
      pageIndex: 1
    }
  },
  computed: {
  },
  watch: {},
  created() {
    this.getList(1)
  },
  methods: {
    getList(pageIndex) {
      this.listLoading = true
      this.request({
        url: this.apis.announcement,
        method: 'get',
        noLoading: true,
        params: {
          pageSize: this.pageSize,
          pageIndex: pageIndex || this.pageIndex
        }
      }).then(res => {
        this.listLoading = false
        this.list = res.data.list
        this.count = res.data.count
        console.log(this.count, res.data)
      })
    },
    getImg(hash) {
      return `${this.apis.imgHost}${hash}`
    },
    handleCurrentChange(v) {
      this.getList(v)
    }
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
</style>
