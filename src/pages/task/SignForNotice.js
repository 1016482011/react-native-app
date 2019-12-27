import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
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
  Spinner,
  View,
  Footer
} from 'native-base'
import { format } from 'date-fns'
import { Button as PaButton } from 'react-native-paper'
import Notice from '../../components/Notice'
import NoticeFeedBack from '../../components/NoticeFeedBack'
import ProList from '../../components/ProList'
import { getNotice, update } from '../../actions/data/notice'
import { getProList } from '../../actions/data/task'
import { update as proUpdate } from '../../actions/data/problem'
import { update as noticeUpdate } from '../../actions/task/noticeFeedBack'
import { processComplete } from '../../helper/apis'
import { getNoticeFeedBack } from '../../actions/task/noticeFeedBack'
import { getMyDeal } from '../../actions/data/task'
import navigation from '../../helper/navigationService'

class Task extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: 0,
      spinner: true,
      bpmStatus: '1',
      confrimBtn: '签收',
      isSubmit: false
    }
  }
  componentDidMount() {
    this.getData().then(() => {
      this.setState({ spinner: false })
    })
  }

  // 取得数据
  getData = async () => {
    const {
      getNoticeDispatch,
      getProListDispatch,
      noticeUpdateDispatch,
      selectState: {
        myDealSelect: { businessKey, bpmStatus, isSign }
      },
      loginState: {
        userData: { userName, depertName },
        projectData: { projectName, projectId }
      },
      getNoticeFeedBackDispatch
    } = this.props
    this.setState({ bpmStatus, confrimBtn: isSign === 1 ? '签收' : '通过' })
    if (bpmStatus === '2') await getNoticeFeedBackDispatch({ businessKey })
    await getNoticeDispatch({ businessKey })
    await getProListDispatch(businessKey)
    noticeUpdateDispatch({
      projectName,
      createBy: userName,
      createName: depertName,
      createDate: format(new Date(), 'YYYY-MM-DD'),
      noticeId: businessKey,
      projectId
    })
  }

  // 点击签收
  _onConfirm = () => {
    const {
      selectState: {
        myDealSelect: { taskId, processInstanceId, businessKey }
      },
      loginState: {
        userData: { userName }
      },
      getMyDealDispatch
    } = this.props
    const { isSubmit } = this.state
    if (isSubmit) return
    this.setState({ isSubmit: true })
    processComplete({
      taskId,
      userName,
      processInstanceId,
      businessKey,
      model: 1
    })
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
    const { active, spinner, bpmStatus, confrimBtn, isSubmit } = this.state
    const {
      selectState: { myStartProList },
      proUpdateDispatch
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
            style={{ width: 110 }}
            first
            active={active === 0}
            onPress={() => this.setState({ active: 0 })}
          >
            <Text>监理通知单</Text>
          </Button>
          <Button
            style={{ width: 110 }}
            last
            active={active === 1}
            onPress={() => this.setState({ active: 1 })}
          >
            <Text style={{ paddingLeft: 30 }}>问题列表</Text>
          </Button>
          {bpmStatus === '2' && (
            <Button
              last
              active={active === 2}
              onPress={() => this.setState({ active: 2 })}
            >
              <Text>监理通知回复单</Text>
            </Button>
          )}
        </Segment>

        <Content>
          {spinner ? (
            <Spinner />
          ) : (
            <Content>
              {active === 0 && (
                <View>
                  <Notice />
                </View>
              )}
              {active === 1 && (
                <View>
                  {myStartProList.map((v, k) => {
                    return (
                      <ProList
                        key={k}
                        data={v}
                        onClick={() => {
                          proUpdateDispatch({ proSelect: v })
                          this.props.navigation.navigate('ProblemDetails')
                        }}
                      />
                    )
                  })}
                </View>
              )}
              {active === 2 && (
                <View>
                  <NoticeFeedBack />
                </View>
              )}
            </Content>
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
            <View style={{ width: '100%' }}>
              <PaButton
                loading={isSubmit}
                onPress={this._onConfirm}
                dark={true}
                style={{
                  height: 55,
                  justifyContent: 'center',
                  borderRadius: 0
                }}
                mode="contained"
              >
                {confrimBtn}
              </PaButton>
            </View>
          </View>
        </Footer>
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
    updateDispatch: data => dispatch(update(data)),
    getNoticeDispatch: data => dispatch(getNotice(data)),
    getProListDispatch: data => dispatch(getProList(data)),
    proUpdateDispatch: data => dispatch(proUpdate(data)),
    noticeUpdateDispatch: data => dispatch(noticeUpdate(data)),
    getNoticeFeedBackDispatch: data => dispatch(getNoticeFeedBack(data)),
    getMyDealDispatch: () => dispatch(getMyDeal())
  })
)(Task)
