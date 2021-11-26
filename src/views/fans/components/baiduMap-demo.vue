<template>
  <div class="baidumap-container">
    <!-- 1.设置地图容器 -->
    <div id="container" style="width: 50%; height: 400px"></div>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {}
  },
  mounted() {
    // 2.创建地图实例
    // 注意：在项目代码中访问第三方全局数据，例如 BMapGL 需要加 windows 前缀
    var map = new window.BMapGL.Map('container')
    // 3.设置中心点坐标
    var point = new window.BMapGL.Point(116.404, 39.915)
    // 4.初始化地图，同时设置地图展示级别
    map.centerAndZoom(point, 15)
  }
}
</script>

<style lang="less" scoped>
.baidumap-container {
}
</style>
