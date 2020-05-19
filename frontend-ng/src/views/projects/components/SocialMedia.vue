<template>
  <el-table :data="socialMedia">
    <el-table-column label="社交媒体名称" width="150">
      <template slot-scope="scope">
        <el-checkbox v-model="scope.row.checked">{{ scope.row.SocialMediaName }}</el-checkbox>
      </template>
    </el-table-column>
    <el-table-column label="地址">
      <template slot-scope="scope">
        <el-input v-model="scope.row.Url" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'SocialMedia',
  props: {
    socialMedia: {
      type: Array,
      default() {
        return [{
          checked: false,
          SocialMediaName: 'White paper',
          Url: ''
        }, {
          checked: false,
          SocialMediaName: 'Facebook',
          Url: ''
        }, {
          checked: false,
          SocialMediaName: 'Telegram',
          Url: ''
        }, {
          checked: false,
          SocialMediaName: 'Twitter',
          Url: ''
        }]
      }
    }
  }
}
</script>

<style scoped>

</style>
