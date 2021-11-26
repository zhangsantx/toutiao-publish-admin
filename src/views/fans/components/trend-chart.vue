<template>
  <div class="trend-chart-container">
    <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
    <div class="main" ref="main"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'TrendChart',
  data() {
    return {}
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(this.$refs.main)
    // 指定图表的配置项和数据
    const option = {
      xAxis: {
        type: 'category',
        data: ['11/19', '11/20', '11/21', '11/22', '11/22', '11/23', '11/24']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line'
        }
      ]
    }
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
    // 图形宽度随屏幕宽度改变而改变
    window.addEventListener('resize', function () {
      myChart.resize()
    })
  }
}
</script>

<style lang="less" scoped>
.trend-chart-container {
  .main {
    width: 100%;
    height: 400px;
    // background-color: pink;
  }
}
</style>
