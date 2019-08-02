import API from '@/services/api'

// 获取用户信息
export function getUserDetailDao(uid: number) {
  return API.get({
    url: '/user/detail',
    data: {
      uid
    }
  })
}

// 获取最近播放
export function getRecentPlayDao(uid: number) {
  return API.get({
    url: '/user/record',
    data: {
      uid,
      type: 0,
    }
  })
}
