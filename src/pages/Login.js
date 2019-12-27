import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  StyleSheet,
  View,
  AsyncStorage,
  Image,
  ImageBackground,
  StatusBar,
  BackHandler
} from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import { Button } from 'react-native-paper'
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { Item, Input } from 'native-base'
import { toastTip, getPermission } from '../helper/util'
import { submitData } from '../actions/login'
import { reset } from '../actions/'

const logo = require('../assets/img/loginHeader.png')
const loginBg = require('../assets/img/loginBg.jpg')

class LoginView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userName: '',
      password: '',
      isSwitchDisplay: true
    }
  }
  componentWillMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      BackHandler.exitApp()
      return false
    })
    AsyncStorage.multiRemove(['userData', 'token'])
      .then(v => {
        console.log(v)
      })
      .catch(e => {
        console.log(e)
      })
    this.props.resetDispatch()
  }
  componentDidMount() {
    getPermission().catch(() => {
      toastTip('权限请求出错')
    })

    SplashScreen.hide()
  }

  componentWillUnmount() {
    this.backHandler.remove()
  }

  // 校验表单
  verifyForm = () => {
    const { userName, password } = this.state
    if (_.isEmpty(userName)) {
      toastTip('用户名不得为空')
      return false
    }
    if (_.isEmpty(password)) {
      toastTip('密码不得为空')
      return false
    }
    return true
  }

  // 提交登录请求
  submit = () => {
    const { submitForm, navigation } = this.props
    const { userName, password } = this.state
    if (this.verifyForm()) {
      submitForm({ userName, password, navigation })
    }
  }

  render() {
    const { loginState } = this.props
    const { userName, password, isSwitchDisplay } = this.state
    return (
      <ImageBackground
        source={loginBg}
        style={{ width: '100%', height: '100%' }}
      >
        <StatusBar translucent={true} />
        <View style={{ alignItems: 'center', marginTop: '10%' }}>
          <View style={{ width: '40%' }}>
            <Image
              source={logo}
              style={{ width: '100%' }}
              resizeMode="contain"
            />
          </View>
        </View>
        <View style={{ marginTop: '5%', paddingHorizontal: '15%' }}>
          <Item>
            <Icon color="#fff" name="user-o" size={20} />
            <Input
              placeholderTextColor="#fff"
              style={styles.inputStyle}
              placeholder="请输入用户名"
              returnKeyType="next"
              value={userName}
              onChangeText={v => {
                this.setState({ userName: v })
              }}
            />
          </Item>
          <Item style={{ marginTop: 20 }}>
            <SimpleLineIcons color="#fff" name="lock" size={20} />
            <Input
              placeholderTextColor="#fff"
              style={styles.inputStyle}
              placeholder="请输入密码"
              returnKeyType="next"
              secureTextEntry
              value={password}
              onChangeText={v => {
                this.setState({ password: v })
              }}
            />
          </Item>
          {isSwitchDisplay && (
            <View style={{ marginTop: 20 }}>
              <Button
                onPress={() => {
                  this.props.navigation.navigate('SetServer')
                }}
              >
                切换线路
              </Button>
            </View>
          )}
          <View style={{ marginTop: 20 }}>
            <Button
              mode="contained"
              onPress={this.submit}
              loading={loginState.isSubmit}
            >
              登录
            </Button>
          </View>
        </View>
      </ImageBackground>
    )
  }
}

export default connect(
  state => ({
    loginState: state.login
  }),
  dispatch => ({
    submitForm: data => dispatch(submitData(data)),
    resetDispatch: data => dispatch(reset(data))
  })
)(LoginView)

const styles = StyleSheet.create({
  inputStyle: {
    color: '#fff',
    paddingLeft: 15
  }
})
