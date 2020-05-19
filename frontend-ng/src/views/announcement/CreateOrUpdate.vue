<template>
  <div class="app-container">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基础信息" name="1">
        <BaseInfo :base-info="baseInfo" :is-create="true" />
      </el-collapse-item>
      <el-collapse-item title="多语言设置" name="2">
        <MultiLang :lang-obj="langObj" />
      </el-collapse-item>
    </el-collapse>
    <el-button
      type="primary"
      style="margin-top: 20px;"
      @click="id?update(): create()"
    >{{ id?"更新公告":"创建公告" }}</el-button>
  </div>
</template>

<script>
import BaseInfo from './components/BaseInfo'
import MultiLang from './components/MultiLang'
export default {
  name: 'Create',
  components: {
    BaseInfo,
    MultiLang
  },
  data() {
    return {
      id: null,
      baseInfo: {
        CountryCodes: [],
        StartDate: Date.parse(new Date()),
        EndDate: Date.parse(new Date()),
        IsActive: true,
        Sort: 1
      },
      langObj: {
        zh: {
          AirdropRule: '',
          Brief: '',
          Description: '',
          Language: 'zh-Hans',
          ProjectName: ''
        },
        en: {
          AirdropRule: '',
          Brief: '',
          Description: '',
          Language: 'en',
          ProjectName: ''
        },
        ko: {
          AirdropRule: '',
          Brief: '',
          Description: '',
          Language: 'ko',
          ProjectName: ''
        }
      },
      activeNames: ['1', '2', '3']
    }
  },
  mounted() {
    this.id = this.$route.params.id
    if (this.id) {
      this.loadDetail()
    }
  },
  methods: {
    loadDetail() {
      this.request({
        url: `${this.apis.announcement}/${this.id}`,
        method: 'get'
      }).then(res => {
        const baseInfo = {}
        if (!res.data.baseInfo.CountryCodes) {
          baseInfo.CountryCodes = []
        } else {
          if (typeof res.data.baseInfo.CountryCodes === 'object') {
            baseInfo.CountryCodes = res.data.baseInfo.CountryCodes
          } else {
            baseInfo.CountryCodes = JSON.parse(res.data.baseInfo.CountryCodes)
          }
        }

        baseInfo.IsActive = res.data.baseInfo.IsActive
        baseInfo.StartDate = new Date(res.data.baseInfo.Start)
        baseInfo.EndDate = new Date(res.data.baseInfo.End)

        this.baseInfo = baseInfo

        for (const item of res.data.contents) {
          if (item.Language === 'zh-Hans') {
            this.langObj.zh = item
          }
          if (item.Language === 'en') {
            this.langObj.en = item
          }
          if (item.Language === 'ko') {
            this.langObj.ko = item
          }
        }
      })
    },
    update() {
      this.request({
        url: `${this.apis.announcement}/${this.id}`,
        method: 'put',
        data: this.getRequestObj()
      }).then(res => {
        this.$message({
          type: 'success',
          message: '更新成功!'
        })
        this.$router.push({
          path: `/announcement/list`
        })
      })
    },
    create() {
      this.request({
        url: this.apis.announcement,
        method: 'post',
        data: this.getRequestObj()
      }).then(res => {
        this.$message({
          type: 'success',
          message: '创建成功!'
        })

        // const id = res.data.baseInfo.id
        this.$router.push({
          path: `/announcement/list`
        })
      })
    },
    getRequestObj() {
      const StartDate = new Date(this.baseInfo.StartDate).toISOString()
      const EndDate = new Date(this.baseInfo.EndDate).toISOString()

      const requestData = {
        baseInfo: {
          Id: this.id,
          StartDate,
          EndDate,
          IsActive: this.baseInfo.IsActive,
          CountryCodes: this.baseInfo.CountryCodes
        },
        contents: [
          { Language: 'zh-Hans', ...this.langObj.zh },
          { Language: 'en', ...this.langObj.en },
          { Language: 'ko', ...this.langObj.ko }
        ]
      }

      return requestData
    }
  }
}
</script>

<style scoped>
</style>
