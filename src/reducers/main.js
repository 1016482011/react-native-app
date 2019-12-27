import _ from 'lodash'
import { UPDATE } from '../../src/actions/index'

const initialState = {
  tabActive: 'safe',
  title: '安全管理',
  taskActive: 0
}

export default function Role(state = initialState, action) {
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
