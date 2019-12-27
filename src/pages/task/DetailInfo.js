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
  View
} from 'native-base'
import { Button as PaButton } from 'react-native-paper'
import Notice from '../../components/Notice'
import ProList from '../../components/ProList'
import { noticeSubmit } from '../../helper/apis'
import { formReset } from '../../actions/task/form'
import { update } from '../../actions/data/notice'
import { getMyStart } from '../../actions/data/task'
import { update as proUpdate } from '../../actions/data/problem'
import { toastTip } from '../../helper/util'
import navigation from '../../helper/navigationService'

class Task extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: 0,
      isSubmit: false
    }
  }

  componentDidMount() {
    const { updateDispatch, taskState } = this.props
    updateDispatch(taskState)
  }

  submitForm = () => {
    const {
      taskState: state,
      formResetDispatch,
      getMyStartDispatch
    } = this.props
    if (_.isEmpty(state.constructionUnit)) {
      toastTip('施工单位不得为空')
      return
    }
    if (_.isEmpty(state.problemIds)) {
      toastTip('请选择问题后提交')
      return
    }
    if (_.isEmpty(state.limitReplyDate)) {
      toastTip('截止日期不得为空')
      return
    }
    this.setState({ isSubmit: true })
    noticeSubmit(state)
      .then(v => {
        formResetDispatch()
        this.setState({ isSubmit: false }, () => {
          getMyStartDispatch()
          navigation.popToTop()
        })
      })
      .catch(e => {
        this.setState({ isSubmit: false })
      })
  }

  render() {
    const { active, isSubmit } = this.state
    const {
      taskState,
      dataSate: { proSelectCache },
      proUpdateDispatch
    } = this.props
    const data = _.filter(proSelectCache, v => {
      return _.indexOf(taskState.problemIds, v.id) > -1
    })
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
            <Text>监理通知单</Text>
          </Button>
          <Button
            last
            style={{ width: 110 }}
            active={active === 1}
            onPress={() => this.setState({ active: 1 })}
          >
            <Text style={{ paddingLeft: 30 }}>问题列表</Text>
          </Button>
        </Segment>
        {active ? (
          <Content>
            {data.map((v, k) => {
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
          </Content>
        ) : (
          <Content>
            <Notice />
            <View padder>
              <PaButton
                loading={isSubmit}
                onPress={this.submitForm}
                dark={true}
                mode="contained"
              >
                提交
              </PaButton>
            </View>
          </Content>
        )}
      </Container>
    )
  }
}

export default connect(
  state => ({
    taskState: state.taskForm,
    dataSate: state.dataProblem
  }),
  dispatch => ({
    updateDispatch: data => dispatch(update(data)),
    formResetDispatch: data => dispatch(formReset(data)),
    proUpdateDispatch: data => dispatch(proUpdate(data)),
    getMyStartDispatch: data => dispatch(getMyStart(data))
  })
)(Task)
