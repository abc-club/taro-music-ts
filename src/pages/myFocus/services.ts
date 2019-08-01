import API from '@/services/api'

// 获取我的关注
export function getFollowsDao(uid: number) {
  return API.get({
    url: '/user/follows',
    data: {
      uid,
      limit: 1000
    }
  })
}

