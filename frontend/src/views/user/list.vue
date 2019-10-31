<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="id">
        <el-input v-model="search.id" placeholder="请输入用户ID" clearable size="small" />
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="search.username" placeholder="请输入用户名" clearable size="small" />
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="search.nickname" placeholder="请输入昵称" clearable size="small" />
      </el-form-item>
      <el-form-item label="只看推荐">
        <el-switch v-model="search.is_recommend" @change="getList(1)"></el-switch>
      </el-form-item>
      <el-form-item label="有权限发币">
        <el-switch v-model="search.isMint" @change="getList(1)"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchList">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="id" prop="id" align="center" fixed />
      <el-table-column label="用户名" prop="username" align="center" fixed />
      <el-table-column label="邮箱" prop="email" align="center" fixed />
      <el-table-column label="昵称" prop="nickname" align="center" />
      <el-table-column label="头像" width="110" align="center">
        <template slot-scope="scope">
          <img v-if="scope.row.avatar" :src="getImg(scope.row.avatar)" alt="头像" width="100px" />
        </template>
      </el-table-column>
      <el-table-column label="自我介绍" width="110" align="center" prop="introduction" />
      <el-table-column label="来源平台" width="110" align="center" prop="platform" />
      <el-table-column label="注册时间" width="110" align="center" prop="create_time" />
      <el-table-column label="最后登录时间" width="110" align="center" prop="last_login_time" />
      <el-table-column label="注册IP" width="110" align="center" prop="reg_ip" />
      <el-table-column label="最后登录IP" width="110" align="center" prop="last_login_ip" />
      <el-table-column label="种子用户" width="110" align="center">
        <template slot-scope="scope">
          <el-switch
            @change="handleChange($event, 'isSeed')"
            :value="(scope.row.status & userStatus.isSeed) === userStatus.isSeed"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="发币用户" width="110" align="center">
        <template slot-scope="scope">
          <el-switch
            @change="handleChange($event, 'isMint')"
            :value="(scope.row.status & userStatus.isMint) === userStatus.isMint"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="交易权限" width="110" align="center">
        <template slot-scope="scope">
          <el-switch
            @change="handleChange($event, 'isExchange')"
            :value="(scope.row.status & userStatus.isExchange) === userStatus.isExchange"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="toDetail(scope.row.id)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="count"
      background
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { isNull } from "@/utils/validate";
import { userStatus } from "@/utils/consts";
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      list: null,
      count: 0,
      listLoading: true,
      pageSize: 10,
      pageIndex: 1,
      search: {
        id: "",
        username: "",
        nickname: "",
        is_recommend: false,
        isMint: false
      },
      userStatus: userStatus
    };
  },
  created() {
    this.getList(1);
  },
  methods: {
    handleChange(value, type) {
      console.log(value, type);
    },
    getImg(hash) {
      return `${this.apis.imgHost}${hash}`;
    },
    fromUnixTimestamp(v) {
      return v * 1000;
    },
    toUnixTimestamp(v) {
      return Math.round(v / 1000);
    },
    searchList() {
      this.getList(1);
    },
    handleCurrentChange(v) {
      this.getList(v);
    },
    toDetail(id) {
      this.$router.push({
        path: `/user/detail/${id}`
      });
    },
    getList(pageIndex) {
      this.listLoading = true;
      const search = {};
      for (const item in this.search) {
        if (!isNull(this.search[item])) {
          if (["is_recommend", "isMint"].indexOf(item) >= 0) {
            search[item] = this.search[item] ? "1" : "";
          } else {
            search[item] = this.search[item];
          }
        }
      }
      this.request({
        url: this.apis.user,
        method: "get",
        noLoading: true,
        params: {
          pageSize: this.pageSize,
          pageIndex: pageIndex || this.pageIndex,
          ...search
        }
      }).then(res => {
        this.listLoading = false;
        this.list = res.data.rows;
        this.count = res.data.count;
      });
    }
  }
};
</script>

<style scoped>
</style>
