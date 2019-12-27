import _ from 'lodash'
import { UPDATE } from '../actions/login'

/**
 * 登录页以及用户数据状态
 */
const initialState = {
  isSubmit: false,
  userData: {},
  projectData: {},
  loginInfo: {}
}

export default function login(state = initialState, action) {
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
