import _ from 'lodash'
import { post, get, picUpload } from './util'

// let DOMAIN = 'http://192.168.0.47:8080/snaker'
let IP = 'http://58.208.85.42'
let DOMAIN = `${IP}:8002`
let MODELDOMAIN = `${IP}:4000`

// const MODELTYPE = 'central-road'
// const MODELGROUP = ['old-gw.ifc.bin', 'new-gw.ifc.bin', 'road.ifc.bin']
const MODELTYPE = 'house'
const MODELGROUP = ['ar.ifc.bin', 'st.ifc.bin', 'MQ-YMJ.ifc.bin  ']

const ModifyServer = (domainServer, modelServer) => {
  DOMAIN = domainServer
  MODELDOMAIN = modelServer
}

export { DOMAIN, MODELDOMAIN, MODELTYPE, MODELGROUP, ModifyServer }

// 登录api
export const Login = param => {
  return post(`${DOMAIN}/mobile/app.do?login`, param)
}

// 请求项目信息
export const queryProject = () => {
  return post(`${DOMAIN}/mobile/app.do?queryProject`)
}

//请求模型树
export const getModelTree = type => {
  return get(`${MODELDOMAIN}/api/code_rule/${type}/tree`)
}

// 提交问题
export const submitPro = param => {
  return post(`${DOMAIN}/mobile/app.do?doAddProblem`, param)
}

// 上传图片
export const submitPic = (id, files) => {
  return picUpload(`${DOMAIN}/mobile/app.do?uploadFiles`, id, files)
}

// 修改密码
export const passwordModify = param => {
  return post(`${DOMAIN}/mobile/app.do?updatePwd`, param)
}

// 条件获取问题列表,新建0，待整改1，待通过2，已通过3
export const problemList = param => {
  return post(`${DOMAIN}/mobile/app.do?getProblemList`, param)
}

// 提交监理通知单
export const noticeSubmit = param => {
  return post(`${DOMAIN}/mobile/app.do?submit`, param)
}

// 我发起的流程
export const myInitiatingProcess = param => {
  return post(`${DOMAIN}/mobile/app.do?myInitiatingProcess`, param)
}

// 待办的流程
export const myPendingTask = param => {
  return post(`${DOMAIN}/mobile/app.do?myPendingTask`, param)
}

// 监理通知回复单
export const getBackNotice = param => {
  const params = _.assign({}, param, { type: 2 })
  return post(`${DOMAIN}/mobile/app.do?getSupervision`, params)
}

// 监理通知单
export const getNotice = param => {
  const params = _.assign({}, param, { type: 1 })
  return post(`${DOMAIN}/mobile/app.do?getSupervision`, params)
}

// 请求问题详情
export const getProblemDetail = param => {
  return post(`${DOMAIN}/mobile/app.do?getProblem`, param)
}

// 请求问题反馈
export const getProblemFeedBack = param => {
  return post(`${DOMAIN}/mobile/app.do?getTransactList`, param)
}

// 添加整改反馈-问题状态由待通过转变为待审核
export const addTransactReject = param => {
  const params = _.assign({}, param, { problemStatus: 1 })
  return post(`${DOMAIN}/mobile/app.do?addTransact`, params)
}

// 添加整改反馈-问题状态由待审核转变为待通过
export const addTransact = param => {
  const params = _.assign({}, param, { problemStatus: 2 })
  return post(`${DOMAIN}/mobile/app.do?addTransact`, params)
}

// 添加整改反馈-问题状态由待通过转变为通过
export const addTransactPass = param => {
  const params = _.assign({}, param, { problemStatus: 3 })
  return post(`${DOMAIN}/mobile/app.do?addTransact`, params)
}

// 提交监理通知回复单
export const subNoticeReply = param => {
  return post(`${DOMAIN}/mobile/app.do?subNoticeReply`, param)
}

// 提交问题审核
export const submitTransact = param => {
  return post(`${DOMAIN}/mobile/app.do?submitTransact`, param)
}

// 流程 - 审核流程
export const processComplete = param => {
  return post(`${DOMAIN}/mobile/app.do?processComplete`, param)
}

// 删除问题
export const delProblem = param => {
  return post(`${DOMAIN}/mobile/app.do?delProblem`, { id: param })
}

// 修改问题
export const updataProblem = param => {
  return post(`${DOMAIN}/mobile/app.do?updataProblem`, param)
}

// 删除文件
export const delFile = (param, id) => {
  return post(`${DOMAIN}/mobile/app.do?delFiles`, { files: param, id })
}

// 审核监理通知回复单时修改所有的问题状态
export const updataProblemList = id => {
  return post(`${DOMAIN}/mobile/app.do?updataProblemList`, { id })
}

// // 获取问题和任务数量
// export const getCount = param => {
//   return post(`${DOMAIN}/mobile/app.do?getCount`, param)
// }
