import modelExtend from 'dva-model-extend'
import { model } from './uitls'

export default modelExtend(model, {
  namespace: 'counter',
  state: {
    num: 0,
  },
  effects: {
    *asyncAdd({}, {put}) {
      yield put({ type: 'ADD', payload: {}})
    }
  },
  reducers: {
    ADD(state, {}) {
      return {
        ...state,
        num: state.num + 1
      }
    },
    ADD2(state, { payload }) {
      return {
        ...state,
        num: state.num + payload.num
      }
    },
    MINUS(state, {}) {
      return {
        ...state,
        num: state.num - 1
      }
    },
  }
})
