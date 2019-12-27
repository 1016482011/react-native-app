import React from 'react'
import { AsyncStorage } from 'react-native'
import { View } from 'native-base'
import { connect } from 'react-redux'
import _ from 'lodash'
import navigation from '../helper/navigationService'
import JPushModule from 'jpush-react-native'
import { ModifyToken } from '../helper/util'
import { update } from '../actions/login'

class Wait extends React.Component {
  componentDidMount() {
    JPushModule.initPush()
    JPushModule.notifyJSDidLoad(resultCode => {
      if (resultCode === 0) {
        console.log(resultCode)
      }
    })
    this.loaddData()
      .then(v => {
        navigation.reset(v)
      })
      .catch(e => {
        navigation.reset('Login')
      })
  }
  loaddData = async () => {
    const { update } = this.props
    const infos = await AsyncStorage.multiGet(['userData', 'token'])
    const userData = JSON.parse(infos[0][1])
    update({ userData })
    const token = infos[1][1]
    ModifyToken(token)
    return _.isEmpty(token) || _.isEmpty(userData) ? 'Login' : 'Home'
  }
  render() {
    return <View style={{ flex: 1 }} />
  }
}

export default connect(
  state => ({
    state: state
  }),
  { update }
)(Wait)
