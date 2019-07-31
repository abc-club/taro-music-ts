import API from '@/services/api'

// 获取推荐歌单
export function getRecommendList() {
  return API.get({
    url: '/personalized'
  })
}
