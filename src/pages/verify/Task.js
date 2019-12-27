import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Container,
  Button,
  Segment,
  Content,
  Text,
  Body,
  Header,
  Left,
  Icon,
  Title,
  Right,
  Form,
  Picker,
  View,
  Item,
  Label,
  Textarea,
  Spinner
} from 'native-base'
import _ from 'lodash'
import { Button as PaButton } from 'react-native-paper'
import ProList from '../../components/ProList'
import { getProList } from '../../actions/data/task'
import Notice from '../../components/Notice'
import { update as proUpdate } from '../../actions/data/problem'
import { getNoticeFeedBack } from '../../actions/task/noticeFeedBack'
import { getNotice } from '../../actions/data/notice'
import NoticeFeedBack from '../../components/NoticeFeedBack'
import { processComplete } from '../../helper/apis'
import { toastTip } from '../../helper/util'
import { getMyDeal } from '../../actions/data/task'
import navigation from '../../helper/navigationService'

class Task extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: 0,
      model: 2,
      spinner: true,
      isSubmit: false
    }
    // 表单数据
    this.formState = {
      taskId: null,
      model: 2,
      reason: null,
      userName: null
    }
  }
  componentWillMount() {
    this.getData().then(() => {
      this.setState({ spinner: false })
    })
  }

  getData = async () => {
    const {
      getNoticeFeedBackDispatch,
      getNoticeDispatch,
      getProListDispatch,
      selectState: {
        myDealSelect: { businessKey, taskId }
      },
      loginState
    } = this.props
    this.formState.taskId = taskId
    await getNoticeFeedBackDispatch({ businessKey })
    await getNoticeDispatch({ businessKey })
    await getProListDispatch(businessKey)
    this.formState.userName = loginState.userData.userName
  }

  // 提交监理通知回复单意见
  submitData = () => {
    const {
      selectState: { myStartProList },
      getMyDealDispatch
    } = this.props
    const { isSubmit } = this.state
    if (isSubmit) return
    if (_.some(myStartProList, { problemStatus: 2 })) {
      toastTip('存在未审核问题')
      return
    }
    if (
      _.some(myStartProList, { problemStatus: 1 }) &&
      this.formState.model === 2
    ) {
      toastTip('存在未通过问题')
      return
    }
    if (
      _.every(myStartProList, { problemStatus: 3 }) &&
      this.formState.model === 3
    ) {
      toastTip('问题已全部通过')
      return
    }
    this.setState({ isSubmit: true })
    processComplete(this.formState)
      .then(v => {
        this.setState({ isSubmit: false }, () => {
          getMyDealDispatch()
          navigation.popToTop()
        })
      })
      .catch(e => {
        this.setState({ isSubmit: false })
      })
  }

  render() {
    const { active, spinner, isSubmit } = this.state
    const {
      proUpdateDispatch,
      selectState: { myStartProList }
    } = this.props
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>任务详情</Title>
          </Body>
          <Right />
        </Header>
        <Segment>
          <Button
            first
            active={active === 0}
            onPress={() => this.setState({ active: 0 })}
          >
            <Text>监理通知回复单</Text>
          </Button>
          <Button
            first
            active={active === 1}
            onPress={() => this.setState({ active: 1 })}
          >
            <Text>监理通知单</Text>
          </Button>
          <Button
            last
            style={{ width: 150 }}
            active={active === 2}
            onPress={() => this.setState({ active: 2 })}
          >
            <Text style={{ paddingLeft: 50 }}>问题列表</Text>
          </Button>
        </Segment>
        {spinner ? (
          <Spinner />
        ) : (
          <Content>
            {active === 0 && (
              <View>
                <View>
                  <NoticeFeedBack />
                  <Form>
                    <Item fixedLabel last>
                      <Label>审核结果: </Label>
                      <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="ios-arrow-down-outline" />}
                        placeholder="请选择"
                        placeholderStyle={{ color: '#bfc6ea' }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.model}
                        onValueChange={v => {
                          this.formState.model = v
                          this.setState({ model: v })
                        }}
                      >
                        <Picker.Item label="通过" value={2} />
                        <Picker.Item label="不通过" value={3} />
                      </Picker>
                    </Item>
                    <Label style={{ lineHeight: 40, paddingLeft: 10 }}>
                      审核意见:
                    </Label>
                    <Textarea
                      rowSpan={5}
                      placeholder="请输入审核意见"
                      onChangeText={reason => (this.formState.reason = reason)}
                    />
                  </Form>
                  <View padder>
                    <PaButton
                      loading={isSubmit}
                      onPress={this.submitData}
                      dark={true}
                      mode="contained"
                    >
                      提交
                    </PaButton>
                  </View>
                </View>
              </View>
            )}
            {active === 1 && (
              <View>
                <Notice />
              </View>
            )}
            {active === 2 && (
              <View>
                {myStartProList.map((v, k) => {
                  return (
                    <ProList
                      key={k}
                      data={v}
                      onClick={() => {
                        proUpdateDispatch({ proSelect: v })
                        this.props.navigation.navigate('VerifyTaskFeedback')
                      }}
                    />
                  )
                })}
              </View>
            )}
          </Content>
        )}
      </Container>
    )
  }
}

export default connect(
  state => ({
    selectState: state.dataTask,
    loginState: state.login
  }),
  dispatch => ({
    proUpdateDispatch: data => dispatch(proUpdate(data)),
    getNoticeFeedBackDispatch: data => dispatch(getNoticeFeedBack(data)),
    getProListDispatch: data => dispatch(getProList(data)),
    getNoticeDispatch: data => dispatch(getNotice(data)),
    getMyDealDispatch: () => dispatch(getMyDeal())
  })
)(Task)
