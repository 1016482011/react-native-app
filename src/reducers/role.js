import _ from 'lodash'
import { UPDATE, ROLEUSER, ROLEPROFESSION } from '../actions/role'

const initialState = {
  HomeAddProBtn: true,
  HomeTaskMyStart: true,
  taskMyDealNavgation: 'VerifyTask',
  taskEnable: true,
  badgeEnable: true,
  problemEdit: true
}

export default function Role(state = initialState, action) {
  const { type, data } = action
  switch (type) {
    case ROLEUSER:
      let roles = initialState
      if (data === 'A05') {
        roles = {
          HomeAddProBtn: false,
          HomeTaskMyStart: false,
          taskMyDealNavgation: 'TaskSignForNotice',
          problemEdit: false
        }
      } else if (data === 'A07' || data === 'A09' || data === 'A10') {
        roles = {
          HomeAddProBtn: false,
          HomeTaskMyStart: false,
          taskMyDealNavgation: 'TaskSignForNotice',
          badgeEnable: false,
          problemEdit: false
        }
      }
      return _.assign({}, state, roles)
    case ROLEPROFESSION:
      let proRoles = {}
      if (data === 'InfoOff') {
        proRoles.taskMyDealNavgation = 'TaskSignForNotice'
      }
      return _.assign({}, state, proRoles)
    case UPDATE:
      return _.assign({}, state, data)
    case 'RESET':
      return initialState
    default:
      return state
  }
}
