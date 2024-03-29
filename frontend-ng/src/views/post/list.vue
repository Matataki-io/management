<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="id">
        <el-input v-model="search.id" placeholder="请输入文章ID" clearable size="small" />
      </el-form-item>
      <el-form-item label="文章标题">
        <el-input v-model="search.title" placeholder="请输入文章标题" clearable size="small" />
      </el-form-item>
      <el-form-item label="作者">
        <el-input v-model="search.author" placeholder="请输入作者Id/昵称/账号" clearable size="small" />
      </el-form-item>
      <el-form-item label="只看推荐">
        <el-switch v-model="search.is_recommend" @change="getList(1)" />
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
      <el-table-column label="文章ID" prop="id" align="center" fixed width="100">
        <template slot-scope="scope">
          <el-link :href="getMatatakiArticleUrl(scope.row.id)" target="_blank" type="primary">{{ scope.row.id }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="文章标题" prop="title" align="center" fixed />
      <el-table-column label="封面" align="center" width="100">
        <template slot-scope="scope">
          <img v-if="scope.row.cover" :src="getImg(scope.row.cover)" alt="封面" width="100%">
        </template>
      </el-table-column>
      <el-table-column label="作者" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname || scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="摘要" prop="short_content" align="center" width="300">
        <template slot-scope="scope">
          {{ scope.row.short_content.slice(0, 50) + '...' }}
        </template>
      </el-table-column>

      <el-table-column label="发布时间" prop="create_time" width="105" align="center">
        <template slot-scope="scope">
          <span :title="new Date(scope.row.create_time).toLocaleString()">
            {{ formatToRelativeTime(scope.row.create_time) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="是否原创" prop="is_original" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.is_original ? "是" : "否" }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="是否被推荐" prop="is_recommend" align="center" /> -->
      <!-- <el-table-column label="评论需要支付的积分" prop="comment_pay_point" align="center" /> -->
      <!-- <el-table-column label="干预时间排序" prop="time_down" align="center" /> -->

      <!-- <el-table-column label="降低时间排序" align="center" width="90" fixed="right">
        <template slot-scope="scope">
          <div style="margin: 12px 0;">
            <el-badge :value="scope.row.time_down" class="item" type="primary" :hidden="scope.row.time_down === 0">
              <el-switch
                :value="scope.row.time_down > 0"
                @change="handleTimeOrder($event, scope.$index)"
              />
            </el-badge>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="降低热门排序" align="center" width="90" fixed="right">
        <template slot-scope="scope">
          <div style="margin: 12px 0;">
            <el-badge :value="scope.row.down" class="item" type="primary" :hidden="scope.row.down === 0">
              <el-switch
                :value="scope.row.down > 0"
                @change="handlePopularity($event, scope.$index)"
              />
            </el-badge>
          </div>
        </template>
      </el-table-column> -->

      <el-table-column label="隐藏文章" align="center" fixed="right" width="80">
        <template slot-scope="scope">
          <el-switch
            :value="Boolean(scope.row.status)"
            @change="handleChange($event, scope.$index)"
          />
        </template>
      </el-table-column>
      <el-table-column label="推荐" align="center" fixed="right" width="80">
        <template slot-scope="scope">
          <el-switch
            :value="Boolean(scope.row.is_recommend)"
            @change="handlePromoteChange($event, scope.$index)"
          />
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <router-link :to="`/p/detail/${scope.row.id}`" target="_blank">
            <el-button type="text" size="small">详情</el-button>
          </router-link>
        </template>
      </el-table-column> -->
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
import { isNull } from '@/utils/validate'
import Dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  // watch: {
  //   search: {
  //     deep: true,
  //     handler() {
  //       this.getList(1);
  //     }
  //   }
  // },
  data() {
    return {
      list: null,
      count: 0,
      listLoading: true,
      pageSize: 10,
      pageIndex: 1,
      search: {
        id: '',
        title: '',
        author: '',
        is_recommend: false
      }
    }
  },
  computed: {
    getMatatakiHostByEnv() {
      switch (process.env.NODE_ENV) {
        case 'production': return 'https://www.matataki.io'
        default: return 'https://test.matataki.io'
      }
    }
  },
  created() {
    this.getList(1)
  },
  methods: {
    async handleChange(e, index) {
      const id = this.list[index].id
      const result = await this.updatePost(
        id,
        { status: Number(e) },
        `修改成功，${e ? '已被删除' : '已被释出'}`
      )
      if (result) this.list[index].status = Number(e)
    },
    getMatatakiArticleUrl(id) {
      const host = this.getMatatakiHostByEnv
      return `${host}/p/${id}`
    },
    formatToRelativeTime(dates) {
      Dayjs.extend(relativeTime)
      return Dayjs().locale('zh-cn').to(Dayjs(dates))
    },
    async handlePromoteChange(e, index) {
      const id = this.list[index].id
      const result = await this.updatePost(
        id,
        { is_recommend: Number(e) },
        `修改成功，${e ? '已推荐' : '已取消推荐'}`
      )
      if (result) this.list[index].is_recommend = Number(e)
    },

    async handleTimeOrder(e, index) {
      const time_down = Number(e) ? 10 : 0
      const result = await this.updatePost(
        this.list[index].id,
        { time_down },
        `修改成功，${e ? '已在时间排序中置底' : '已恢复时间排序中的默认位置'}`
      )
      if (result) this.list[index].time_down = time_down
    },

    async handlePopularity(e, index) {
      const down = Number(e) ? 10 : 0
      const result = await this.updatePost(
        this.list[index].id,
        { down },
        `修改成功，${e ? '已在热门排序中置底' : '已恢复热门排序中的默认位置'}`
      )
      if (result) this.list[index].down = down
    },

    /** 修改文章参数（重复的代码封装一下） */
    async updatePost(id, data, successMsg, errorMsg) {
      this.listLoading = true
      try {
        const result = await this.request({
          url: `${this.apis.posts}/${id}`,
          method: 'put',
          data
        })
        this.listLoading = false
        if (result.code === 0) this.$message.success(successMsg || '修改成功')
        else this.$message.error(errorMsg || '修改失败')
        return result.code === 0
      } catch (e) {
        this.listLoading = false
        this.$message.error(errorMsg || '修改失败')
        return false
      }
    },
    getImg(hash) {
      return `${this.apis.imgHost}${hash}`
    },
    fromUnixTimestamp(v) {
      return v * 1000
    },
    toUnixTimestamp(v) {
      return Math.round(v / 1000)
    },
    searchList() {
      this.getList(1)
    },
    handleCurrentChange(v) {
      this.getList(v)
    },
    getList(pageIndex) {
      this.listLoading = true
      const search = {}
      // debugger;
      for (const item in this.search) {
        if (!isNull(this.search[item])) {
          if (item === 'is_recommend') {
            search[item] = this.search[item] ? '1' : ''
          } else {
            search[item] = this.search[item]
          }
        }
      }
      this.request({
        url: this.apis.posts,
        method: 'get',
        noLoading: true,
        params: {
          pageSize: this.pageSize,
          pageIndex: pageIndex || this.pageIndex,
          ...search
        }
      })
        .then(res => {
          this.listLoading = false
          this.list = res.data.rows
          this.count = res.data.count
        })
        .catch(error => {
          if (error.response.status === 401) {
            console.log('登录超时')
            this.$store.dispatch('FedLogOut').then(() => {
              location.reload() // 为了重新实例化vue-router对象 避免bug
            })
          }
        })
    }
  }
}
</script>

<style scoped>
</style>
