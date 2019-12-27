import _ from 'lodash'
import { UPDATE, FORMRESET } from '../../actions/addPro/proForm'

/**
 * 问题提交表单状态
 */
const initialState = {
  //  1 安全问题 2 质量问题
  problemType: 1,
  // 所在位置
  position: null,
  // 构件ID
  bimMemberId: null,
  // 问题名称
  problemName: null,
  // 项目ID
  projectId: null,
  // 问题发生日期
  problemDate: null,
  // 问题描述
  problemDescription: null,
  // 填报人
  submitPerson: null,
  // 问题坐标x
  coordinateX: null,
  // 问题坐标y
  coordinateY: null,
  // 问题坐标z
  coordinateZ: null,
  // 分部
  partProject: null,
  // 子分部
  childPartProject: null,
  // 分项/楼层
  subOptionFloor: null,
  // 法向量
  vector: null
}

export default function ProSelect(state = initialState, action) {
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
