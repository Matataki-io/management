<template>
  <el-table
    v-loading="listLoading"
    :data="list"
    element-loading-text="Loading"
    border
    fit
    highlight-current-row
  >
    <el-table-column label="ID" prop="Id" />
    <el-table-column label="用户ONTID" prop="ONTID" />
    <el-table-column label="红包ID" prop="RedpacketId" />
    <el-table-column label="红包标题">
      <template slot-scope="scope">
        <span>{{ scope.row.Title === 'newuser' ? '新手红包' : scope.row.Title }}</span>
      </template>
    </el-table-column>
    <el-table-column label="红包状态" prop="Status">
      <template slot-scope="scope">
        <span>{{ statusOptions[scope.row.Status].label }}</span>
      </template>
    </el-table-column>
    <el-table-column label="红包获取时间" prop="CreateDate" />
    <el-table-column label="开红包时间" prop="OpenDate" />
    <el-table-column label="奖励" prop="Rewards" />
  </el-table>
</template>

<script>
export default {
  name: 'RpLog',
  props: {
    listLoading: {
      type: Boolean,
      default() {
        return false
      }
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
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
  }
}
</script>

<style scoped>

</style>
