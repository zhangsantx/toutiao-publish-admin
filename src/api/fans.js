// 粉丝相关请求模块
import request from '@/utils/request'

// 获取粉丝列表
export const getFans = (data) => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/followers',
    data
  })
}

// 获取粉丝数据
export const getFansData = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/statistics/followers'
  })
}
