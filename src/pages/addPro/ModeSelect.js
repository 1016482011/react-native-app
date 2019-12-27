import React, { Component } from 'react'
import { WebView } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Title,
  Text,
  View,
  Footer
} from 'native-base'
import { update } from '../../actions/addPro/proForm'
import { MODELDOMAIN, MODELTYPE, MODELGROUP } from '../../helper/apis'
import { toastTip } from '../../helper/util'

// const html = require('@/assets/html/model.html')

class ModelSelect extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tips: '请求资源中'
    }
  }

  // 监听html发送过来的数据
  _onmessage = event => {
    const { updateDispatch } = this.props
    const message = JSON.parse(event.nativeEvent.data)
    if (message.type === 2) {
      updateDispatch(
        _.assign(
          {},
          {
            bimMemberId: message.msg[1],
            vector: JSON.stringify(message.msg[2])
          },
          {
            coordinateX: message.msg[0].x,
            coordinateY: message.msg[0].y,
            coordinateZ: message.msg[0].z
          }
        )
      )
    } else if (message.type === 4) {
      this.setState({ tips: null })
    } else {
      this.setState({ tips: message.msg })
    }
  }

  // 点击下一步触发函数
  _nextStep = () => {
    const { formState } = this.props
    if (_.isNull(formState.bimMemberId)) {
      toastTip('请选择模型', 'warning')
    } else {
      this.props.navigation.navigate('AddProInfos')
    }
  }

  // webview加载完成之后触发函数
  _webViewOnLoad = () => {
    const { codeSelect } = this.props
    this.refs.webView.postMessage(
      JSON.stringify({
        domain: MODELDOMAIN,
        data: codeSelect,
        modelType: MODELTYPE,
        modelGroup: MODELGROUP
      })
    )
  }

  render() {
    const { formState } = this.props
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>查看模型</Title>
          </Body>
          <Right />
        </Header>
        <View style={{ flex: 1 }}>
          <View>
            <Text>位置: {formState.position}</Text>
            <Text>{this.state.tips}</Text>
          </View>
          <WebView
            ref="webView"
            style={{ width: '100%', height: '100%' }}
            // source={html}
            source={{ uri: 'file:///android_asset/html/model.html' }}
            scalesPageToFit={false}
            renderError={e => console.warnning(e)}
            onMessage={this._onmessage}
            onLoad={this._webViewOnLoad}
          />
        </View>
        <Footer>
          <View
            padder
            style={{
              backgroundColor: '#ffffff',
              flex: 1
            }}
          >
            <Button full style={{ height: 38 }} onPress={this._nextStep}>
              <Text> 下一步 </Text>
            </Button>
          </View>
        </Footer>
      </Container>
    )
  }
}

export default connect(
  state => ({
    codeSelect: state.dataModel.codeSelect,
    formState: state.addProForm
  }),
  dispatch => ({
    updateDispatch: data => dispatch(update(data))
  })
)(ModelSelect)
