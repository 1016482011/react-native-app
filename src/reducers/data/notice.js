import _ from 'lodash'
import { UPDATE, FORMRESET } from '../../actions/data/notice'

/**
 * 监理通知单展示状态
 */
const initialState = {
  noticeType: '',
  projectName: '',
  code: '',
  constructionUnit: '',
  cause: '',
  content: '',
  limitReplyDate: '',
  roleCode: ''
}

export default function ProInfos(state = initialState, action) {
  const { type, data } = action
  switch (type) {
    case UPDATE:
      return _.assign({}, state, data)
    case FORMRESET:
      return initialState
    case 'RESET':
      return initialState
    default:
      return state
  }
}
