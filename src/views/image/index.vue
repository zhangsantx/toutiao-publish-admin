<template>
  <div class="image-container">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>
          <!-- 面包屑 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>素材</el-breadcrumb-item>
          </el-breadcrumb>
        </span>
      </div>
      <div>
        <!-- 图片列表 -->
        <image-list></image-list>
      </div>
    </el-card>
  </div>
</template>

<script>
import ImageList from './components/image-list'
export default {
  name: 'ImageIndex',
  components: {
    ImageList
  }
}
</script>

<style lang="less" scoped>
.image-container {
  .el-card {
    border: none;
    border-radius: 5px;
  }
}
</style>
