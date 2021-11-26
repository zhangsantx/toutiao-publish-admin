<template>
  <div class="comment-container">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>
          <!-- 面包屑 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>评论管理</el-breadcrumb-item>
          </el-breadcrumb>
        </span>
      </div>
      <div>
        <el-table :data="articles" style="width: 100%" v-loading="isLoading">
          <el-table-column prop="title" label="标题"> </el-table-column>
          <el-table-column prop="total_comment_count" label="总评论数"> </el-table-column>
          <el-table-column prop="fans_comment_count" label="粉丝评论数"> </el-table-column>
          <el-table-column label="评论状态">
            <template slot-scope="scope">
              <el-tag size="small" :type="scope.row.comment_status ? 'success' : 'danger'">{{ scope.row.comment_status ? '已开启' : '已关闭' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.comment_status"
                active-color="#409eff"
                inactive-color="#dcdfe6"
                :disabled="scope.row.isDisabled"
                @change="onStatusChange(scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页器 -->
      <el-pagination
        class="list-pagination"
        background
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        :disabled="isLoading"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticles, updateCommentStatus } from '@/api/article'
export default {
  name: 'CommentIndex',
  data() {
    return {
      articles: [], // 文章数据列表
      totalCount: 0, // 文章总数据条数
      pageSize: 10, // 每页显示的条数
      currentPage: 1, // 当前页
      isLoading: false // 是否开启loading
    }
  },
  created() {
    this.loadArticles()
  },
  methods: {
    // 获取文章列表
    loadArticles(page = 1) {
      // 开启loading
      this.isLoading = true
      // 将请求页码和分页器页码保持一致
      this.currentPage = page
      getArticles({
        response_type: 'comment',
        page, // 获取的页
        per_page: this.pageSize // 每页条数
      }).then((res) => {
        // 关闭loading
        this.isLoading = false
        const { results, total_count: totalCount } = res.data.data
        // 手动为每个文章的评论状态按钮添加禁用状态
        results.forEach((article) => {
          article.isDisabled = false
        })
        this.articles = results
        this.totalCount = totalCount
      })
    },
    // 开启或关闭评论
    onStatusChange(article) {
      // 禁用按钮
      article.isDisabled = true
      updateCommentStatus(article.id.toString(), article.comment_status).then((res) => {
        // 取消禁用按钮
        article.isDisabled = false
        this.$notify({
          title: '成功',
          message: article.comment_status ? '已开启评论' : '已关闭评论',
          type: 'success'
        })
      })
    },
    // 每页显示条数发生变化
    onSizeChange(pageSize) {
      this.pageSize = pageSize
      this.loadArticles(1)
    },
    // 页码改变加载对应页码的数据
    onCurrentChange(page) {
      this.currentPage = page
      this.loadArticles(this.currentPage)
    }
  }
}
</script>

<style lang="less" scoped>
.comment-container {
  .el-card {
    border: none;
    border-radius: 5px;
    /deep/.el-table th.el-table__cell.is-leaf {
      &:nth-child(n + 2) {
        text-align: center;
      }
    }
    /deep/.el-table--enable-row-transition .el-table__body td.el-table__cell {
      &:nth-child(n + 2) {
        text-align: center;
      }
      // &:first-child {
      //   div {
      //     overflow: hidden;
      //     white-space: nowrap;
      //     text-overflow: ellipsis;
      //   }
      // }
    }
  }

  .list-pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
