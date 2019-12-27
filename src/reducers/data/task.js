import _ from 'lodash'
import { UPDATE, RESET } from '../../actions/data/task'

/**
 * 任务管理待办任务和我发的的以及选择状态
 */
const initialState = {
  myStart: [],
  myDeal: [],
  myStartSelect: {},
  myStartProList: [],
  myDealSelect: {},
  refreshSpinner: true
}

export default function ProInfos(state = initialState, action) {
  const { type, data } = action
  switch (type) {
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
