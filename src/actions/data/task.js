import {
  myInitiatingProcess,
  myPendingTask,
  problemList
} from '../../helper/apis'
import _ from 'lodash'
export const UPDATE = 'DATATASKUPDATE'
export const GETMYSTART = 'DATAGETMYSTART'
export const GETMYDEAL = 'DATAGETMYDEAL'
export const GETPROLIST = 'DATAGETPROLIST'
export const RESET = 'DATATASKRESET'

// 更新状态
export const update = data => {
  return { type: UPDATE, data }
}

// 重置状态
export const reset = data => {
  return { type: RESET, data }
}

// 请求我发的数据
export const getMyStart = () => (dispatch, getState) => {
  const state = getState()
  const userId = state.login.userData.userName
  dispatch(update({ refreshSpinner: true }))
  return myInitiatingProcess({ userId })
    .then(v => {
      const dataArr = _.reverse(v.obj)
      dispatch(update({ myStart: dataArr, refreshSpinner: false }))
    })
    .catch(e => {
      dispatch(update({ myStart: [], refreshSpinner: false }))
    })
}

// 请求我待办的数据
export const getMyDeal = () => (dispatch, getState) => {
  const state = getState()
  const userId = state.login.userData.userName
  dispatch(update({ refreshSpinner: true }))
  return myPendingTask({ userId })
    .then(v => {
      const dataArr = _.reverse(v.obj)
      dispatch(update({ myDeal: dataArr, refreshSpinner: false }))
    })
    .catch(e => {
      dispatch(update({ myDeal: [], refreshSpinner: false }))
    })
}

// 请求我发起的监理通知单问题
export const getProList = data => dispatch => {
  return problemList({ supervisionNoticeReceiptId: data }).then(v => {
    dispatch(update({ myStartProList: v.obj }))
  })
}
