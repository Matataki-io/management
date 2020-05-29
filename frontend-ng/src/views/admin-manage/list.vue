<template>
  <div class="admin-list">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="id" prop="id" align="center" fixed />
      <el-table-column label="用户名" prop="username" align="center" fixed />
      <el-table-column label="昵称" prop="nickname" align="center" />
    </el-table>
  </div>
</template>

<script>
export default {
  data: () => ({
    list: [],
    listLoading: true
  }),
  async mounted() {
    const result = await this.request({
      url: '/api/admin'
    })
    console.log(result)
    this.list = result.data.rows
    this.listLoading = false
  }
}
</script>
