<template>
  <div class="app-container">
    <el-button size="mini" type="success" @click="addRp">添加</el-button>
    <el-table v-loading="loading1" :data="redPacketList" style="width: 100%;" highlight-current-row border>
      <el-table-column prop="RedpacketId" label="RedpacketId" width="120" align="center" />
      <el-table-column prop="RedpacketName" label="红包名称" align="center" />
      <el-table-column prop="SentCount" label="SentCount" align="center" />
      <el-table-column prop="MaxCount" label="MaxCount" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="editRpType(scope.row)">编辑</el-button>
          <el-button type="text" @click="showItem(scope.row.RedpacketId)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="itemDialogVisible" title="红包列表" width="80%">
      <el-button size="mini" type="success" @click="addItem">添加</el-button>
      <el-table v-loading="loading2" :data="redPacketItemList" style="width: 100%" border highlight-current-row>
        <el-table-column prop="RedpacketId" label="RedpacketId" width="120" align="center" />
        <el-table-column prop="RedpacketItemId" label="RedpacketItemId" align="center" />
        <el-table-column prop="ItemType" label="奖励类型" align="center" />
        <el-table-column prop="Value" label="奖励内容" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.ItemType === 'Candy' ? '项目ID': scope.row.ItemType }} = {{ scope.row.Value }} </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="left">
          <template slot-scope="scope">
            <el-button size="mini" @click="editItem(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="delItem(scope.row.RedpacketItemId)">删除</el-button>
            <el-button
              v-if="scope.row.ItemType === 'Candy'"
              size="mini"
              type="primary"
              @click="showProbability(scope.row.RedpacketItemId)"
            >查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog :visible.sync="probabilityDialogVisible" title="红包概率列表" width="70%">
      <el-button size="mini" type="success" @click="addProbability">添加</el-button>
      <el-table v-loading="loading3" :data="probabilityList" style="width: 100%" border highlight-current-row>
        <el-table-column prop="RedpacketId" label="RedpacketId" align="center" width="120" />
        <el-table-column prop="RedpacketItemId" label="RedpacketItemId" align="center" />
        <el-table-column prop="Id" label="概率编号" align="center" width="100" />
        <el-table-column label="范围" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.StartValue }} ~ {{ scope.row.EndValue }}</span>
          </template>
        </el-table-column>
        <el-table-column label="概率值" align="center">
          <template slot-scope="scope">
            {{ scope.row.Probability }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="editProbability(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="delProbability(scope.row.Id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog :title="probabilityTitle" :visible.sync="editProbabilityVisible" center>
      <el-form label-width="150px">
        <el-form-item label="RedpacketId：">
          <span>{{ probability.RedpacketId }}</span>
        </el-form-item>
        <el-form-item label="RedpacketItemId：">
          <span>{{ probability.RedpacketItemId }}</span>
        </el-form-item>
        <el-form-item v-if="probability.Id" label="概率编号：">
          <span>{{ probability.Id }}</span>
        </el-form-item>
        <el-form-item label="范围">
          <el-input-number v-model="probability.StartValue" :min="0" size="small" controls-position="right" />
          <span> ~ </span>
          <el-input-number v-model="probability.EndValue" :min="0" size="small" controls-position="right" />
        </el-form-item>
        <el-form-item label="概率值">
          <el-input-number v-model="probability.Probability" :min="0" size="small" controls-position="right" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editProbabilityVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmProbability">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="itemTitle" :visible.sync="editItemVisible" center>
      <el-form label-width="150px">
        <el-form-item label="RedpacketId：">
          <span>{{ rpItem.RedpacketId }}</span>
        </el-form-item>
        <el-form-item v-if="rpItem.RedpacketItemId" label="RedpacketItemId：">
          <span>{{ rpItem.RedpacketItemId }}</span>
        </el-form-item>
        <el-form-item label="奖励类型">
          <el-select v-model="rpItem.ItemType" placeholder="请选择奖励类型">
            <el-option v-for="item in rpItemTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="奖励内容">
          <el-select v-if="rpItem.ItemType === 'Candy'" v-model="rpItem.Value" placeholder="请输入奖励内容">
            <el-option v-for="item in projectList" :key="item.ProjectId" :label="item.ProjectId" :value="item.ProjectId">
              <span style="float: left">id: {{ item.ProjectId }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">代币：{{ item.TokenName }}</span>
            </el-option>
          </el-select>
          <el-input-number
            v-else
            v-model="rpItem.Value"
            :min="0"
            controls-position="right"
            placeholder="请输入奖励内容"
          />
        </el-form-item>
      </el-form>
      <p>如果红包类型为糖果，则奖励内容为项目ID</p>
      <p>如果红包类型为体力上限，则奖励内容为体力上限数值</p>
      <span slot="footer">
        <el-button @click="editItemVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmItem">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="editTypeVisible" title="编辑红包" center>
      <el-form label-width="150px">
        <el-form-item label="RedpacketId：">
          <span>{{ rpType.RedpacketId }}</span>
        </el-form-item>
        <el-form-item label="红包名称：">
          <el-input v-model="rpType.RedpacketName" placeholder="请输入红包名称" />
        </el-form-item>
        <el-form-item label="SentCount：">
          <el-input-number
            v-model="rpType.SentCount"
            :min="0"
            controls-position="right"
            placeholder="请输入SentCount"
          />
        </el-form-item>
        <el-form-item label="MaxCount">
          <el-input-number
            v-model="rpType.MaxCount"
            :min="0"
            controls-position="right"
            placeholder="请输入MaxCount"
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editTypeVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmRpType">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="addRpVisible" title="添加红包" center>
      <el-form label-width="150px">
        <el-form-item label="红包名称：">
          <el-input v-model="rpType.RedpacketName" placeholder="请输入红包名称" />
        </el-form-item>
        <el-form-item label="SentCount：">
          <el-input-number
            v-model="rpType.SentCount"
            :min="0"
            controls-position="right"
            placeholder="请输入SentCount"
          />
        </el-form-item>
        <el-form-item label="MaxCount">
          <el-input-number
            v-model="rpType.MaxCount"
            :min="0"
            controls-position="right"
            placeholder="请输入MaxCount"
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addRpVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddRp">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { isNull } from '@/utils/validate'
export default {
  name: 'Setting',
  data() {
    return {
      itemDialogVisible: false,
      probabilityDialogVisible: false,
      editItemVisible: false,
      editProbabilityVisible: false,
      editTypeVisible: false,
      addRpVisible: false,
      rpType: {

      },
      probability: {
        // EndValue: 100,
        // Probability: 100,
        // StartValue: 1,
        // RedpacketId: 2,
        // RedpacketItemId: 3,
        // Id: 4,
        // CreateDate: 1551369600,
        // ModifyDate: 1551369600
      },
      rpItem: {
        // ItemType: "Candy",
        // Value: 1,
        // Decimals: 0,
        // RedpacketId: 2,
        // RedpacketItemId: 1,
      },
      rpItemTypeOptions: [
        /* {
          value: 'AP',
          label: '体力'
        },*/{
          value: 'Candy',
          label: '糖果'
        }, {
          value: 'MaxAP',
          label: '体力上限'
        }
      ],
      RedpacketId: null,
      RedpacketItemId: null,
      itemTitle: '',
      probabilityTitle: ''
    }
  },
  computed: {
    ...mapGetters([
      'redPacketList',
      'redPacketItemList',
      'probabilityList',
      'loading1',
      'loading2',
      'loading3',
      'projectList'
    ])
  },
  created() {
    this.$store.dispatch('getRedPacket')
    this.$store.dispatch('getProjectList')
  },
  methods: {
    addRp() {
      this.addRpVisible = true
      this.rpType = {
        RedpacketName: '',
        SentCount: '',
        MaxCount: ''
      }
    },
    confirmAddRp() {
      this.$store.dispatch('createRp', this.rpType).then(() => {
        this.$message({
          type: 'success',
          message: '添加成功!'
        })
        this.addRpVisible = false
      })
    },
    editRpType(row) {
      this.editTypeVisible = true
      this.rpType = row
    },
    confirmRpType() {
      this.$store.dispatch('updateRp', {
        requestData: this.rpType,
        id: this.rpType.RedpacketId
      }).then(() => {
        this.$message({
          type: 'success',
          message: '编辑成功!'
        })
        this.editTypeVisible = false
      })
    },
    addProbability() {
      this.probability = {
        StartValue: 0,
        EndValue: 0,
        Probability: 0,
        RedpacketId: this.RedpacketId,
        RedpacketItemId: this.RedpacketItemId
      }
      this.itemTitle = '添加红包概率'
      this.editProbabilityVisible = true
    },
    editProbability(row) {
      this.probability = row
      this.itemTitle = '编辑红包概率'
      this.editProbabilityVisible = true
    },
    delProbability(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deleteProbability', id).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    },
    addItem() {
      this.rpItem = {
        ItemType: 'Candy',
        Value: 0,
        RedpacketId: this.RedpacketId
      }
      this.itemTitle = '添加红包'
      this.editItemVisible = true
    },
    editItem(row) {
      this.rpItem = row
      this.itemTitle = '编辑红包'
      this.editItemVisible = true
    },
    confirmItem() {
      if (isNull(this.rpItem.RedpacketItemId)) {
        this.$store.dispatch('createItem', this.rpItem).then(() => {
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.editItemVisible = false
        })
      } else {
        this.$store.dispatch('updateItem', {
          requestData: this.rpItem,
          id: this.rpItem.RedpacketItemId
        }).then(() => {
          this.$message({
            type: 'success',
            message: '编辑成功!'
          })
          this.editItemVisible = false
        })
      }
    },
    confirmProbability() {
      if (isNull(this.probability.Id)) {
        this.$store.dispatch('createProbability', this.probability).then(() => {
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.editProbabilityVisible = false
        })
      } else {
        this.$store.dispatch('updateProbability', {
          requestData: this.probability,
          id: this.probability.Id
        }).then(() => {
          this.$message({
            type: 'success',
            message: '编辑成功!'
          })
          this.editProbabilityVisible = false
        })
      }
    },
    delItem(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deleteItem', id).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    },
    showItem(id) {
      this.RedpacketId = id
      this.itemDialogVisible = true
      this.$store.dispatch('getRedPacketItem', id)
    },
    showProbability(id) {
      this.RedpacketItemId = id
      this.probabilityDialogVisible = true
      this.$store.dispatch('getProbabilityList', id)
    }
  }
}
</script>

<style scoped>

</style>
