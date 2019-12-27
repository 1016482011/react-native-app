import { AsyncStorage } from 'react-native'
import navigation from '../helper/navigationService'
import { roleUser, roleProfession } from '../actions/role'
import { Login, queryProject } from '../helper/apis'
import { ModifyToken } from '../helper/util'

export const SUBMIT = 'LOGINSUBMIT'
export const UPDATE = 'LOGINUPDATE'

// 更新状态
export const update = data => {
  return { type: UPDATE, data }
}

// 登录
export const submitData = param => (dispatch, getState) => {
  const state = getState()
  const {
    login: { isSubmit }
  } = state
  const { userName, password } = param
  if (isSubmit) return
  dispatch(update({ isSubmit: true }))
  Login({ userName, password })
    .then(v => {
      ModifyToken(v.token)
      AsyncStorage.setItem('userData', JSON.stringify(v.obj))
      dispatch(update({ userData: v.obj }))
      dispatch(roleUser(v.obj.depOrg))
      dispatch(roleProfession(v.obj.roleCode))
      navigation.reset('Home')
    })
    .catch(e => {
      dispatch(update({ isSubmit: false }))
    })
}

export const getProject = () => dispatch => {
  queryProject()
    .then(data => {
      dispatch(update({ projectData: data.obj }))
      dispatch(update({ isSubmit: false }))
    })
    .catch(e => {
      dispatch(update({ isSubmit: false }))
    })
}
