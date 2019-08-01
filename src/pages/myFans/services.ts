import API from '@/services/api'

// 获取我的关注
export function getFollowedsDao(uid: number) {
  return API.get({
    url: '/user/followeds',
    data: {
      uid,
      limit: 1000
    }
  })
}

