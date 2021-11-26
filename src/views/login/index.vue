<template>
  <div class="login-container">
    <div class="login-warp">
      <el-form class="login-form" ref="login-form" :model="user" :rules="formRoules" label-width="0px">
        <div class="login-text">欢迎登录</div>
        <el-form-item prop="mobile">
          <el-input v-model="user.mobile" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="user.code" placeholder="验证码"></el-input>
        </el-form-item>
        <!-- <el-checkbox class="user-notice" v-model="user.checked">手机验证后自动登录，登录即代表同意《拓扑头条用户协议》和《隐私保护指引》</el-checkbox> -->
        <div class="user-notice">手机验证后自动登录，登录即代表同意《拓扑头条用户协议》和《隐私保护指引》</div>
        <el-form-item>
          <el-button class="login-btn" type="primary" @click="onLogin" @keydown.enter="onLogin" :loading="loginLoading">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { userLogin } from '@/api/user'
export default {
  name: 'LoginIndex',
  data() {
    return {
      user: {
        mobile: '13911111111', // 手机号
        code: '246810' // 验证码
      },
      // user: {
      //   mobile: '', // 手机号
      //   code: '' // 验证码
      // },
      loginLoading: false, // 登录按钮的Loading状态
      // 表单验证规则
      formRoules: {
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '请输入正确格式的验证码', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.$notify({
      title: '提示',
      dangerouslyUseHTMLString: true,
      message: '<div>默认手机号：13911111111</div><div>默认验证码：246810</div>'
    })
  },
  methods: {
    // 点击登录
    async onLogin() {
      // 手动调用表单验证(保证表单验证通过)
      this.$refs['login-form'].validate((valid) => {
        if (valid) {
          // 验证通过-请求登录
          this.login()
        } else {
          // 验证失败
          return false
        }
      })
    },
    // 登录
    login() {
      userLogin(this.user)
        .then((res) => {
          // 登录成功
          // 将用户数据存储到本地存储中()
          // 注意：本地存储中只能存储字符串，如果需要存储对象或数组，需要转换为JSON格式字符串存储JSON.stringify(xxx)
          window.localStorage.setItem('user', JSON.stringify(res.data.data))
          // 跳转到后台首页
          this.$router.push({ name: 'home' })
          // 欢迎用户
          this.$notify({
            title: res.data.data.name,
            message: '欢迎回来！'
          })
        })
        .catch(() => {
          this.$notify({
            title: '错误',
            message: '登录失败，手机号或验证码错误',
            type: 'error'
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('./bg2.png') no-repeat;
  background-color: #b8e5f8;
  background-size: cover;
  .login-warp {
    box-shadow: 0 1px 3px rgb(18 18 18 / 10%);
    border-radius: 5px;
    background-color: #ffffff;
    width: 370px;
    overflow: hidden;
    .login-text {
      font-size: 22px;
      margin-bottom: 20px;
      font-weight: 500;
    }
    .login-form {
      background-color: #fff;
      margin: 30px;
      // overflow: hidden;
      padding-bottom: 0;
      /deep/.el-input__inner {
        border: none;
        border-bottom: 1px solid #ebebeb;
        padding: 0;
        border-radius: 0;
        font-size: 15px;
        &:focus {
          border-bottom: 1px solid #06f;
        }
      }
      /deep/.el-form-item.is-error .el-input__inner {
        border-color: #f56c6c;
      }
      .user-notice {
        font-size: 13px;
        color: #808080;
        padding: 5px 0 20px 0;
      }
      .login-btn {
        width: 100%;
        color: #fff;
        background-color: #06f;
      }
    }
  }
}
</style>
