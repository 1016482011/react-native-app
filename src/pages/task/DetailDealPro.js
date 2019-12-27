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
  Fab,
  Spinner,
  View
} from 'native-base'
import { format } from 'date-fns'
import Notice from '../../components/Notice'
import NoticeFeedBack from '../../components/NoticeFeedBack'
import ProList from '../../components/ProList'
import { getNotice, update } from '../../actions/data/notice'
import { getProList } from '../../actions/data/task'
import { update as proUpdate } from '../../actions/data/problem'
import { update as noticeUpdate } from '../../actions/task/noticeFeedBack'

class Task extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: 0,
      spinner: true
    }
  }
  componentDidMount() {
    this.getData().then(() => {
      this.setState({ spinner: false })
    })
  }

  getData = async () => {
    const {
      getNoticeDispatch,
      getProListDispatch,
      noticeUpdateDispatch,
      selectState: {
        myDealSelect: { businessKey }
      },
      loginState: {
        userData: { userName, depertName },
        projectData: { projectName, projectId }
      }
    } = this.props
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

  render() {
    const { active, spinner } = this.state
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
          <Button
            last
            active={active === 2}
            onPress={() => this.setState({ active: 2 })}
          >
            <Text>监理通知回复单</Text>
          </Button>
        </Segment>

        {active === 2 && (
          <Fab
            active={true}
            direction="up"
            containerStyle={{ zIndex: 99 }}
            style={{ backgroundColor: '#3ba283' }}
            position="bottomRight"
            onPress={() => this.props.navigation.navigate('TaskNoticeFeedBack')}
          >
            <Icon type="FontAwesome" name="pencil" />
          </Fab>
        )}
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
                        v.problemStatus === 1
                          ? this.props.navigation.navigate('VerifyTaskProblem')
                          : this.props.navigation.navigate('ProblemDetails')
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
    noticeUpdateDispatch: data => dispatch(noticeUpdate(data))
  })
)(Task)
