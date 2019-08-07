import modelExtend from 'dva-model-extend'
import { model } from './uitls'
import { getRecentPlayDao } from '@/services'

export default {
  namespace: 'my',
  state: {
    recentPlay: [],
  },
  effects: {
    *asyncGetRecentPlayAction({ payload }, { call, put }) {
      const { uid } = payload
      const res = yield call(getRecentPlayDao, uid)
      if (res.code === 200) {
        yield put({ type: 'updateState', payload: { recentPlay: res.allData }})
      }
    }
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  }
}
