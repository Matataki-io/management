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
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <el-table :data="list" border stripe class="table">
      <el-table-column prop="uid" label="用户ID"> </el-table-column>
      <el-table-column prop="logo" label="Logo">
        <template slot-scope="scope">
          <img
            v-if="scope.row.logo"
            :src="getImg(scope.row.logo)"
            alt="Logo"
            width="30px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称"> </el-table-column>
      <el-table-column prop="symbol" label="缩写"> </el-table-column>
      <el-table-column prop="tag" label="标签"> </el-table-column>
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
      <el-table-column label="操作" width="210">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">同意申请</span>
          <span v-else-if="scope.row.status === 1">暂未提交</span>
          <span v-else-if="scope.row.status === 2">
            <el-button
              type="primary"
              size="small"
              @click="modify(scope.row.uid, 'agree')"
              >同意</el-button
            >
            <el-button
              type="primary"
              size="small"
              @click="modify(scope.row.uid, 'reject')"
              >拒绝</el-button
            >
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
              <el-button icon="el-icon-search" circle @click="viewSurvey(scope.row.uid)"></el-button>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="调研表单" :visible.sync="dialogTableVisible">
      <el-form ref="form" :model="surveyData" label-width="80px">
        <el-form-item label="用户ID">{{surveyData.uid}}</el-form-item>
        <el-form-item label="自我介绍">{{surveyData.introduction}}</el-form-item>
        <el-form-item label="年龄">{{surveyData.age}}</el-form-item>
        <el-form-item label="手机号码">{{surveyData.number}}</el-form-item>
        <el-form-item label="职业领域">{{surveyData.career}}</el-form-item>
        <el-form-item label="领域">{{surveyData.field}}</el-form-item>
        <el-form-item label="平台">{{surveyData.platform}}</el-form-item>
        <el-form-item label="昵称">{{surveyData.nickname}}</el-form-item>
        <el-form-item label="链接">{{surveyData.link}}</el-form-item>
        <el-form-item label="是否愿意参与Fan票产品的用户访谈？" label-width="260px" >{{surveyData.interview === 0 ? '愿意' : '不愿意'}}</el-form-item>
        <el-form-item label="您如何了解到了Fan票？" label-width="170px">{{surveyData.know}}</el-form-item>
        <el-form-item label="为什么想要发行Fan票？" label-width="170px">{{surveyData.publish}}</el-form-item>
        <el-form-item label="您希望了解什么信息？" label-width="170px">{{surveyData.info}}</el-form-item>
        <el-form-item label="您会如何推广自己的Fan票？" label-width="200px">{{surveyData.promote}}</el-form-item>
        <el-form-item label="创建时间">{{time(surveyData.create_time)}}</el-form-item>
        <el-form-item label="更新时间">{{time(surveyData.create_time)}}</el-form-item>
      </el-form>
    </el-dialog>

    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :total="count"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {
      dialogTableVisible: false,
      surveyData: [],
      list: [],
      count: 0,
      currentPage: 1,
      listLoading: true,
      pageSize: 10,
      pageIndex: 1,
      options: [
        {
          value: "update_time",
          label: "更新时间"
        },
        {
          value: "status",
          label: "需要审核"
        }
      ],
      sort: "status"
    };
  },
  created() {
    this.getList(1);
  },
  methods: {
    getImg(hash) {
      return `${this.apis.imgHost}${hash}`;
    },
    time(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
    handleCurrentChange(v) {
      this.currentPage = v;
      this.getList(v);
    },
    getList(pageIndex) {
      this.listLoading = true;
      this.request({
        url: this.apis.minetokenApplication,
        method: "get",
        noLoading: true,
        params: {
          pageSize: this.pageSize,
          pageIndex: pageIndex || this.pageIndex,
          sort: this.sort
        }
      })
        .then(res => {
          this.listLoading = false;
          this.list = res.data.list;
          this.count = res.data.count;
          // console.log("res", res);
        })
        .catch(error => {
          if (error.response.status === 401) {
            console.log("登录超时");
            this.$store.dispatch("FedLogOut").then(() => {
              location.reload(); // 为了重新实例化vue-router对象 避免bug
            });
          }
        });
    },
    modify(uid, type) {
      this.request({
        url: this.apis.minetokenApplication,
        method: "post",
        data: {
          uid: uid,
          type: type
        }
      })
        .then(res => {
          // console.log("res", res);
          if (res.code === 0) {
            this.$message.success("操作成功");
            this.getList(this.currentPage);
          } else {
            this.$message.error("操作失败");
          }
        })
        .catch(error => {
          console.log("error", error);
          this.$message.error("操作错误");
        });
    },
    changeSort(val) {
      this.sort = val;
      this.getList(this.currentPage);
    },
    viewSurvey(uid) {
      if (!uid) return
      this.request({
        url: this.apis.minetokenApplicationSurvey + `/${uid}`,
        method: "get",
      })
        .then(res => {
          if (res.code === 0 && res.data) {
            this.surveyData = res.data
            this.dialogTableVisible = true
          } else {
            this.$message.info('暂无表单')
          }
        })
        .catch(error => {
          console.log('error', error)
          this.$message.info('发生错误')
        });
    }
  }
};
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
</style>
