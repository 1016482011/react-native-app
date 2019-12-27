import _ from 'lodash'
import { UPDATE, FORMRESET } from '../../actions/task/noticeFeedBack.js'

const initialState = {
  id: null,
  // 登录用户单位
  createName: null,
  // 登录用户账号
  createBy: null,
  // 添加日期
  createDate: null,
  // 流程id
  noticeId: null,
  // 项目id
  projectId: null,
  // 回复通知单编号
  code: null,
  // 通知单编号
  noticeCode: null,
  // 接收单位
  receiveUnit: null,
  // 只展示
  // 项目名称
  projectName: null,
  noticeType: 1,
  taskId: null,
  model: 2
}

export default function VerifyPro(state = initialState, action) {
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
