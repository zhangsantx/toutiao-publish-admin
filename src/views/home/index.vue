<template>
  <div class="home-container">
    <el-card class="box-card" shadow="never">
      <div class="notice-warp">
        <span class="card-title-warp"><i class="el-icon-bell"></i>关于更新用户使用协议的通知</span>
        <span class="notice-time">2021-11-25</span>
      </div>
    </el-card>
    <el-card class="box-card count-data-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>账号情况</span>
      </div>
      <div class="count-data">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="8" :md="6" :lg="6" :xl="6">
            <div class="grid-content bg-purple">
              <div class="data-item">
                <div class="data-name"><i class="el-icon-files"></i>新增粉丝</div>
                <div class="data-num">0</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="8" :md="6" :lg="6" :xl="6">
            <div class="grid-content bg-purple">
              <div class="data-item">
                <div class="data-name"><i class="el-icon-user"></i>总粉丝数</div>
                <div class="data-num">{{ totalFans }}</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="8" :md="6" :lg="6" :xl="6">
            <div class="grid-content bg-purple">
              <div class="data-item">
                <div class="data-name"><i class="el-icon-tickets"></i>昨日发布</div>
                <div class="data-num">0</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="8" :md="6" :lg="6" :xl="6">
            <div class="grid-content bg-purple">
              <div class="data-item">
                <div class="data-name"><i class="el-icon-office-building"></i>总发布数</div>
                <div class="data-num">{{ totalCount }}</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card class="box-card write-article-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>新的创作</span>
      </div>
      <div>
        <el-row :gutter="20">
          <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="3">
            <div class="text-article" @click="$router.push('/publish')"><i class="el-icon-tickets"></i>图文消息</div>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card class="box-card recent-card" shadow="never">
      <div slot="header" class="clearfix rescent-warp">
        <span>最近发布</span>
        <span class="more-btn" @click="$router.push('/article')">全部<i class="el-icon-arrow-right"></i></span>
      </div>
      <div>
        <div class="recent-article-item">
          <el-table :data="articles" style="width: 100%" :show-header="false" v-loading="loading">
            <el-table-column prop="pubdate" width="170"> </el-table-column>
            <el-table-column width="130">
              <template slot-scope="scope">
                <div class="article-cover">
                  <el-image v-if="scope.row.cover.images[0]" :src="scope.row.cover.images[0]" fit="cover" lazy>
                    <div slot="placeholder" class="image-slot">加载中<span class="dot">...</span></div>
                  </el-image>
                  <el-image v-else src="" fit="cover" lazy> <div slot="error" class="image-slot">无封面</div></el-image>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="title"></el-table-column>
            <el-table-column label="操作" class="tools-warp">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                  <el-button
                    class="article-tools"
                    type="primary"
                    plain
                    size="mini"
                    icon="el-icon-edit"
                    circle
                    @click="$router.push('/publish?id=' + scope.row.id)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import { getFans } from '@/api/fans'

export default {
  name: 'HomeIndex',
  data() {
    return {
      loading: false,
      articles: [],
      totalCount: 0,
      totalFans: 0 // 粉丝总数
    }
  },
  created() {
    this.loadArticles()
    this.loadFansNum()
  },
  methods: {
    // 获取文章列表数据--总数
    loadArticles() {
      // 开启loading
      this.loading = true
      getArticles({
        // begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, // 开始时间
        // end_pubdate: this.rangeDate ? this.rangeDate[1] : null // 结束时间
      }).then((res) => {
        // 关闭loading
        this.loading = false
        const { results, total_count: totalCount } = res.data.data
        this.articles = results
        this.totalCount = totalCount
      })
    },
    // 获取粉丝数量
    loadFansNum() {
      getFans().then((res) => {
        const { total_count: totalCount } = res.data.data
        this.totalFans = totalCount
      })
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  .el-card {
    border: none;
    border-radius: 5px;
    margin-top: 20px;
    /deep/.el-card__header {
      border: none;
    }
    .notice-warp {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .card-title-warp {
        display: flex;
        align-items: center;
      }
      .el-icon-bell {
        font-size: 23px;
        margin-right: 5px;
        color: #ccc;
      }
      .notice-time {
        font-size: 14px;
        color: #ccc;
      }
    }
    .rescent-warp {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .count-data-card {
    .count-data {
      .grid-content {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 130px;
        .data-item {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .data-name {
            font-size: 15px;
            display: flex;
            align-items: center;
            [class*=' el-icon-'],
            [class^='el-icon-'] {
              font-size: 20px;
              margin-right: 3px;
              color: #ccc;
            }
          }
          .data-num {
            font-size: 35px;
            font-weight: 700;
          }
        }
      }
    }
  }
  .write-article-card {
    .text-article {
      height: 200px;
      border: 1px dashed #ccc;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      margin-bottom: 10px;
      [class*=' el-icon-'],
      [class^='el-icon-'] {
        font-size: 25px;
        margin-bottom: 5px;
      }
      &:hover {
        background-color: #f6f7f8;
        color: var(--themeColor);
      }
    }
  }
  .recent-card {
    .more-btn {
      &:hover {
        color: var(--themeColor);
        cursor: pointer;
      }
    }
    .article-cover {
      .el-image {
        width: 120px;
        height: 120px;
        background-color: #f5f7fa;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #c0c4cc;
      }
    }
    /deep/.el-table--enable-row-transition .el-table__body td.el-table__cell {
      &:last-child {
        padding-right: 20px;
        text-align: right;
      }
    }
  }
}
</style>
