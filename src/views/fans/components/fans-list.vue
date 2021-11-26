<template>
  <div class="fans-list-container">
    <!-- 无数据 -->
    <el-empty v-if="totalFans === 0" class="no-fans" description="暂无粉丝"></el-empty>
    <!-- 粉丝列表 -->
    <el-row :gutter="20">
      <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="3" v-for="fans in fansList" :key="fans.id">
        <div class="grid-content bg-purple">
          <div class="fans-item">
            <div class="fans-avatar">
              <img :src="fans.photo ? fans.photo : 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'" alt="" />
            </div>
            <div class="fans-name">{{ fans.name }}</div>
            <div class="fans-follow-btn"><el-button type="primary" size="mini">+关注</el-button></div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 分页器 -->
    <el-pagination
      background
      class="list-pagination"
      layout="prev, pager, next"
      :total="totalFans"
      :hide-on-single-page="true"
      :page-size="pageSize"
      :current-page.sync="currentPage"
      @current-change="onPageChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getFans } from '@/api/fans'
export default {
  name: 'FansList',
  data() {
    return {
      fansList: {}, // 粉丝列表
      totalFans: 0, // 粉丝总数
      pageSize: 10, // 每页数量
      currentPage: 1 // 当前页
    }
  },
  created() {
    this.loadFansList()
  },
  methods: {
    // 获取粉丝列表
    loadFansList() {
      getFans({
        page: this.currentPage,
        per_page: this.pageSize
      }).then((res) => {
        const { results, total_count: totalCount } = res.data.data
        this.fansList = results
        this.totalFans = totalCount
        this.$emit('total-fans', this.totalFans)
      })
    },
    // 分页器页码发生变化
    onPageChange() {
      this.loadFansList(this.currentPage)
    }
  }
}
</script>

<style lang="less" scoped>
.fans-list-container {
  .grid-content {
    height: 180px;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    .fans-item {
      width: 70%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border: 1px solid #f5f5f5;
      border-radius: 5px;
      .fans-avatar {
        width: 65px;
        height: 65px;
        border-radius: 50%;
        overflow: hidden;
        margin-bottom: 10px;
        img {
          min-width: 100%;
          height: 100%;
        }
      }
      .fans-name {
        font-size: 16px;
        margin-bottom: 10px;
      }
    }
  }
  .list-pagination {
    display: block;
    margin-top: 10px;
    text-align: right;
  }
}
</style>
