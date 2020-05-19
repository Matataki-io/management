<template>
  <div class="app-container">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基础信息" name="1">
        <BaseInfo :project-obj="projectObj" />
      </el-collapse-item>
      <el-collapse-item title="多语言设置" name="2">
        <MultiLang :lang-obj="langObj" />
      </el-collapse-item>
      <el-collapse-item title="社交媒体" name="3">
        <SocialMedia :social-media="socialMedia" />
      </el-collapse-item>
    </el-collapse>
    <el-button type="primary" style="margin-top: 20px;" @click="updateDetail">提交</el-button>
  </div>
</template>

<script>
import { isNull } from '@/utils/validate'
import BaseInfo from './components/BaseInfo'
import MultiLang from './components/MultiLang'
import SocialMedia from './components/SocialMedia'
export default {
  name: 'Detail',
  components: {
    BaseInfo,
    MultiLang,
    SocialMedia
  },
  data() {
    return {
      projectObj: {},
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
        zh: {},
        en: {},
        ko: {}
      },
      activeNames: ['1', '2', '3'],
      projectId: null
    }
  },
  mounted() {
    const projectId = this.$route.params.id
    if (!isNull(projectId)) {
      this.projectId = projectId
      this.getDetail(projectId)
    }
  },
  methods: {
    fromUnixTimestamp(v) {
      return v * 1000
    },
    toUnixTimestamp(v) {
      return Math.round(v / 1000)
    },
    getDetail(id) {
      this.request({
        url: `${this.apis.project}/${id}`,
        method: 'get'
      }).then(res => {
        const projectObj = res.data.projectObj
        projectObj.StartDate = this.fromUnixTimestamp(projectObj.StartDate)
        projectObj.EndDate = this.fromUnixTimestamp(projectObj.EndDate)
        projectObj.WithdrawTime = this.fromUnixTimestamp(projectObj.WithdrawTime)
        this.projectObj = projectObj
        for (const item of res.data.projectMultiLang) {
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
        const socialMediaObj = {
          'White paper': {
            checked: false,
            SocialMediaName: 'White paper',
            Url: ''
          },
          'Facebook': {
            checked: false,
            SocialMediaName: 'Facebook',
            Url: ''
          },
          'Telegram': {
            checked: false,
            SocialMediaName: 'Telegram',
            Url: ''
          },
          'Twitter': {
            checked: false,
            SocialMediaName: 'Twitter',
            Url: ''
          }
        }
        for (const item of res.data.socialMedia) {
          socialMediaObj[item.SocialMediaName] = {
            ...socialMediaObj[item.SocialMediaName],
            ...item
          }
          socialMediaObj[item.SocialMediaName].checked = true
        }
        const socialMediaArr = []
        for (const i in socialMediaObj) {
          socialMediaArr.push(socialMediaObj[i])
        }
        this.socialMedia = socialMediaArr
      })
    },
    updateDetail() {
      const StartDate = this.toUnixTimestamp(this.projectObj.StartDate)
      const EndDate = this.toUnixTimestamp(this.projectObj.EndDate)
      const WithdrawTime = this.toUnixTimestamp(this.projectObj.WithdrawTime)
      const requestData = {
        projectObj: { ...this.projectObj, StartDate, EndDate, WithdrawTime },
        socialMedia: this.socialMedia,
        projectMultiLang: [{ Language: 'zh-Hans', ...this.langObj.zh }, { Language: 'en', ...this.langObj.en }, { Language: 'ko', ...this.langObj.ko }]
      }
      this.request({
        url: `${this.apis.project}/${this.projectId}`,
        method: 'put',
        data: requestData
      }).then(res => {
        this.$message({
          type: 'success',
          message: '更新成功!'
        })
        this.getDetail(this.projectId)
      })
    }
  }
}
</script>

<style scoped>

</style>
