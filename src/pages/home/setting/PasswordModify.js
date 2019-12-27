import React, { Component } from 'react'
import { AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Title,
  Content,
  Form,
  Item,
  Input,
  Label,
  Text
} from 'native-base'
import navigation from '../../../helper/navigationService'
import { passwordModify } from '../../../helper/apis'
import { toastTip } from '../../../helper/util'

class PasswordModify extends Component {
  constructor(props) {
    super(props)
    this.state = {
      oldPassword: '',
      newPassword: '',
      userId: '',
      isSubmit: false
    }
  }

  componentWillMount() {
    const {
      loginState: {
        userData: { id }
      }
    } = this.props
    this.setState({
      userId: id
    })
  }

  // 提交密码修改
  submitModify = () => {
    passwordModify({
      password: this.state.oldPassword,
      newpassword: this.state.newPassword,
      userId: this.state.userId
    })
      .then(async v => {
        toastTip('密码修改成功，请重新登录', 'success')
        navigation.reset('Login')
      })
      .catch(e => {
        toastTip('密码修改失败')
      })
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>密码修改</Title>
          </Body>
          <Right>
            <Button hasText transparent onPress={this.submitModify}>
              <Text>完成</Text>
            </Button>
          </Right>
        </Header>
        <Content>
          <Form>
            <Item fixedLabel>
              <Label>旧密码</Label>
              <Input
                secureTextEntry
                placeholder="请输入旧密码"
                onChangeText={oldPassword => this.setState({ oldPassword })}
              />
            </Item>
            <Item fixedLabel last>
              <Label>新密码</Label>
              <Input
                secureTextEntry
                placeholder="请输入新密码"
                onChangeText={newPassword => this.setState({ newPassword })}
              />
            </Item>
          </Form>
        </Content>
      </Container>
    )
  }
}

export default connect(state => ({
  loginState: state.login
}))(PasswordModify)
