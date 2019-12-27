import _ from 'lodash'
import { UPDATE, FROMREST } from '../../actions/task/verifyPro.js'

const initialState = {
  // 问题id
  problemId: null,
  // 用户名
  userName: null,
  // 整改反馈内容
  content: null,
  // 图片
  files: [],
  // 日期
  transactDate: null
}

export default function VerifyPro(state = initialState, action) {
  const { type, data } = action
  switch (type) {
    case UPDATE:
      return _.assign({}, state, data)
    case FROMREST:
      return initialState
    case 'RESET':
      return initialState
    default:
      return state
  }
}
