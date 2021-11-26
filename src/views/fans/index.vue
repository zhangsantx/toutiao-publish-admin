<template>
  <div class="fans-container">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>
          <!-- 面包屑 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>
          </el-breadcrumb>
        </span>
      </div>
      <div>
        <!-- 标签栏 -->
        <el-tabs v-model="activeName">
          <el-tab-pane label="数据" name="first">
            <!-- 粉丝数据 -->
            <fans-data></fans-data>
          </el-tab-pane>
          <el-tab-pane label="粉丝列表" name="second" class="fans-data-warp">
            <!-- 粉丝列表 -->
            <fans-list @total-fans="getTotalFans"></fans-list>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
import FansList from './components/fans-list'
import FansData from './components/fans-data'
export default {
  name: 'FansIndex',
  data() {
    return {
      activeName: 'first', // 当前选中的标签栏
      totalFans: 0
    }
  },
  methods: {
    getTotalFans(count) {
      this.totalFans = count
    }
  },
  components: {
    FansList,
    FansData
  }
}
</script>

<style lang="less" scoped>
.fans-container {
  .el-card {
    border: none;
    border-radius: 5px;
    /deep/.el-tabs__item {
      font-size: 16px;
      padding-right: 0px;
    }
    /deep/.el-tabs__active-bar {
      background-color: var(--themeColor);
      // width: 64px !important;
    }
    /deep/.el-tabs__item.is-active {
      font-size: 16px;
      color: var(--themeColor);
    }
    /deep/.el-tabs__nav-wrap::after {
      background-color: transparent;
    }
    .no-fans {
      height: 70vh;
    }
  }
}
</style>
