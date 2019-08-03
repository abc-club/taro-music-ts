import API from '@/services/api'

// 获取歌单详情信息
export function getPlayListDetailDao(id: number) {
  return API.get({
    url: '/playlist/detail',
    data: {
      id
    }
  })
}

