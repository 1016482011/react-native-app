import _ from 'lodash'
import { UPDATE } from '../../actions/data/model'

/**
 * 模型展示数据
 */
const initialState = {
  codeSelect: []
}

export default function ProInfos(state = initialState, action) {
  const { type, data } = action
  switch (type) {
    case UPDATE:
      return _.assign({}, state, data)
    case 'RESET':
      return initialState
    default:
      return state
  }
}
