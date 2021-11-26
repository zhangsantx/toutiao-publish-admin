<template>
  <div class="fans-data-container">
    <div class="fans-data-warp">
      <div class="data-name">核心数据</div>
      <div class="fans-core-data">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="8" :md="6" :lg="6" :xl="6">
            <div class="grid-content bg-purple">
              <div class="core-data-item">
                <div class="data-name">昨日粉丝变化数</div>
                <div class="data-num">0</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="8" :md="6" :lg="6" :xl="6">
            <div class="grid-content bg-purple">
              <div class="core-data-item">
                <div class="data-name">昨日粉丝活跃数</div>
                <div class="data-num">0</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="8" :md="6" :lg="6" :xl="6">
            <div class="grid-content bg-purple">
              <div class="core-data-item">
                <div class="data-name">昨日粉丝活跃占比</div>
                <div class="data-num">0.00%</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="8" :md="6" :lg="6" :xl="6">
            <div class="grid-content bg-purple">
              <div class="core-data-item">
                <div class="data-name">粉丝总数</div>
                <div class="data-num">{{ totalFans }}</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="fans-data-warp">
      <div class="data-name">数据趋势</div>
      <div class="trend-data">
        <!-- 粉丝趋势图 -->
        <trend-chart></trend-chart>
      </div>
    </div>
    <div class="fans-data-warp">
      <div class="data-name">粉丝特征</div>
      <div class="features-data">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="10">
            <div class="features-data-item">
              <!-- 性别分布图-->
              <sex-chart></sex-chart>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="14">
            <div class="features-data-item">
              <!-- 年龄分布图 -->
              <age-chart></age-chart>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { getFans } from '@/api/fans'
// import { getFans, getFansData } from '@/api/fans'

import TrendChart from './trend-chart'
import SexChart from './sex-chart'
import AgeChart from './age-chart'

export default {
  name: 'FansData',
  data() {
    return {
      totalFans: 0 // 粉丝总数
    }
  },
  created() {
    this.loadFans()
    // this.loadFansData()
  },
  methods: {
    // 获取粉丝列表-获取总数
    loadFans() {
      getFans({}).then((res) => {
        const { total_count: totalCount } = res.data.data
        this.totalFans = totalCount
      })
    }
    // 获取粉丝详细数据
    // loadFansData() {
    //   getFansData().then((res) => {
    //     console.log(res)
    //   })
    // }
  },
  components: {
    TrendChart,
    SexChart,
    AgeChart
  }
}
</script>

<style lang="less" scoped>
.fans-data-container {
  .data-name {
    font-size: 16px;
    margin: 20px 0 10px 0;
  }
  .grid-content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 130px;
    .core-data-item {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .data-name {
        font-size: 14px;
      }
      .data-num {
        font-size: 35px;
        font-weight: 700;
      }
    }
  }
  .features-data {
    .features-data-item {
      height: 400px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 5px;
      border: 1px solid #ccc;
      padding: 10px;
      overflow: hidden;
      margin-top: 10px;
    }
  }
}
</style>
