export const UPDATE = 'ROLEUPDATE'
export const ROLEUSER = 'ROLEUSER'
export const ROLEPROFESSION = 'ROLEPROFESSION'

// 更新状态
export const update = data => {
  return { type: UPDATE, data }
}

// 根据用户部门划分权限
export const roleUser = data => {
  return { type: ROLEUSER, data }
}

// 根据用户角色划分权限覆盖部门权限
export const roleProfession = data => {
  return { type: ROLEPROFESSION, data }
}
