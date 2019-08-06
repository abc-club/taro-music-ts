import API from '@/services/api'

// 获取推荐歌单
export function getRecommendPlayListDao() {
  return API.get({
    url: '/personalized',
  })
}

// 获取推荐电台
export function getRecommendDjDao() {
  return API.get({
    url: '/personalized/djprogram',
  })
}

// 获取推荐新歌
export function getRecommendNewSongDao() {
  return API.get({
    url: '/personalized/newsong',
  })
}

// 获取推荐精彩节目
export function getRecommendDao() {
  return API.get({
    url: '/personalized/recommend',
  })
}

// 获取banner
export function getBannerDao() {
  return API.get({
    url: '/banner?type=2',
  })
}

// 获取每日推荐
export function getRecommendSongsDao() {
  return API.get({
    url: '/recommend/songs',
  })
}
