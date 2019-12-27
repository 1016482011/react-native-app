export const UPDATE = 'ADDPROFORMUPDATE'
export const FORMRESET = 'ADDPROFORMRESET'

// 更新状态
export const update = data => {
  return { type: UPDATE, data }
}

// 表单重置
export const formReset = data => {
  return { type: FORMRESET, data }
}
