<template>
  <!-- <div class="layout-container"> -->
  <el-container class="layout-warp">
    <!-- 顶部导航 -->
    <el-header class="header-warp">
      <div class="logo-header-warp">
        <img class="logo-header" src="@/assets/logo.png" alt="" />
        <!-- <span class="logo-header-text">拓扑头条 | 创作中心</span> -->
        <!-- <span class="logo-header-text">TOPOLONEWS | 创作中心</span> -->
        <span class="logo-header-text">黑马头条 | 创作中心</span>
      </div>
      <el-dropdown>
        <div class="user-warp">
          <img class="user-avator" :src="user.photo ? user.photo : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" alt="" />
        </div>
        <el-dropdown-menu class="user-dropdown" slot="dropdown">
          <el-dropdown-item>您好，{{ user.name }}</el-dropdown-item>
          <el-dropdown-item @click.native="$router.push('/settings')"><i class="iconfont icon-shezhi1"></i>设置 </el-dropdown-item>
          <el-dropdown-item @click.native="onLogOut"><i class="iconfont icon-tuichu"></i>退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <el-container class="down-warp">
      <!-- 侧边栏 -->
      <!-- <el-aside class="aside-warp" width="auto"> -->
      <el-aside class="aside-warp" width="auto">
        <app-aside :is-collapse="isCollapse"></app-aside>
        <el-tooltip effect="dark" :content="isCollapse ? '展开' : '折叠'" placement="right">
          <!-- 折叠按钮 -->
          <div class="collapse-btn" @click="isCollapse = !isCollapse">
            <i :class="isCollapse ? 'iconfont el-icon-s-unfold' : 'iconfont el-icon-s-fold'"></i>
          </div>
        </el-tooltip>
      </el-aside>
      <el-main class="main-warp">
        <!-- 子路由出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
  <!-- </div> -->
</template>

<script>
import AppAside from './components/aside'
import { getUserProfile } from '@/api/user'
import globalBus from '@/utils/global-bus'

export default {
  name: 'LayoutIndex',
  data() {
    return {
      user: {}, // 当前登录用户信息
      isCollapse: false // 是否折叠侧边栏
    }
  },
  components: {
    AppAside
  },
  created() {
    this.loadUserProfile()
    // 注册自定义事件 接收setting组件传递的更改之后的user
    globalBus.$on('update-user', (data) => {
      this.user.name = data.name
      this.user.photo = data.photo
    })
  },
  methods: {
    // 获取用户信息
    loadUserProfile() {
      getUserProfile().then((res) => {
        this.user = res.data.data
      })
    },
    // 退出登录
    onLogOut() {
      this.$confirm('确认要退出吗？', '退出登录', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清除登录状态
        window.localStorage.removeItem('user')
        // 跳转登录页面
        this.$router.push('/login')
      })
    }
  }
}
</script>

<style lang="less" scoped>
// .layout-container {
.layout-warp {
  // 撑满整个区域
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #f5f6f7;
  .header-warp {
    height: 55px !important;
    background-color: #fff;
    -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
    .logo-header-warp {
      display: flex;
      align-items: center;
      padding-left: 22px;
      .logo-header {
        width: 35px;
        height: 35px;
        margin-right: 10px;
      }
      .logo-header-text {
        font-size: 20px;
      }
    }
    .user-warp {
      cursor: pointer;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      overflow: hidden;
      padding: 2px;
      background-color: #fff;
      margin-right: 8px;
      border: 1px solid var(--themeColor);
      .user-avator {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }
  .down-warp {
    height: 85%;
    /* 美化滚动条样式 */
    ::-webkit-scrollbar {
      -webkit-appearance: none;
      width: 5px;
      height: 10px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 0;
      border-radius: 5px;
    }
    ::-webkit-scrollbar-thumb {
      cursor: pointer;
      border-radius: 5px;
      background: rgba(0, 0, 0, 0.15);
      transition: color 0.2s ease;
    }
    .aside-warp {
      margin: 10px;
      box-sizing: border-box;
      .collapse-btn {
        position: fixed;
        bottom: 10px;
        left: 20px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        line-height: 32px;
        text-align: center;
        color: #fff;
        background-color: var(--themeColor);
        cursor: pointer;
        .iconfont {
          font-size: 18px;
        }
      }
    }
    .main-warp {
    }
  }
}
</style>
