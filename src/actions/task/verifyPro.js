export const UPDATE = 'TASKVERIFYPROUPDATE'
export const TRANSACTSUBMIT = 'TASKTRANSACTSUBMIT'
export const FROMREST = 'TASKVERIFYFORMREST'

// 更新状态
export const update = data => {
  return { type: UPDATE, data }
}

// 表单状态重置
export const formRest = data => {
  return { type: FROMREST, data }
}
