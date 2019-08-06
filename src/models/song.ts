import Taro from '@tarojs/taro'
import modelExtend from 'dva-model-extend'
import { model } from './uitls'
import { getSongDetailDao, getSongUrlDao, getLyricDao, getLikelistDao, doLikeMusicDao, } from '@/services'
import {parse_lrc} from '@/utils'

export default modelExtend(model, {
  namespace: 'song',
  state: {
    canPlayList: [],
    currentSongId: '',
    currentSongInfo: {
      id: 0,
      name: '',
      ar: [],
      al: {
        picUrl: '',
        name: ''
      },
      url: '',
      lrcInfo: '',
      dt: 0, // 总时长，ms
      st: 0 // 是否喜欢
    },
    currentSongIndex: 0,
    playMode: 'loop',
    likeMusicList: [],
    isPlaying: false,
    recentTab: 0
  },
  effects: {
    *getSongInfoAction({ payload }, { call, put }) {
      const { id } = payload
      let [songDetail, songUrl, lyric, ] = yield [call(getSongDetailDao, id), call(getSongUrlDao, id), call(getLyricDao, id), ]
      const lrc = parse_lrc(lyric.lrc && lyric.lrc.lyric ? lyric.lrc.lyric : '');

      let songInfo = {
        ...songDetail.songs[0],
        ...{url: songUrl.data[0].url, lrcInfo: { lrclist: lrc.now_lrc, scroll: lrc.scroll ? 1 : 0 }}
      }
      yield put({ type: 'updateCurrentSong', payload: { currentSongInfo: songInfo }})
    },
    *getLikelistAction({ payload }, { call, put }) {
      const { id } = payload
      let res = yield call(getLikelistDao, id)
      yield put({ type: 'updateState', payload: { likeMusicList: res.ids }})
    },
    *doLikeMusicAction({ payload, }, { call, put }) {
      const { id, like } = payload
      let res = yield call(doLikeMusicDao, id, like)
      if (res.code === 200) {
        yield put({ type: 'setLikeMusic', payload})
      }
    },
  },
  reducers: {
    updateCurrentSong(state, {payload}) {
      const { currentSongInfo } = payload
      let currentSongIndex = state.canPlayList.findIndex(item => item.id === currentSongInfo.id)
      state.canPlayList.map((item, index) => {
        item.current = false
        if (currentSongIndex === index) {
          item.current = true
        }
        return item
      })
      return {
        ...state,
        currentSongInfo,
        currentSongIndex,
        canPlayList: state.canPlayList
      }
    },
    setLikeMusic(state, {payload}) {
      const { like, id } = payload
      let list: Array<number> = []
      if (like) {
        list = state.likeMusicList.concat([id])
      } else {
        state.likeMusicList.forEach((item) => {
          if (item !== id) list.push(item)
        })
      }
      return {
        ...state,
        likeMusicList: list
      }
    },
    // 播放单曲
    playSingle(state, {payload}) {
      const {song} = payload
      let currentSongIndex = state.canPlayList.findIndex(item => item.id === song.id)
      if (currentSongIndex > -1) {
        return {
          ...state,
          currentSongIndex
        }
      } else {
        let canPlayList = state.canPlayList
        canPlayList.unshift(song)
        return {
          ...state,
          canPlayList,
          currentSongIndex: 0,
        }
      }
    },
    playAll(state, {payload}) {
      const {list} = payload
      const tempList = list.map((item) => {
        let temp: any = {}
        // 兼容接口
        if (item.song) {
          temp.name = item.song.name
          temp.id = item.song.id
          temp.ar = item.song.ar
          temp.al = item.song.al
          temp.copyright = item.song.copyright
          temp.st = item.song.st
        } else {
          temp.name = item.name
          temp.id = item.id
          temp.ar = item.ar
          temp.al = item.al
          temp.copyright = item.copyright
          temp.st = item.st
        }
        return temp
      })
      const canPlayList = tempList.filter((item) => {
        return item.st !== -200
      })
      // let currentSongIndex = list.findIndex(item => item.id === song.id)
      return {
        ...state,
        canPlayList,
        currentSongIndex: 0,
      }
    }
  }
})
