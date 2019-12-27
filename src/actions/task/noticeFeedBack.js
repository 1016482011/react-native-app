import { getBackNotice } from '../../helper/apis'

export const UPDATE = 'TASKNOTICEDEEDBACKUPDATE'
export const FORMRESET = 'TASKGETNOTICEFEEDBACKFORMRESET'

// 更新状态
export const update = data => {
  return { type: UPDATE, data }
}

// 查询监理通知回复单
export const getNoticeFeedBack = data => dispatch => {
  return getBackNotice(data).then(v => {
    dispatch(update(v.obj))
  })
}

// 表单复原
export const formReset = data => {
  return { type: FORMRESET, data }
}
