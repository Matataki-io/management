<template>
  <section>
    <el-card>
      <div slot="header">
        <span>中文</span>
      </div>
      <div>
        <el-form :model="langObj.zh" label-width="120px">
          <el-form-item label="内容" prop="Content">
            <el-input v-model="langObj.zh.Content" :rows="3" type="textarea"/>
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
          <el-form-item label="Content" prop="Content">
            <el-input v-model="langObj.en.Content" :rows="3" type="textarea"/>
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
          <el-form-item label="Content" prop="Content">
            <el-input v-model="langObj.ko.Content" :rows="3" type="textarea"/>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </section>
</template>

<script>
export default {
  name: "MultiLang",
  props: {
    langObj: {
      type: Object,
      default() {
        return {
          zh: {},
          en: {},
          ko: {}
        };
      }
    }
  }
};
</script>

<style scoped>
</style>
