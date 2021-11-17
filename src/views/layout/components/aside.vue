<template>
  <el-menu
    :default-active="$route.path"
    class="aside-menu"
    background-color="transparent"
    :collapse="isCollapse"
    active-text-color="var(--themeColor)"
    router
    :collapse-transition="true"
  >
    <el-menu-item index="/">
      <i class="iconfont icon-iconfontzhizuobiaozhun023101"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-menu-item index="/article">
      <i class="iconfont icon-neirongguanli"></i>
      <span slot="title">内容</span>
    </el-menu-item>
    <el-menu-item index="/image">
      <i class="iconfont icon-tupian"></i>
      <span slot="title">素材</span>
    </el-menu-item>
    <el-menu-item index="/publish">
      <i class="iconfont icon-fabu2"></i>
      <span slot="title">发布</span>
    </el-menu-item>
    <el-menu-item index="/comment">
      <i class="iconfont icon-pinglun"></i>
      <span slot="title">评论管理</span>
    </el-menu-item>
    <el-menu-item index="/fans">
      <i class="iconfont icon-ziyuan191"></i>
      <span slot="title">粉丝管理</span>
    </el-menu-item>
    <el-menu-item index="/settings">
      <i class="iconfont icon-shezhi1"></i>
      <span slot="title">个人中心</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'AppAside',
  props: ['is-collapse'],
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang="less" scoped>
.aside-menu {
  border: none;
  width: 200px;
  margin-left: 30px;
  // margin-right: 10px;
  padding-right: 15px;
  // padding-bottom: 50px;
  .iconfont {
    margin-right: 8px;
  }
  .el-menu-item {
    font-size: 15px;
    height: 40px;
    line-height: 38px;
    margin: 15px 0;
    padding: 0;
  }

  /deep/.el-menu-item.is-active {
    background-color: #ededed !important;
  }
  /deep/.el-menu-item:not(.is-disabled):hover {
    background-color: #ededed !important;
  }
}
.el-menu--collapse {
  width: 56px;
  margin-left: 0;
  padding-right: 0;
}
</style>
