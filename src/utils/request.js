// 基于 axios 封装的请求模块
import axios from 'axios'
// 引入jsonbigint
import JSONbig from 'json-bigint'
import router from '@/router'
import { Message } from 'element-ui'

// axios()
// axios.get()
// axios.post()

// 创建一个 axios 实例，说白了就是复制了一个 axios
// 我们通过这个实例去发请求，把需要的配置配置给这个实例来处理
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net/', // 请求的基础路径
  // 定义后端返回的原始数据的处理
  // data 后端返回的未经处理的JSON格式字符串
  // axios默认在内部使用JSON.parse来出了原始数据data
  transformResponse: [
    function (data) {
      try {
        // 如果后端返回的不是JSON字符串会报错，所以使用try/catch
        return JSONbig.parse(data)
      } catch (error) {
        return data
      }
    }
  ]
})

// 请求拦截器
request.interceptors.request.use(
  // 所有请求都会经过此处
  // config 当前请求相关的配置信息对象
  function (config) {
    // 获取本地存储中的user信息
    const user = JSON.parse(window.localStorage.getItem('user'))
    if (user) {
      // 设置统一的token
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  // 请求失败
  function (error) {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  function (response) {
    // 所有响应码为2xx的都会进入触发
    return response
  },
  function (error) {
    // 所有响应码为2xx之外的都会进入触发
    const { status } = error.response
    // 处理请求401异常--跳转登录页
    // 注意：在请求模块中使用this.$router需要important引入加载
    if (error.response && status === 401) {
      // 清除本地存储中的登录状态
      window.localStorage.removeItem('user')
      // 跳转登录页面
      router.push('/login')
      Message.error('登录状态无效，请重新登录')
    } else if (error.response && status === 400) {
      // 400 客户端参数错误
      Message.error('请求参数错误')
    } else if (error.response && status === 403) {
      // 403 token未携带或已过期 / 无权限
      Message.warning('无操作权限')
    } else if (error.response && status >= 500) {
      // 服务端错误
      Message.error('服务端内部错误')
    }
    return Promise.reject(error)
  }
)
// 导出请求方法
export default request

// 谁要使用谁就加载 request 模块
// import request from 'request.js'
// request.xxx
// request({
//   method: ,
//   url: ''
// })
