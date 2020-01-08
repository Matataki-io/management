<template>
  <el-form :model="projectObj" label-width="120px">
    <el-form-item v-if="!isCreate" label="项目ID" prop="ProjectId">
      <el-input v-model="projectObj.ProjectId" readonly disabled/>
    </el-form-item>

    <el-form-item label="项目Logo" prop="Logo">
      <el-input v-model="projectObj.Logo"/>
    </el-form-item>
    <el-form-item label="置顶" prop="IsTop">
      <el-switch v-model="projectObj.IsTop"/>
    </el-form-item>
    <el-form-item label="置热" prop="IsHot">
      <el-switch v-model="projectObj.IsHot"/>
    </el-form-item>

    <el-form-item label="是否可显示" prop="IsDisplay">
      <el-switch v-model="projectObj.IsDisplay"/>
    </el-form-item>

    <el-form-item label="限制国内用户提币" prop="WithdrawFlag">
      <el-switch v-model="projectObj.WithdrawFlag"/>
    </el-form-item>

    <el-form-item label="是否仅作为红包奖励" prop="IsOnlyRedpacket">
      <el-switch v-model="projectObj.IsOnlyRedpacket"/>
    </el-form-item>
    <el-form-item label="是否实时提币" prop="WithdrawIsRealTime">
      <el-switch v-model="projectObj.WithdrawIsRealTime"/>
    </el-form-item>
    <el-form-item label="排序" prop="Sort">
      <el-input-number v-model="projectObj.Sort" controls-position="right"/>
    </el-form-item>
    <el-form-item label="公链" prop="BlockChainName">
      <el-select v-model="projectObj.BlockChainName" placeholder="请选择公链">
        <el-option
          v-for="item in BlockChainNameOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
    </el-form-item>
    <el-form-item label="合约地址" prop="ContractAddress">
      <el-input v-model="projectObj.ContractAddress"/>
    </el-form-item>
    <el-form-item label="代币名称" prop="TokenName">
      <el-input v-model="projectObj.TokenName"/>
    </el-form-item>
    <el-form-item label="代币标准" prop="TokenStandard">
      <el-input v-model="projectObj.TokenStandard"/>
      <!--<el-select v-model="projectObj.TokenStandard" placeholder="请选择代币标准">
        <el-option
          v-for="item in TokenStandardOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>-->
    </el-form-item>
    <el-form-item v-if="!isCreate" label="当前已提现数量" prop="WithdrawTotalAmount">
      <el-input-number v-model="projectObj.WithdrawTotalAmount" controls-position="right" disabled/>
    </el-form-item>
    <el-form-item label="最大提现设定数量" prop="WithdrawMaxAmount">
      <el-input-number v-model="projectObj.WithdrawMaxAmount" :min="0" controls-position="right"/>
    </el-form-item>
    <el-form-item label="总奖励金额" prop="TotalAmount">
      <el-input-number v-model="projectObj.TotalAmount" controls-position="right"/>
    </el-form-item>

    <el-form-item label="已发放金额" prop="SentTotalAmount">
      <el-input-number v-model="projectObj.SentTotalAmount" controls-position="right"/>
    </el-form-item>

    <el-form-item label="每天奖励最大值" prop="DailyMaxAmount">
      <el-input-number v-model="projectObj.DailyMaxAmount" controls-position="right"/>
    </el-form-item>
    <el-form-item label="每次奖励金额" prop="OnceAmount">
      <el-input-number v-model="projectObj.OnceAmount" controls-position="right"/>
    </el-form-item>
    <el-form-item label="开始时间" prop="StartDate">
      <el-date-picker v-model="projectObj.StartDate" type="datetime" value-format="timestamp" placeholder="开始时间"/>
    </el-form-item>
    <el-form-item label="结束时间" prop="EndDate">
      <el-date-picker v-model="projectObj.EndDate" type="datetime" value-format="timestamp" placeholder="结束时间"/>
    </el-form-item>
    <el-form-item label="提现时间" prop="WithdrawTime">
      <el-date-picker v-model="projectObj.WithdrawTime" type="datetime" value-format="timestamp" placeholder="提现时间"/>
    </el-form-item>
    <el-form-item label="状态" prop="Status">
      <el-select v-model="projectObj.Status" placeholder="请选择状态">
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
    </el-form-item>
    <el-form-item label="网站" prop="Website">
      <el-input v-model="projectObj.Website"/>
    </el-form-item>
    <el-form-item label="ONTID" prop="ONTID">
      <el-input v-model="projectObj.ONTID"/>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'BaseInfo',
  props: {
    projectObj: {
      type: Object,
      default() {
        return {}
      }
    },
    isCreate: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      statusOptions: [
        {
          value: 1,
          label: '初始化'
        },
        {
          value: 3,
          label: '进行中'
        },
        {
          value: 6,
          label: '已结束'
        }
      ],
      BlockChainNameOptions: [
        {
          value: 'ETH',
          label: 'Ethereum'
        },
        {
          value: 'ONT',
          label: 'Ontology'
        },
        {
          value: 'NEO',
          label: 'NEO'
        },
        {
          value: 'BNB',
          label: 'Binance'
        }
      ],
      TokenStandardOptions: [
        {
          value: 'ERC721',
          label: 'ERC721'
        },
        {
          value: 'ERC20',
          label: 'ERC20'
        },
        {
          value: 'NEP-5',
          label: 'NEP-5'
        }
      ]
    }
  },
  computed: {
    startDate() {
      return this.projectObj.StartDate * 1000
    },
    endDate() {
      return this.projectObj.EndDate * 1000
    }
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
