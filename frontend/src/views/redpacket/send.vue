<template>
  <div class="app-container">
    <el-card>
      <el-form ref="form" label-width="100px">
        <el-form-item label="选择红包">
          <el-select v-model="rpId" placeholder="请选择红包">
            <el-option
              v-for="item in redPacketList"
              :key="item.RedpacketId"
              :label="item.RedpacketName"
              :value="item.RedpacketId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="title">
          <el-input v-model="rpTitle" placeholder="请输入title"/>
        </el-form-item>
        <el-form-item label="手机号/ont id">
          <span class="notice">注：手机号格式：+86*13576274714 ，ont ID格式： did:ont:xxx，多个手机号/ont id换行分隔，每次最多提交500个</span>
          <el-input
            :rows="8"
            v-model="phoneList"
            type="textarea"
            placeholder="请输入手机号/ont id列表"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-row style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>二次确认</span>
          </div>
          <div v-if="allRp.length > 0">
            <el-checkbox-group v-model="checkedRp" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="rp in allRp" :label="rp" :key="rp.Id">{{ rp.phone }}</el-checkbox>
            </el-checkbox-group>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <div>
              <el-button type="primary" @click="submitRp">确认</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>未找到用户的手机号/ont id列表</span>
          </div>
          <div v-if="notFind.length > 0" class="phone-container">
            <p v-for="(item, i) in notFind" :key="i"><span class="sort-tag">{{ i+1 }}</span>{{ item }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { isNull } from '@/utils/validate'
export default {
  name: 'Send',
  data() {
    return {
      rpId: '',
      rpTitle: '',
      phoneList: '',
      notFind: [],
      allRp: [],
      checkedRp: [],
      isIndeterminate: true,
      checkAll: false
    }
  },
  computed: {
    ...mapGetters([
      'redPacketList'
    ])
  },
  created() {
    this.$store.dispatch('getRedPacket')
  },
  mounted() {
    window.addEventListener('beforeunload', function(e) {
      (e || window.event).returnValue = '确定离开此页吗？'
    })
  },
  methods: {
    submitRp() {
      if (this.allRp.length <= 0) return

      const idArr = []
      let phoneHTML = ''
      let i = 1
      for (const item of this.checkedRp) {
        phoneHTML += `<p><span class="sort-tag">${i}</span> ${item.phone}</p>`
        i++
        idArr.push(item.Id)
      }

      this.$confirm(`<div class="phone-container">${phoneHTML}</div>`, '确认提交吗？此操作风险较大, 请仔细确认!', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.request({
          url: this.apis.redpacketLog,
          method: 'put',
          data: {
            idArr: idArr,
            CreateDate: this.allRp[0].CreateDate
          }
        }).then(res => {
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
        })
      })
    },
    handleCheckAllChange(val) {
      this.checkedRp = val ? this.allRp : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.allRp.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.allRp.length
    },
    onSubmit() {
      console.log(this.phoneList)
      const phoneArr = this.phoneList.split(/\n/)
      if (phoneArr.length > 500) {
        this.$message({
          type: 'error',
          message: '每次最多提交500个!'
        })
        return
      }
      const len = phoneArr.length
      let phoneHTML = ''
      let hasError = false
      for (let i = 0; i < len; i++) {
        if (phoneArr[i].startsWith('did:ont:') || phoneArr[i].startsWith('+')) {
          phoneHTML += `<p><span class="sort-tag">${i + 1}</span> ${phoneArr[i]}</p>`
        } else {
          hasError = true
          this.$message({
            type: 'error',
            message: `手机号/ont id格式错误： ${phoneArr[i]}`
          })
        }
      }
      if (hasError) return
      this.$confirm(`<div class="phone-container">${phoneHTML}</div>`, '确认保存吗？此操作风险较大, 请仔细确认!', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.request({
          url: this.apis.redpacketLog,
          method: 'post',
          data: {
            RedpacketId: this.rpId,
            Title: this.rpTitle,
            phoneList: phoneArr
          }
        }).then(res => {
          this.notFind = res.data.notFind
          this.allRp = res.data.successCreate
          this.resetData()
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
        })
      })
    },
    resetData() {
      this.checkAll = false
      this.isIndeterminate = false
      this.checkedRp = []
    },
    fromUnixTimestamp(v) {
      return v * 1000
    },
    toUnixTimestamp(v) {
      return Math.round(v / 1000)
    }
  }
}
</script>

<style scoped>
  .notice {
    font-size: 12px;
    color: #cccccc;
  }
</style>
<style lang="scss">
  .phone-container {
    max-height: 400px;
    overflow: auto;
    .sort-tag {
      display: inline-block;
      line-height: 20px;
      text-align: center;
      width: 20px!important;
      height: 20px;
      background: #cccccc;
      border-radius: 10px;
      color: #ffffff;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    p:nth-child(odd) {
      color: green;
    }
    p:nth-child(even) {
      color: red;
    }
  }
</style>
