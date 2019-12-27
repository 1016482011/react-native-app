import React, { Component } from 'react'
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
  Text,
  Item,
  Input,
  Label
} from 'native-base'
import { DOMAIN, MODELDOMAIN, ModifyServer } from '../helper/apis'

class SetServer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      domain: DOMAIN,
      modelDomain: MODELDOMAIN
    }
  }
  render() {
    const { domain, modelDomain } = this.state
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>修改线路</Title>
          </Body>
          <Right>
            <Button
              transparent
              light
              onPress={() => {
                ModifyServer(domain, modelDomain)
                this.props.navigation.goBack()
              }}
            >
              <Text>保存</Text>
            </Button>
          </Right>
        </Header>
        <Content>
          <Item fixedLabel last>
            <Label>服务地址: </Label>
            <Input
              placeholder="请输入"
              value={domain}
              onChangeText={domain => this.setState({ domain })}
            />
          </Item>
          <Item fixedLabel last>
            <Label>模型地址: </Label>
            <Input
              placeholder="请输入"
              value={modelDomain}
              onChangeText={modelDomain => this.setState({ modelDomain })}
            />
          </Item>
        </Content>
      </Container>
    )
  }
}

export default SetServer
