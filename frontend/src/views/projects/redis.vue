<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="项目ID">
        <el-select v-model="projectId" placeholder="请选择项目">
          <el-option v-for="item in projectList" :key="item.ProjectId" :label="item.ProjectId" :value="item.ProjectId">
            <span style="float: left">id: {{ item.ProjectId }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">代币：{{ item.TokenName }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="库存量">
        <el-input-number v-model="storeVal" controls-position="right"/>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" style="margin-top: 20px;" @click="createStore">创建库存</el-button>
      </el-form-item>
    </el-form>
    <h2>库存量</h2>
    <el-table :data="storeList" border fit highlight-current-row>
      <el-table-column label="key" align="center" prop="label"/>
      <el-table-column label="库存量" align="center" prop="val"/>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="delStore(scope.row.label)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <h2>排队中用户</h2>
    <el-table :data="waitList" border fit highlight-current-row>
      <el-table-column label="key" align="center" prop="label"/>
      <el-table-column label="库存量" align="center" prop="val"/>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="delStore(scope.row.label)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <h2>订单列表</h2>
    <el-table :data="orderList" border fit highlight-current-row>
      <el-table-column label="key" align="center" prop="label"/>
      <el-table-column label="库存量" align="center" prop="val"/>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="delStore(scope.row.label)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Redis',
  data() {
    return {
      projectId: null,
      storeVal: 0, // 库存
      storeList: [],
      waitList: [],
      orderList: []
    }
  },
  computed: {
    ...mapGetters([
      'projectList'
    ])
  },
  watch: {
  },
  created() {
    this.$store.dispatch('getProjectList')
    this.getStore()
  },
  methods: {
    createStore() {
      this.request({
        url: this.apis.store,
        method: 'post',
        data: {
          projectId: this.projectId,
          val: this.storeVal
        }
      }).then(res => {
        this.$message({
          type: 'success',
          message: `库存创建成功，总库存数量：${res.data}`
        })
        this.getStore()
      })
    },
    getStore() {
      this.request({
        url: this.apis.store,
        method: 'get'
      }).then(res => {
        this.storeList = res.data.storeResult
        this.waitList = res.data.waitResult
        this.orderList = res.data.orderResult
      })
    },
    delStore(candyKey) {
      this.request({
        url: this.apis.store,
        method: 'delete',
        data: {
          candyKey
        }
      }).then(res => {
        this.$message({
          type: 'success',
          message: `删除成功`
        })
        this.getStore()
      })
    }
  }
}
</script>

<style scoped>

</style>
