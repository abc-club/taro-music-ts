import API from '@/services/api'

// 获取我的关注
export function getEventsDao(uid: number) {
  return API.get({
    url: '/user/event',
    data: {
      uid,
      limit: 1000
    }
  })
}

