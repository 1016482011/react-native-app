import React, { Component } from 'react'
import { connect } from 'react-redux'
import { WebView } from 'react-native'
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
  View
} from 'native-base'
import {
  getProblemDetail,
  MODELDOMAIN,
  MODELTYPE,
  MODELGROUP
} from '../../helper/apis'

// const html = require('@/assets/html/modelView.html')

class ModelView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tips: '获取模型信息中',
      proSelectDetail: {}
    }
  }
  componentDidMount() {
    this.getData()
  }
  getData = async () => {
    const {
      dataSate: {
        proSelect: { id }
      }
    } = this.props
    const proDetail = await getProblemDetail({ id })

    this.setState({
      proSelectDetail: proDetail.obj || {},
      tips: '加载资源中'
    })
  }
  render() {
    const { proSelectDetail } = this.state
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
          <Text>位置: {proSelectDetail.position}</Text>
          <Text>{this.state.tips}</Text>
          <WebView
            ref="webView"
            style={{ width: '100%', height: '100%' }}
            source={{ uri: 'file:///android_asset/html/modelView.html' }}
            // source={html}
            scalesPageToFit={false}
            renderError={e => console.warnning(e)}
            onMessage={event => {
              //监听html发送过来的数据
              const message = JSON.parse(event.nativeEvent.data)
              if (message.type === 4) {
                this.setState({ tips: null })
              } else {
                this.setState({ tips: message.msg })
              }
            }}
            onLoad={() =>
              this.refs.webView.postMessage(
                JSON.stringify({
                  domain: MODELDOMAIN,
                  data: proSelectDetail,
                  modelType: MODELTYPE,
                  modelGroup: MODELGROUP
                })
              )
            }
          />
        </View>
      </Container>
    )
  }
}

export default connect(state => ({
  dataSate: state.dataProblem
}))(ModelView)
