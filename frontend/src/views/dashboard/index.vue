<template>
  <div class="dashboard-container">
    <div class="dashboard-text">Welcome to Matataki Management System!</div>
    <!-- <PanelGroup :d="panelData"/>
    <line-chart :chart-data="dayCertLit" title="每日认证数量"/>
    <line-chart :chart-data="dayRegisterList" title="每日注册数量"/>
    <Table :list="dayValidRpAmountList" :headers="dayValidRpAmountListHeaders" title="每日有效红包数量"/>
    <Table :list="daySentTokenAmountList" :headers="daySentTokenAmountListHeaders" title="每日发放糖果量"/>
    <Table :list="allSentTokenAmountList" :headers="allSentTokenAmountListHeaders" title="总共发放糖果量"/>
    <Table :list="userGetAmountGt5000List" :headers="userGetAmountGt5000Headers" title="每天领取数量大于5000的用户"/>
    <Table :list="userGetTokenGt1List" :headers="userGetTokenGt1ListHeaders" title="每天领取次数大于1次的用户"/> -->
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import Table from './components/Table'

export default {
  name: 'Dashboard',
  components: {
    PanelGroup,
    LineChart,
    Table
  },
  data() {
    return {
      userGetTokenGt1ListHeaders: [{ label: 'ONTID', prop: 'ONTID' }, { label: '日期', prop: 'Date' }, { label: '数量', prop: 'Count' }],
      userGetAmountGt5000Headers: [{ label: 'ONTID', prop: 'ONTID' }, { label: '日期', prop: 'Date' }, { label: '数量', prop: 'Amount' }],
      allSentTokenAmountListHeaders: [{ label: 'ProjectId', prop: 'ProjectId' }, { label: 'TokenName', prop: 'TokenName' }, { label: '数量', prop: 'TotalAmount' }],
      daySentTokenAmountListHeaders: [{ label: 'ProjectId', prop: 'ProjectId' }, { label: 'TokenName', prop: 'TokenName' }, { label: '日期', prop: 'Date' }, { label: '数量', prop: 'Amount' }],
      dayValidRpAmountListHeaders: [{ label: 'RedpacketId', prop: 'RedpacketId' }, { label: '红包名', prop: 'RedpacketName' }, { label: '日期', prop: 'Date' }, { label: '数量', prop: 'Count' }],
      userGetTokenGt1List: [],
      userGetAmountGt5000List: [],
      daySentTokenAmountList: [],
      allSentTokenAmountList: [],
      dayValidRpAmountList: [],
      dayRegisterList: [],
      dayCertLit: [],
      panelData: {
        allRegisterCount: 0,
        allValidRpCount: 0,
        allCertCount: 0
      }
    }
  },
  created() {
    // this.dashboard()
  },
  methods: {
    dashboard() {
      this.request({
        url: this.apis.dashboard,
        method: 'get'
      }).then(res => {
        const data = res.data
        // 监控每天领取次数大于1次的用户
        this.userGetTokenGt1List = data.userGetTokenGt1List
        // 监控每天领取数量大于5000的用户
        this.userGetAmountGt5000List = data.userGetAmountGt5000List
        // 每日发放糖果量
        this.daySentTokenAmountList = data.daySentTokenAmountList
        // 总共发放糖果量
        this.allSentTokenAmountList = data.allSentTokenAmountList
        // 每日有效红包数量
        this.dayValidRpAmountList = data.dayValidRpAmountList
        // 总有效红包数量
        this.panelData.allValidRpCount = data.allValidRpCount.length > 0 ? data.allValidRpCount[0].Count : 0
        // 每日注册量
        this.dayRegisterList = data.dayRegisterList
        // 总注册量
        this.panelData.allRegisterCount = data.allRegisterCount.length > 0 ? data.allRegisterCount[0].Count : 0
        // 每日认证数量
        this.dayCertLit = data.dayCertLit
        // 总认证数量
        this.panelData.allCertCount = data.allCertCount.length > 0 ? data.allCertCount[0].Count : 0

        console.log(res)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
