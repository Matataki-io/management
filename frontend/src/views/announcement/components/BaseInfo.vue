<template>
  <el-form :model="baseInfo" label-width="120px">
    <el-form-item label="开始时间" prop="StartDate">
      <el-date-picker
        v-model="baseInfo.StartDate"
        type="datetime"
        value-format="timestamp"
        placeholder="开始时间"
      />
    </el-form-item>
    <el-form-item label="结束时间" prop="EndDate">
      <el-date-picker
        v-model="baseInfo.EndDate"
        type="datetime"
        value-format="timestamp"
        placeholder="结束时间"
      />
    </el-form-item>

    <el-form-item label="有效" prop="IsActive">
      <el-switch v-model="baseInfo.IsActive"/>
    </el-form-item>

    <el-form-item label="有效区域">
      <template>
        <el-select v-model="baseInfo.CountryCodes" multiple collapse-tags placeholder="有效区域">
          <el-option
            v-for="item in countryCodes"
            :key="item.locale"
            :label="item.zh"
            :value="item.locale"
          />
        </el-select>
      </template>
    </el-form-item>
  </el-form>
</template>
  </el-form>
</template>

<script>
export default {
  name: 'BaseInfo',
  props: {
    baseInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    countryCodes: function() {
      return this.utils.countryCode()
    }
  },
  created: function() {
    // debugger;
  },
  methods: {}
}
</script>

<style scoped>
</style>
