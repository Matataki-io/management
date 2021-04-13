<template>
  <div class="container">
    <div class="head">
      <div class="sort">
        <span>排序: </span>
        <el-select
          v-model="sort"
          placeholder="请选择"
          size="small"
          @change="changeSort"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
    <el-table :data="list" border stripe class="table">
      <el-table-column prop="uid" label="用户ID" width="100" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="logo" label="Logo" width="80">
        <template slot-scope="scope">
          <img
            v-if="scope.row.logo"
            :src="getImg(scope.row.logo)"
            alt="Logo"
            width="30px"
          >
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="symbol" label="缩写" />
      <el-table-column prop="brief" label="简介" />
      <el-table-column prop="tag" label="标签" />
      <el-table-column prop="create_time" label="创建时间" width="160">
        <template slot-scope="scope">
          {{ time(scope.row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column prop="update_time" label="更新时间" width="160">
        <template slot-scope="scope">
          {{ time(scope.row.update_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="230">
        <template slot-scope="scope">
          <span v-if="scope.row.queue === 1">已同意,等待系统处理</span>
          <span v-else-if="scope.row.status === 0">同意申请</span>
          <span v-else-if="scope.row.status === 1">暂未提交</span>
          <span v-else-if="scope.row.status === 2">
            <el-button
              type="primary"
              size="small"
              @click="agree(scope.row.uid)"
            >同意</el-button>
            <el-button
              type="primary"
              size="small"
              @click="reject(scope.row)"
            >拒绝</el-button>
          </span>
          <span v-else-if="scope.row.status === 3">拒绝申请</span>
          <span v-else>其他</span>
          <span style="padding-left: 10px;">
            <el-tooltip
              class="item"
              effect="dark"
              content="查看调研表单"
              placement="top"
            >
              <el-button
                icon="el-icon-search"
                circle
                @click="viewSurvey(scope.row.uid)"
              />
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="调研表单" :visible.sync="dialogTableVisibleSurvey">
      <ul class="survey-list">
        <li>
          <section class="item-title w80">用户ID</section>
          <section class="item-text">{{ surveyData.uid }}</section>
        </li>
        <li>
          <section class="item-title w80">自我介绍</section>
          <section class="item-text">{{ surveyData.introduction }}</section>
        </li>
        <li>
          <section class="item-title w80">年龄</section>
          <section class="item-text">{{ surveyData.age }}</section>
        </li>
        <li>
          <section class="item-title w80">手机号码</section>
          <section class="item-text">{{ surveyData.number }}</section>
        </li>
        <li>
          <section class="item-title w80">职业领域</section>
          <section class="item-text">{{ surveyData.career }}</section>
        </li>
        <li>
          <section class="item-title w80">创作领域</section>
          <section class="item-text">{{ surveyData.field }}</section>
        </li>
        <li>
          <section class="item-title w80">创作平台</section>
          <section class="item-text">{{ surveyData.platform }}</section>
        </li>
        <li>
          <section class="item-title w80">创作者昵称</section>
          <section class="item-text">{{ surveyData.nickname }}</section>
        </li>
        <li>
          <section class="item-title w80">主页链接</section>
          <section class="item-text">{{ surveyData.link }}</section>
        </li>
        <li>
          <section class="item-title">
            是否愿意参与Fan票产品的用户访谈？
          </section>
          <section class="item-text">
            {{ surveyData.interview === 0 ? "愿意" : "不愿意" }}
          </section>
        </li>
        <li>
          <section class="item-title w180">您如何了解到了Fan票？</section>
          <section class="item-text">{{ surveyData.know }}</section>
        </li>
        <li>
          <section class="item-title w180">为什么想要发行Fan票？</section>
          <section class="item-text">{{ surveyData.publish }}</section>
        </li>
        <li>
          <section class="item-title w180">您希望了解什么信息？</section>
          <section class="item-text">{{ surveyData.info }}</section>
        </li>
        <li>
          <section class="item-title w210">您会如何推广自己的Fan票？</section>
          <section class="item-text">{{ surveyData.promote }}</section>
        </li>
        <li>
          <section class="item-title">创建时间</section>
          <section class="item-text">{{ surveyData.create_time }}</section>
        </li>
        <li>
          <section class="item-title">更新时间</section>
          <section class="item-text">{{ surveyData.update_time }}</section>
        </li>
      </ul>
    </el-dialog>

    <el-dialog title="拒绝理由" :visible.sync="dialogTableVisibleReason">
      <div class="reason">
        <span>常用理由: </span>
        <ol>
          <li
            v-for="(item, index) in reasonList"
            :key="index"
            @click="setReason(item)"
          >
            {{ item }}
          </li>
        </ol>
      </div>
      <el-input
        v-model="reasonValue"
        type="textarea"
        :rows="6"
        placeholder="请输入内容"
      />
      <el-button
        v-loading="dialogTableVisibleReason && dialogTableVisibleReasonLoading"
        type="primary"
        style="margin-top: 20px;"
        @click="rejectButton"
      >确定</el-button>
    </el-dialog>

    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="count"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  data() {
    return {
      dialogTableVisibleSurvey: false,
      dialogTableVisibleReason: false,
      dialogTableVisibleReasonLoading: false,
      reasonValue: '',
      reasonList: [
        '不能包含主流币种名称',
        '不能包含违法乱纪信息',
        '不能包含敏感词汇',
        '不能包含反动信息',
        '不能包含黄赌毒信息',
        '不能包含小广告信息',
        '不能包含不健康的内容',
        '不能使用特殊字符次',
        '请完善信息',
        '请认真填写内容'
      ],
      currentUserInfo: null,
      surveyData: [],
      list: [],
      count: 0,
      currentPage: 1,
      listLoading: true,
      pageSize: 10,
      pageIndex: 1,
      options: [
        {
          value: 'update_time',
          label: '更新时间'
        },
        {
          value: 'status',
          label: '需要审核'
        }
      ],
      sort: 'status'
    }
  },
  created() {
    this.getList(1)
  },
  methods: {
    getImg(hash) {
      return `${this.apis.imgHost}${hash}`
    },
    time(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    handleCurrentChange(v) {
      this.currentPage = v
      this.getList(v)
    },
    getList(pageIndex) {
      this.listLoading = true
      this.request({
        url: this.apis.minetokenApplication,
        method: 'get',
        noLoading: true,
        params: {
          pageSize: this.pageSize,
          pageIndex: pageIndex || this.pageIndex,
          sort: this.sort
        }
      })
        .then(res => {
          this.listLoading = false
          this.list = res.data.list
          this.count = res.data.count
          // console.log("res", res);
        })
        .catch(error => {
          if (error.response.status === 401) {
            console.log('登录超时')
            this.$store.dispatch('FedLogOut').then(() => {
              location.reload() // 为了重新实例化vue-router对象 避免bug
            })
          }
        })
    },
    reject(data) {
      this.currentUserInfo = data
      this.dialogTableVisibleReason = true
    },
    rejectButton() {
      if (this.reasonValue.trim()) {
        this.modify(this.currentUserInfo.uid, 'reject')
      } else {
        this.$message.error('请输入内容')
      }
    },
    modify(uid, type) {
      const data = {
        uid: uid,
        type: type
      }

      // 拒绝理由
      if (type === 'reject') {
        data.reason = this.reasonValue
        this.dialogTableVisibleReasonLoading = true
      }

      this.request({
        url: this.apis.minetokenApplication,
        method: 'post',
        data: data
      })
        .then(res => {
          // console.log("res", res);
          if (res.code === 0) {
            this.$message.success('操作成功')
            this.getList(this.currentPage)
          } else {
            this.$message.error('操作失败')
          }
        })
        .catch(error => {
          console.log('error', error)
          this.$message.error('操作错误')
        })
        .finally(() => {
          // 拒绝理由
          if (type === 'reject') {
            this.dialogTableVisibleReasonLoading = false
            this.dialogTableVisibleReason = false
          }
        })
    },
    // 同意申请
    async agree(uid) {
      try {
        const data = {
          uid: uid
        }
        const res = await this.request({
          url: this.apis.minetokenApplicationAgree,
          method: 'post',
          data: data
        })
        console.log('res', res)
        if (res.code === 0) {
          this.$message.success('操作成功')
          this.getList(this.currentPage)
        } else {
          throw new Error('操作失败')
        }
      } catch (e) {
        console.log('error', e)
        this.$message.error('操作错误')
      }
    },
    changeSort(val) {
      this.sort = val
      this.getList(this.currentPage)
    },
    viewSurvey(uid) {
      if (!uid) return
      this.request({
        url: this.apis.minetokenApplicationSurvey + `/${uid}`,
        method: 'get'
      })
        .then(res => {
          if (res.code === 0 && res.data) {
            this.surveyData = res.data
            this.dialogTableVisibleSurvey = true
          } else {
            this.$message.info('暂无表单')
          }
        })
        .catch(error => {
          console.log('error', error)
          this.$message.info('发生错误')
        })
    },
    setReason(item) {
      const list = this.reasonValue.split('\n')
      this.reasonValue += `${list.length}. ${item}\n`
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
  box-sizing: border-box;
}
.table {
  width: 100%;
}
.pagination {
  margin-top: 20px;
  text-align: center;
}
.head {
  margin: 0 0 20px 0;
  &::after {
    content: "";
    display: block;
    width: 0;
    height: 0;
    clear: both;
  }
}
.sort {
  display: flex;
  align-items: center;
  span {
    color: #333;
    font-size: 14px;
    margin-right: 8px;
    font-weight: bold;
  }
  float: right;
}

.reason {
  span {
    font-size: 14px;
  }

  ol {
    li {
      margin: 10px 0;
      cursor: pointer;
    }
  }
}

.survey-list {
  padding: 0;
  margin: 0;
  list-style: none;
  li {
    padding: 0;
    margin: 14px 0;
    display: flex;
    .item-title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
      margin: 0 20px 0 0;
      &.w80 {
        flex: 0 0 80px;
      }
      &.w180 {
        flex: 0 0 180px;
      }
      &.w210 {
        flex: 0 0 210px;
      }
    }
    .item-text {
      font-size: 16px;
      color: #606266;
    }
  }
}
</style>
