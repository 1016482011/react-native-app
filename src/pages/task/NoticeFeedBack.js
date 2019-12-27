import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import {
  Container,
  Button,
  Content,
  Text,
  Body,
  Header,
  Left,
  Icon,
  Title,
  Right,
  View,
  Footer,
  Item,
  Label,
  Input,
  Form
} from 'native-base'
import { Button as PaButton } from 'react-native-paper'
import { update, formReset } from '../../actions/task/noticeFeedBack'
import { subNoticeReply, processComplete } from '../../helper/apis'
import { toastTip } from '../../helper/util'
import { getMyDeal } from '../../actions/data/task'
import navigation from '../../helper/navigationService'

class NoticeFeedBack extends Component {
  constructor(props) {
    super(props)
    this.state = {
      code: '',
      isSubmit: false
    }
  }
  componentWillMount() {
    const {
      dataNoticeState: { code, noticeType },
      updateDispatch,
      selectState: {
        myDealSelect: { taskId }
      }
    } = this.props
    updateDispatch({ noticeCode: code, noticeType, taskId })
  }

  componentWillUnmount() {
    const { updateDispatch } = this.props
    updateDispatch({ code: null, receiveUnit: null })
  }

  submitData = () => {
    const {
      taskNoticeFeedBackState,
      selectState: { myStartProList },
      formResetDispatch,
      loginState: {
        userData: { userName }
      },
      getMyDealDispatch
    } = this.props
    const { isSubmit } = this.state
    if (isSubmit) return
    const dataShow = _.filter(myStartProList, { problemStatus: 1 })
    if (!_.isEmpty(dataShow)) {
      toastTip('有未整改的问题')
      return
    }
    if (_.isEmpty(taskNoticeFeedBackState.code)) {
      toastTip('编号不得为空')
      return
    }
    const { taskId, model } = taskNoticeFeedBackState
    this.setState({ isSubmit: true })
    subNoticeReply(taskNoticeFeedBackState)
      .then(v => {
        processComplete({ taskId, model, userName })
          .then(val => {
            formResetDispatch()
            this.setState({ isSubmit: false }, () => {
              getMyDealDispatch()
              navigation.popToTop()
            })
          })
          .catch(e => {
            this.setState({ isSubmit: false })
          })
      })
      .catch(e => {
        this.setState({ isSubmit: false })
      })
  }

  render() {
    const {
      dataNoticeState: { noticeType },
      taskNoticeFeedBackState: { projectName },
      updateDispatch
    } = this.props
    const { isSubmit } = this.state
    const noticeTypeName = noticeType === 1 ? '安全文明类' : '质量控制类'
    const type = noticeType === 1 ? 'B.54 - ' : 'B.51 - '
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>监理通知回复单</Title>
          </Body>
          <Right />
        </Header>
        <Content style={{ backgroundColor: '#F5F5F9' }}>
          <Text style={{ lineHeight: 40, paddingLeft: 10 }}>
            在提交前，请确保所有问题都已经上传整改情况
          </Text>
          <Form style={{ backgroundColor: '#ffffff' }}>
            <Item fixedLabel last>
              <Label>编号: </Label>
              <Text>B.51-</Text>
              <Input
                placeholder="请输入"
                onChangeText={code => {
                  this.setState({ code })
                  updateDispatch({ code: `${type}${code}` })
                }}
              />
            </Item>
            <Item fixedLabel last style={{ height: 50, paddingRight: 10 }}>
              <Label>工程名称: </Label>
              <Text>{projectName}</Text>
            </Item>
            <Item fixedLabel last style={{ height: 50, paddingRight: 10 }}>
              <Label>监理单位: </Label>
              <Input
                placeholder="请输入"
                onChangeText={receiveUnit => updateDispatch({ receiveUnit })}
              />
            </Item>
            <Item fixedLabel last style={{ height: 50, paddingRight: 10 }}>
              <Label>监理通知单回复类型: </Label>
              <Text>{noticeTypeName}</Text>
            </Item>
          </Form>
        </Content>
        <Footer>
          <View
            padder
            style={{
              backgroundColor: '#ffffff',
              flex: 1
            }}
          >
            <PaButton
              loading={isSubmit}
              onPress={this.submitData}
              dark={true}
              mode="contained"
            >
              提交
            </PaButton>
          </View>
        </Footer>
      </Container>
    )
  }
}

export default connect(
  state => ({
    taskNoticeFeedBackState: state.taskNoticeFeedBack,
    dataNoticeState: state.dataNotice,
    selectState: state.dataTask,
    loginState: state.login
  }),
  dispatch => ({
    updateDispatch: data => dispatch(update(data)),
    formResetDispatch: data => dispatch(formReset(data)),
    getMyDealDispatch: () => dispatch(getMyDeal())
  })
)(NoticeFeedBack)
