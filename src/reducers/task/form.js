import _ from 'lodash'
import { UPDATE, FORMRESET } from '../../actions/task/form.js'

/**
 * 监理通知单表单提交状态
 */
const initialState = {
  // 登录人账号
  createBy: null,
  // 项目ID
  projectId: null,
  // 施工单位名称
  constructionUnit: null,
  // 监理通知单类型 1 安全 2 质量
  noticeType: 1,
  // 事由
  cause: null,
  // 内容
  content: null,
  // 问题id集合
  problemIds: [],
  // 回复单截止日期
  limitReplyDate: null,
  // 编号
  code: 'A0.0.104',
  // 接收单位
  receiveUnit: null
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
