<template>
  <div class="container">
    <el-table :data="list" border stripe class="table">
      <el-table-column prop="uid" label="用户ID" fixed></el-table-column>
      <el-table-column prop="introduction" label="自我介绍" width="100" ></el-table-column>
      <el-table-column prop="age" label="年龄" width="80"></el-table-column>
      <el-table-column prop="number" label="手机号码" width="110"></el-table-column>
      <el-table-column prop="career" label="职业领域" ></el-table-column>
      <el-table-column prop="field" label="创作领域" ></el-table-column>
      <el-table-column prop="platform" label="创作平台" ></el-table-column>
      <el-table-column prop="nickname" label="创作者昵称" ></el-table-column>
      <el-table-column prop="link" label="主页链接" ></el-table-column>
      <el-table-column width="260" label="是否愿意参与Fan票产品的用户访谈？">
        <template slot-scope="scope">
          {{ scope.row.interview === 0 ? '愿意' : '不愿意' }}
        </template>
      </el-table-column>
      <el-table-column prop="know" width="180" label="您如何了解到了Fan票？" ></el-table-column>
      <el-table-column prop="publish" width="180" label="为什么想要发行Fan票？" ></el-table-column>
      <el-table-column prop="info" width="170" label="您希望了解什么信息？" ></el-table-column>
      <el-table-column prop="promote" width="200" label="您会如何推广自己的Fan票？" ></el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="160">
        <template slot-scope="scope">{{ time(scope.row.create_time) }}</template>
      </el-table-column>
      <el-table-column prop="update_time" label="更新时间" width="160">
        <template slot-scope="scope">{{ time(scope.row.update_time) }}</template>
      </el-table-column>
    </el-table>
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
      list: [],
      count: 0,
      listLoading: true,
      pageSize: 10,
      pageIndex: 1,
    };
  },
  created() {
    this.getList(1);
  },
  methods: {
    time(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
    handleCurrentChange(v) {
      this.getList(v);
    },
    getList(pageIndex) {
      this.listLoading = true;
      this.request({
        url: this.apis.minetokenApplicationSurvey,
        method: "get",
        noLoading: true,
        params: {
          pageSize: this.pageSize,
          pageIndex: pageIndex || this.pageIndex,
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
</style>
