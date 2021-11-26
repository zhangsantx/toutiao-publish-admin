<template>
  <div class="age-chart-container">
    <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
    <div ref="main" class="main"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'AgeChart',
  data() {
    return {}
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(this.$refs.main)
    // 指定图表的配置项和数据
    const option = {
      title: {
        text: '年龄分布', // 主标题
        textStyle: {
          color: '#000', // 颜色
          fontStyle: 'normal', // 风格
          fontWeight: 'normal', // 粗细
          fontFamily: 'Microsoft yahei', // 字体
          fontSize: 14, // 大小
          align: 'center' // 水平对齐
        }
      },
      xAxis: {
        type: 'category',
        data: ['0-10', '10-20', '20-30', '30-40', '40-50', '50-60', '60+']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar',
          barWidth: 30 // 柱图宽度
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
.age-chart-container {
  width: 100%;
  height: 100%;
  .main {
    width: 100%;
    height: 100%;
  }
}
</style>
