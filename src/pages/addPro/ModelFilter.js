import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { TouchableOpacity } from 'react-native'
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
  View,
  Footer,
  Spinner
} from 'native-base'
import { getModelTree, MODELTYPE } from '../../helper/apis'
import { toastTip } from '../../helper/util'
import { updates } from '../../actions/data/model'
import { update as updateForm } from '../../actions/addPro/proForm'

class ModelFilter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      treeData: [],
      topTitle: [],
      itemSelect: {}
    }
  }
  componentDidMount() {
    getModelTree(MODELTYPE).then(v => {
      this.setState({ treeData: v.data, modelTreeSpinner: false })
    })
  }
  // 点击下一步触发事件
  nextStep = () => {
    const { topTitle, itemSelect } = this.state
    const { updateFormDispatch, updateDispatch } = this.props
    if (_.isEmpty(itemSelect)) {
      toastTip('请选择最小模型组', 'warning')
      return
    }
    const position = _.map(topTitle, 'value').join('-') + '-' + itemSelect.value

    const codeSelect = [itemSelect.code]
    updateFormDispatch({ position })
    updateDispatch({ codeSelect })
    this.props.navigation.navigate('AddProModeSelect')
  }
  // 点击跳过触发事件
  skipStep = () => {
    const { updateFormDispatch } = this.props
    updateFormDispatch({
      position: null,
      bimMemberId: null,
      coordinateX: null,
      coordinateY: null,
      coordinateZ: null
    })
    this.props.navigation.navigate('AddProInfos')
  }
  // 点击模型组名称触发事件
  _itemPress = v => () => {
    const { topTitle, itemSelect } = this.state
    if (v.children && v.children.length > 0) {
      this.setState({
        topTitle: topTitle.concat(v),
        itemSelect: {}
      })
    } else {
      if (Object.keys(itemSelect).length > 0) {
        if (itemSelect.code !== v.code) {
          this.setState({ itemSelect: v })
        }
      } else {
        this.setState({ itemSelect: v })
      }
    }
  }

  render() {
    const { formState } = this.props
    const { modelTreeSpinner, treeData, topTitle, itemSelect } = this.state
    const activeData =
      topTitle.length === 0 ? treeData : _.last(topTitle).children
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>
              添加 {formState.problemType === 1 ? '安全' : '质量'}
              问题
            </Title>
          </Body>
          <Right />
        </Header>
        <Content>
          {modelTreeSpinner ? (
            <Spinner />
          ) : (
            <View
              style={{
                flex: 1
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  backgroundColor: '#F5F5F5'
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ topTitle: [] })
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row'
                    }}
                  >
                    <Text
                      style={{
                        color: '#414141',
                        paddingLeft: 15,
                        paddingRight: 8,
                        lineHeight: 36,
                        fontSize: 14
                      }}
                    >
                      根节点
                    </Text>
                  </View>
                </TouchableOpacity>
                {topTitle.map((v, k) => (
                  <TouchableOpacity
                    key={k}
                    onPress={() => {
                      const arr = _.slice(topTitle, 0, k + 1)
                      this.setState({ topTitle: arr, itemSelect: {} })
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row'
                      }}
                    >
                      <Icon
                        type="FontAwesome"
                        name="angle-right"
                        style={{
                          fontSize: 24,
                          color: '#D1D1D1',
                          lineHeight: 36
                        }}
                      />
                      <Text
                        style={{
                          color: '#414141',
                          paddingLeft: 8,
                          paddingRight: 8,
                          lineHeight: 36,
                          fontSize: 14
                        }}
                      >
                        {v.value}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              <View padder>
                {activeData.map(v => (
                  <View key={v.code}>
                    <Button
                      full
                      success={v.code !== itemSelect.code}
                      info={v.code === itemSelect.code}
                      onPress={this._itemPress(v)}
                    >
                      <Text>{v.value}</Text>
                    </Button>
                    <View padder />
                  </View>
                ))}
              </View>
            </View>
          )}
        </Content>
        <Footer>
          <View
            style={{
              backgroundColor: '#ffffff',
              flex: 1,
              flexDirection: 'row'
            }}
          >
            <View style={{ width: '40%' }}>
              <Button full light style={{ height: 55 }} onPress={this.skipStep}>
                <Text> 跳过 </Text>
              </Button>
            </View>
            <View style={{ width: '60%' }}>
              <Button full style={{ height: 55 }} onPress={this.nextStep}>
                <Text> 下一步 </Text>
              </Button>
            </View>
          </View>
        </Footer>
      </Container>
    )
  }
}

export default connect(
  state => ({
    formState: state.addProForm
  }),
  dispatch => ({
    updateFormDispatch: data => dispatch(updateForm(data)),
    updateDispatch: data => dispatch(updates(data))
  })
)(ModelFilter)
