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
  View
} from 'native-base'
import Notice from '../../components/Notice'
import ProList from '../../components/ProList'
import { update } from '../../actions/data/problem'
import { getNotice } from '../../actions/data/notice'
import { getProList } from '../../actions/data/task'

class Task extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: 0,
      spinner: true
    }
  }
  componentDidMount() {
    this.getData().then(v => {
      this.setState({ spinner: false })
    })
  }

  getData = async () => {
    const {
      getNoticeDispatch,
      getProListDispatch,
      selectState: {
        myStartSelect: { businessKey }
      }
    } = this.props
    await getNoticeDispatch({ businessKey })
    await getProListDispatch(businessKey)
  }

  render() {
    const { active, spinner } = this.state
    const {
      selectState: { myStartProList },
      updateDispatch
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
        {spinner ? (
          <Spinner />
        ) : (
          <Content>
            {active ? (
              <View>
                {myStartProList.map((v, k) => {
                  return (
                    <ProList
                      key={k}
                      data={v}
                      onClick={() => {
                        updateDispatch({ proSelect: v })
                        this.props.navigation.navigate('ProblemDetails')
                      }}
                    />
                  )
                })}
              </View>
            ) : (
              <View>
                <Notice />
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
    selectState: state.dataTask
  }),
  dispatch => ({
    updateDispatch: data => dispatch(update(data)),
    getNoticeDispatch: data => dispatch(getNotice(data)),
    getProListDispatch: data => dispatch(getProList(data))
  })
)(Task)
