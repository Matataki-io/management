<template>
  <el-card style="margin-top: 20px;">
    <div slot="header">
      <span>{{ title }}</span>
    </div>
    <el-table
      :data="list"
      border
      fit
      highlight-current-row>
      <el-table-column v-for="(item, i) in headers" :key="i" :label="item.label" :prop="item.prop"/>
    </el-table>
  </el-card>
</template>

<script>
export default {
  name: 'Table',
  props: {
    title: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default() {
        return []
      }
    },
    headers: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style scoped>

</style>
