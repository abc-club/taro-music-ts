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

export function getSongDetailDao(id: number) {
  return API.get({
    url: '/song/detail',
    data: {
      ids: id,
    }
  })
}

export function getSongUrlDao(id: number) {
  return API.get({
    url: '/song/url',
    data: {
      id,
    }
  })
}

export function getLyricDao(id: number) {
  return API.get({
    url: '/lyric',
    data: {
      id,
    }
  })
}

export function getLikelistDao(uid: number) {
  return API.get({
    url: '/likelist',
    data: {
      uid,
    }
  })
}

export function doLikeMusicDao(id:number, like:boolean) {
  return API.get({
    url: '/like',
    data: {
      id,
      like
    }
  })
}
