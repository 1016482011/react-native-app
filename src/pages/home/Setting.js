import React, { Component } from 'react'
import { Image } from 'react-native'
import {
  Container,
  Content,
  View,
  Header,
  Left,
  Title,
  Body,
  ListItem,
  Right,
  Thumbnail,
  Text
} from 'native-base'
import { Button, Dialog, Paragraph, Portal } from 'react-native-paper'
import { connect } from 'react-redux'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import navigation from '../../helper/navigationService'

const userAvatar = require('../../assets/img/avatar.jpg')

const logo = require('../../assets/img/logo.png')

const Divide = () => <View style={{ height: 25 }} />

class Setting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }

  // 退出登录
  _logout = () => {
    navigation.reset('Login')
  }

  _hideDialog = () => this.setState({ visible: false })

  _showDialog = () => this.setState({ visible: true })

  render() {
    const { stateLogin } = this.props
    const { visible } = this.state
    const realName = stateLogin.userData.realName || '未知用户'
    const departName = stateLogin.userData.depertName || '未知部门'
    return (
      <Container style={{ backgroundColor: '#F1F1F1' }}>
        <Header>
          <Left>
            <Image style={{ width: 30, height: 34 }} source={logo} />
          </Left>
          <Body>
            <Title>个人中心</Title>
          </Body>
        </Header>
        <Content>
          <Divide />
          <ListItem
            avatar
            style={{ backgroundColor: '#fff', marginLeft: 0, paddingLeft: 15 }}
          >
            <Left>
              <Thumbnail small source={userAvatar} />
            </Left>
            <Body>
              <Text>{realName}</Text>
              <Text note>{departName}</Text>
            </Body>
          </ListItem>
          <Divide />
          <ListItem
            icon
            onPress={() => navigation.navigate('PasswordModify')}
            style={{
              backgroundColor: '#fff',
              marginLeft: 0,
              paddingLeft: 25
            }}
          >
            <Left>
              <FontAwesome
                name="lock"
                size={24}
                color={'#3ba283'}
                style={{ paddingRight: 12 }}
              />
            </Left>
            <Body>
              <Text>修改密码</Text>
            </Body>
            <Right>
              <FontAwesome name="angle-right" size={24} />
            </Right>
          </ListItem>
          <Divide />
          <ListItem
            icon
            onPress={this._showDialog}
            style={{
              backgroundColor: '#fff',
              marginLeft: 0,
              paddingLeft: 25
            }}
          >
            <Left>
              <AntDesign
                name="logout"
                size={18}
                color={'#3ba283'}
                style={{ paddingRight: 12 }}
              />
            </Left>
            <Body>
              <Text>退出登录</Text>
            </Body>
            <Right>
              <FontAwesome name="angle-right" size={24} />
            </Right>
          </ListItem>
        </Content>
        <Portal>
          <Dialog visible={visible} onDismiss={this._hideDialog}>
            <Dialog.Title>警告</Dialog.Title>
            <Dialog.Content>
              <Paragraph>是否退出登录？</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={this._hideDialog}>取消</Button>
              <Button onPress={this._logout}>确定</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </Container>
    )
  }
}

export default connect(state => ({
  stateLogin: state.login
}))(Setting)
