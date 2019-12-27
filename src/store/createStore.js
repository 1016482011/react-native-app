import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import login from '../reducers/login'
import main from '../reducers/main'
import role from '../reducers/role'
import dataTask from '../reducers/data/task'
import dataProblem from '../reducers/data/problem'
import addProForm from '../reducers/addPro/proForm'
import dataModel from '../reducers/data/model'
import dataNotice from '../reducers/data/notice'
import taskForm from '../reducers/task/form'
import taskVerifyPro from '../reducers/task/verifyPro'
import taskNoticeFeedBack from '../reducers/task/noticeFeedBack'

const rootReducer = combineReducers({
  login,
  main,
  role,
  dataTask,
  dataProblem,
  addProForm,
  dataModel,
  taskForm,
  taskVerifyPro,
  taskNoticeFeedBack,
  dataNotice
})

const store = createStore(rootReducer, applyMiddleware(thunk))

export default store
