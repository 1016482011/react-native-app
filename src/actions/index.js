export const HOMETABACTIVE = 'MAINHOMETABACTIVE'
export const UPDATE = 'MAINUPDATE'

// 状态还原
export const reset = data => {
  return { type: 'RESET', data }
}

// 更新状态
export const update = data => {
  return { type: UPDATE, data }
}
