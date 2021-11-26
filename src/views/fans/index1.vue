<template>
  <div class="fans-container">
    <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
    <div ref="main" style="width: 50%; height: 400px"></div>
    <h3>地图echarts示例</h3>
    <mapDemo></mapDemo>
    <h3>纯百度地图实例</h3>
    <baiduMapDemo></baiduMapDemo>
  </div>
</template>

<script>
// import echarts from 'echarts'
import * as echarts from 'echarts'
import mapDemo from './components/map-demo'
import baiduMapDemo from './components/baiduMap-demo'

export default {
  name: 'FansIndex',
  data() {
    return {}
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.$refs.main)
    // 指定图表的配置项和数据
    var option = {
      xAxis: {
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {},
      series: [
        {
          type: 'bar',
          data: [23, 24, 18, 25, 27, 28, 25]
        },
        {
          type: 'bar',
          data: [26, 24, 18, 22, 23, 20, 27]
        }
      ]
    }
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  },
  components: {
    mapDemo,
    baiduMapDemo
  }
}
</script>

<style lang="less" scoped>
.fans-container {
}
</style>
