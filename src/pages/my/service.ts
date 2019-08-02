import API from '@/services/api'

// 获取用户信息
export function getPlayListDao(uid: number) {
  return API.get({
    url: '/user/playlist',
    data: {
      uid,
      limit: 300
    }
  })
}

