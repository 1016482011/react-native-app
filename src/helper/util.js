import axios from 'axios'
import qs from 'qs'
import { Toast } from 'native-base'
import { PermissionsAndroid, AsyncStorage } from 'react-native'
import navigationService from './navigationService'

let token = null

export const ModifyToken = t => {
  token = t
  AsyncStorage.setItem('token', t)
}

export const post = (url, param) => {
  return new Promise((resolve, reject) => {
    axios
      .post(url, qs.stringify(param), { timeout: 20000, headers: { token } })
      .then(response => {
        if (response.status !== 200) {
          toastTip('网络错误', 'danger')
          reject(response.status)
          return
        }
        if (
          response.data.errorCode === 801 ||
          response.data.errorCode === 802
        ) {
          toastTip('身份验证错误')
          reject(response.data)
          navigationService.navigate('Login')
          return
        }
        if (response.data.success) {
          resolve(response.data)
        } else {
          toastTip(response.data.msg, 'danger')
          reject(response.data.msg)
        }
      })
      .catch(function(error) {
        console.log('error')
        console.log(error)
        error.request._response === 'timeout'
          ? toastTip('请求超时', 'danger')
          : toastTip('网络错误', 'danger')
        reject(error)
      })
  })
}

export const get = (url, param) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url, { timeout: 10000 })
      .then(function(response) {
        if (response.status === 200) {
          resolve(response.data)
        } else {
          toastTip('网络错误', 'danger')
          reject(response.status)
        }
      })
      .catch(function(error) {
        toastTip('网络错误', 'danger')
        reject(error)
      })
  })
}

export const picUpload = (url, id, files) => {
  let parameters = new FormData()
  parameters.append('entityId', id)
  files.map((i, index) => {
    parameters.append('file', {
      uri: i,
      type: 'multipart/form-data',
      name: `${index}.jpg`
    })
  })
  return fetch(url, {
    mode: 'cors',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data;boundary=123',
      token
    },
    body: parameters
  })
}

export const toastTip = (text, type) => {
  Toast.show({
    text: text,
    buttonText: '确认',
    type: type || 'danger',
    duration: 2000
  })
}

export const getPermission = async () => {
  const grantedCamera = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CAMERA
  )
  if (grantedCamera === PermissionsAndroid.RESULTS.GRANTED) {
    console.log('ok')
  } else {
    toastTip('你将无法使用摄像功能')
  }

  const grantedStore = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
  )
  if (grantedStore === PermissionsAndroid.RESULTS.GRANTED) {
    console.log('ok')
  } else {
    toastTip('你将无法使用存储功能')
  }
}
