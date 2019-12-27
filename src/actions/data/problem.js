import { problemList } from '../../helper/apis'

export const UPDATE = 'DATAPROBLEMUPDATE'
export const RESET = 'PROBLEMRERESET'
export const SORTBYTIME = 'PROBLEMSORTBYTIME'

// 更新状态
export const update = data => {
  return { type: UPDATE, data }
}

// 请求安全问题列表
export const getSafePro = data => (dispatch, getState) => {
  const state = getState()
  const {
    login: {
      userData: { depOrg }
    }
  } = state
  dispatch(update({ safeSpinner: true }))
  return problemList({
    problemType: 1,
    orgCode: depOrg,
    pageNum: 0,
    problemStatus: null,
    sort: 'desc'
  })
    .then(v => {
      dispatch(update({ safe: v.obj, safeSpinner: false, safeCache: v.obj }))
    })
    .catch(e => {
      dispatch(update({ safe: [], safeSpinner: false, safeCache: [] }))
    })
}

// 请求质量问题列表
export const getQulityPro = data => (dispatch, getState) => {
  const state = getState()
  const {
    login: {
      userData: { depOrg }
    }
  } = state
  dispatch(update({ qualitySpinner: true }))
  return problemList({
    problemType: 2,
    orgCode: depOrg,
    pageNum: 0,
    problemStatus: null,
    sort: 'desc'
  })
    .then(v => {
      dispatch(
        update({
          quality: v.obj,
          qualityCache: v.obj,
          qualitySpinner: false
        })
      )
    })
    .catch(e => {
      dispatch(
        update({
          quality: [],
          qualitySpinner: false,
          qualityCache: []
        })
      )
    })
}

// 按时间排序
export const sortByTime = data => {
  return { type: SORTBYTIME, data: data }
}

// 状态重置
export const reset = data => {
  return { type: RESET, data: data }
}
