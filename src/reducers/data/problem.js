import _ from 'lodash'
import { UPDATE, RESET, SORTBYTIME } from '../../actions/data/problem'

/**
 * 安全质量问题数据状态
 */
const initialState = {
  safe: [],
  quality: [],
  proSelect: {},
  proSelectDetail: {},
  proSelectFeedBack: [],
  safeSpinner: true,
  qualitySpinner: true
}

export default function ProInfos(state = initialState, action) {
  const { type, data } = action
  switch (type) {
    case SORTBYTIME:
      let arr = []
      let stateSort = state
      if (data === 'safe') {
        arr = _.reverse(state.safe)
        stateSort = _.assign({}, state, { safe: arr })
      } else {
        arr = _.reverse(state.quality)
        stateSort = _.assign({}, state, { quality: arr })
      }
      return stateSort
    case UPDATE:
      return _.assign({}, state, data)
    case RESET:
      return initialState
    case 'RESET':
      return initialState
    default:
      return state
  }
}
