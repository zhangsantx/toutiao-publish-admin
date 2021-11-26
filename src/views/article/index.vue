<template>
  <div class="article-container">
    <!-- 条件筛选 -->
    <el-card class="filter-warp" shadow="never">
      <div slot="header" class="clearfix">
        <span>
          <!-- 面包屑 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容</el-breadcrumb-item>
          </el-breadcrumb>
        </span>
      </div>
      <div>
        <!-- 数据筛选表单 -->
        <el-form ref="form" :model="form" label-width="50px" size="small">
          <el-form-item label="状态">
            <el-radio-group v-model="status">
              <el-radio :label="null">全部</el-radio>
              <el-radio :label="0">草稿</el-radio>
              <el-radio :label="1">待审核</el-radio>
              <el-radio :label="2">审核通过</el-radio>
              <el-radio :label="3">审核失败</el-radio>
              <el-radio :label="4">已删除</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="分类">
            <el-select v-model="channelId" placeholder="请选择文章分类">
              <el-option label="全部" :value="null"></el-option>
              <el-option v-for="channel in channels" :key="channel.id" :label="channel.name" :value="channel.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="范围">
            <el-date-picker
              v-model="rangeDate"
              type="daterange"
              align="center"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="form.pickerOptions"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="loading" @click="loadArticles(1)">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <!-- 查询结果 -->
    <el-card class="box-card" shadow="never">
      <div>
        <!-- 数据列表 -->
        <el-table class="list-table" :data="articles" style="width: 100%" v-loading="loading">
          <el-table-column label="封面">
            <template slot-scope="scope">
              <div class="article-cover">
                <el-image v-if="scope.row.cover.images[0]" :src="scope.row.cover.images[0]" fit="cover" lazy>
                  <div slot="placeholder" class="image-slot">加载中<span class="dot">...</span></div>
                </el-image>
                <el-image v-else src="" fit="cover" lazy> <div slot="error" class="image-slot">无封面</div></el-image>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-tag size="medium" :type="articleStatus[scope.row.status].type">{{ articleStatus[scope.row.status].text }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="发布时间">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.pubdate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                <el-button type="primary" plain size="mini" icon="el-icon-edit" circle @click="$router.push('/publish?id=' + scope.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <el-button type="danger" plain size="mini" icon="el-icon-delete" circle @click="onDeleteArticle(scope.row.id)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          class="list-pagination"
          background
          @current-change="onCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30]"
          :page-size="pageSize"
          layout="total,prev, pager, next"
          :total="totalCount"
          :hide-on-single-page="true"
          :disabled="loading"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getArticles, getArticleChanels, deleteArticle } from '@/api/article'
export default {
  name: 'ArticleIndex',
  data() {
    return {
      form: {
        pickerOptions: {
          shortcuts: [
            {
              text: '最近一周',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                picker.$emit('pick', [start, end])
              }
            }
          ]
        }
      },
      articles: [], // 文章数据列表
      // 文章状态
      articleStatus: [
        { status: 0, text: '草稿', type: 'info' },
        { status: 1, text: '待审核', type: 'warning' },
        { status: 2, text: '审核通过', type: 'success' },
        { status: 3, text: '审核失败', type: 'danger' },
        { status: 4, text: '已删除', type: 'danger' }
      ],
      currentPage: 1, // 分页器当前页
      totalCount: 0, // 文章数据总条数
      pageSize: 10, // 每页数据条数
      status: null, // 查询文章状态
      channels: [], // 文章分类
      channelId: null, // 文章分类id
      rangeDate: null, // 范围日期
      loading: true // loading加载动画
    }
  },
  created() {
    this.loadChannels()
    this.loadArticles()
  },
  methods: {
    // 获取文章列表数据
    loadArticles(page = 1) {
      // 开启loading
      this.loading = true
      getArticles({
        page, // 第几页
        per_page: this.pageSize, // 每页条数
        status: this.status, // 文章状态
        channel_id: this.channelId, // 文章分类id
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, // 开始时间
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null // 结束时间
      }).then((res) => {
        // 关闭loading
        this.loading = false
        const { results, total_count: totalCount } = res.data.data
        this.articles = results
        this.totalCount = totalCount
      })
    },
    // 分页器当前页码发生变化
    onCurrentChange(page) {
      this.currentPage = page
      // 获取对应页的文章数据
      this.loadArticles(page)
    },
    // 获取文章分类
    loadChannels() {
      getArticleChanels().then((res) => {
        this.channels = res.data.data.channels
      })
    },
    // 删除文章
    onDeleteArticle(articleId) {
      this.$confirm('确认要删除吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除文章
        deleteArticle(articleId.toString()).then((res) => {
          // 删除成功
          this.$notify({
            title: '成功',
            message: '删除文章成功',
            type: 'success'
          })
          // 刷新当前页列表
          this.loadArticles(this.currentPage)
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.article-container {
  .el-card {
    border: none;
    border-radius: 5px;
  }
  .filter-warp {
    margin-bottom: 10px;
  }
  .list-table {
    margin-bottom: 20px;
    .article-cover {
      width: 200px;
      height: 100px;
      overflow: hidden;
      .el-image {
        width: 100%;
        height: 100%;
        /deep/.image-slot {
          line-height: 100px;
          text-align: center;
          // background-color: #f1f3f4;
          background-color: #f5f7fa;
          color: #c0c4cc;
        }
      }
    }
  }
  /deep/.el-table th.el-table__cell.is-leaf {
    &:nth-child(n + 3) {
      text-align: center;
    }
  }
  /deep/.el-table--enable-row-transition .el-table__body td.el-table__cell {
    &:nth-child(n + 3) {
      text-align: center;
    }
  }
  .list-pagination {
    text-align: right;
  }
}
</style>
