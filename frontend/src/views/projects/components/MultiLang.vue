<template>
  <section>
    <el-card>
      <div slot="header">
        <span>中文</span>
      </div>
      <div>
        <el-form :model="langObj.zh" label-width="120px">
          <el-form-item label="项目名称" prop="ProjectName">
            <el-input v-model="langObj.zh.ProjectName"/>
          </el-form-item>
          <el-form-item label="项目简介" prop="Brief">
            <el-input :rows="2" v-model="langObj.zh.Brief" type="textarea"/>
          </el-form-item>
          <el-form-item label="项目描述" prop="Description">
            <el-input :rows="4" v-model="langObj.zh.Description" type="textarea"/>
          </el-form-item>
          <el-form-item label="空投规则" prop="AirdropRule">
            <el-input :rows="4" v-model="langObj.zh.AirdropRule" type="textarea"/>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card style="margin-top: 20px;">
      <div slot="header">
        <span>English</span>
      </div>
      <div>
        <el-form :model="langObj.en" label-width="120px">
          <el-form-item label="Project Name" prop="ProjectName">
            <el-input v-model="langObj.en.ProjectName"/>
          </el-form-item>
          <el-form-item label="Project Brief" prop="Brief">
            <el-input :rows="2" v-model="langObj.en.Brief" type="textarea"/>
          </el-form-item>
          <el-form-item label="Project Desc" prop="Description">
            <el-input :rows="4" v-model="langObj.en.Description" type="textarea"/>
          </el-form-item>
          <el-form-item label="Airdrop Rule" prop="AirdropRule">
            <el-input :rows="4" v-model="langObj.en.AirdropRule" type="textarea"/>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card style="margin-top: 20px;">
      <div slot="header">
        <span>Korean</span>
      </div>
      <div>
        <el-form :model="langObj.ko" label-width="120px">
          <el-form-item label="Project Name" prop="ProjectName">
            <el-input v-model="langObj.ko.ProjectName"/>
          </el-form-item>
          <el-form-item label="Project Brief" prop="Brief">
            <el-input :rows="2" v-model="langObj.ko.Brief" type="textarea"/>
          </el-form-item>
          <el-form-item label="Project Desc" prop="Description">
            <el-input :rows="4" v-model="langObj.ko.Description" type="textarea"/>
          </el-form-item>
          <el-form-item label="Airdrop Rule" prop="AirdropRule">
            <el-input :rows="4" v-model="langObj.ko.AirdropRule" type="textarea"/>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </section>
</template>

<script>
export default {
  name: 'MultiLang',
  props: {
    langObj: {
      type: Object,
      default() {
        return {
          zh: {},
          en: {},
          ko: {},
        }
      }
    },
  }
}
</script>

<style scoped>

</style>
