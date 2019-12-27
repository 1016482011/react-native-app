import {
  getNotice as getNoticeData,
  getBackNotice as getBackNoticeData
} from '../../helper/apis'

export const UPDATE = 'DATANOTICEUPDATE'
export const FORMRESET = 'DATANOTICEFORMRESET'

// 得到监理通知回复单
export const getBackNotice = data => dispatch => {
  getBackNoticeData(data).then(v => {
    dispatch(update(v.obj))
  })
}

// 得到监理通知单
export const getNotice = data => dispatch => {
  getNoticeData(data).then(v => {
    dispatch(update(v.obj))
  })
}

// 状态重置
export const formReset = data => {
  return { type: FORMRESET, data }
}

// 更新状态
export const update = data => {
  return { type: UPDATE, data }
}
