<template>
  <div class="sex-chart-container">
    <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
    <div ref="main" class="main"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'SexChart',
  data() {
    return {}
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(this.$refs.main)
    // 指定图表的配置项和数据
    const option = {
      title: {
        text: '性别分布', // 主标题
        textStyle: {
          color: '#000', // 颜色
          fontStyle: 'normal', // 风格
          fontWeight: 'normal', // 粗细
          fontFamily: 'Microsoft yahei', // 字体
          fontSize: 14, // 大小
          align: 'center' // 水平对齐
        }
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        bottom: '5%',
        left: 'center'
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '20'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 0, name: '男性' },
            { value: 0, name: '女性' },
            { value: 0, name: '未知性别' }
          ]
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
.sex-chart-container {
  width: 100%;
  height: 100%;
  .main {
    width: 100%;
    height: 100%;
  }
}
</style>
