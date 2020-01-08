<template>
  <div class="app-container">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基础信息" name="1">
        <BaseInfo :project-obj="projectObj" :is-create="true"/>
      </el-collapse-item>
      <el-collapse-item title="多语言设置" name="2">
        <MultiLang :lang-obj="langObj"/>
      </el-collapse-item>
      <el-collapse-item title="社交媒体" name="3">
        <SocialMedia :social-media="socialMedia"/>
      </el-collapse-item>
    </el-collapse>
    <el-button type="primary" style="margin-top: 20px;" @click="createProject">创建项目</el-button>
  </div>
</template>

<script>
import BaseInfo from './components/BaseInfo'
import MultiLang from './components/MultiLang'
import SocialMedia from './components/SocialMedia'
export default {
  name: 'Create',
  components: {
    BaseInfo,
    MultiLang,
    SocialMedia
  },
  data() {
    return {
      projectObj: {
        Logo: '',
        BlockChainName: '',
        TokenName: '',
        TokenStandard: '',
        ONTID: '',
        ContractAddress: '',
        StartDate: Date.parse(new Date()),
        EndDate: Date.parse(new Date()),
        IsTop: false,
        IsHot: false,
        Sort: 1,
        Status: 1,
        TotalAmount: 0,
        DailyMaxAmount: 0,
        OnceAmount: 0,
        Website: '',
        WithdrawIsRealTime: false,
        WithdrawFlag: false
      },
      socialMedia: [{
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
      }],
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
      activeNames: ['1', '2', '3'],
      projectId: null
    }
  },
  mounted() {
  },
  methods: {
    fromUnixTimestamp(v) {
      return v * 1000
    },
    toUnixTimestamp(v) {
      return Math.round(v / 1000)
    },
    createProject() {
      const StartDate = this.toUnixTimestamp(this.projectObj.StartDate)
      const EndDate = this.toUnixTimestamp(this.projectObj.EndDate)
      const WithdrawTime = this.toUnixTimestamp(this.projectObj.WithdrawTime)
      const requestData = {
        projectObj: { ...this.projectObj, StartDate, EndDate, WithdrawTime },
        socialMedia: this.socialMedia,
        projectMultiLang: [{ Language: 'zh-Hans', ...this.langObj.zh }, { Language: 'en', ...this.langObj.en }, { Language: 'ko', ...this.langObj.ko }]
      }
      this.request({
        url: this.apis.project,
        method: 'post',
        data: requestData
      }).then(res => {
        this.$message({
          type: 'success',
          message: '创建成功!'
        })
        const id = res.data.projectObj.ProjectId
        this.$router.push({
          path: `/projects/detail/${id}`
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
