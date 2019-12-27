import React, { Component } from 'react'
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
  Content,
  Text,
  List,
  Spinner
} from 'native-base'
import ProList from '../../components/ProList'
import { update } from '../../actions/task/form'
import { update as proUpdate } from '../../actions/data/problem'
import { problemList } from '../../helper/apis'

class ProSelect extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: [],
      data: [],
      spinner: true
    }
  }
  componentDidMount() {
    this.getData()
  }
  getData = async () => {
    const {
      taskState: { noticeType, problemIds },
      proUpdateDispatch
    } = this.props
    let result = {}
    if (noticeType === 1) {
      result = await problemList({ problemType: 1, problemStatus: 0 })
    } else {
      result = await problemList({ problemType: 2, problemStatus: 0 })
    }
    proUpdateDispatch({ proSelectCache: result.obj || [] })
    this.setState({
      data: result.obj || [],
      spinner: false,
      active: problemIds
    })
  }
  render() {
    const { data, spinner } = this.state
    const { updateDispatch } = this.props
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>问题列表</Title>
          </Body>
          <Right>
            <Button
              transparent
              light
              onPress={() => {
                const { active } = this.state
                const selectPro = _.filter(
                  data,
                  v => _.indexOf(active, v.id) > -1
                )
                const content = _.join(
                  _.map(selectPro, v => v.problemDescription),
                  '\n'
                )
                console.log(content)
                updateDispatch({ problemIds: active, content })
                this.props.navigation.goBack()
              }}
            >
              <Text>保存</Text>
            </Button>
          </Right>
        </Header>
        {spinner ? (
          <Spinner />
        ) : (
          <Content>
            <List>
              {data.map((v, k) => {
                return (
                  <ProList
                    key={k}
                    noIndent={_.indexOf(this.state.active, v.id) > -1}
                    data={v}
                    onClick={() => {
                      let active = this.state.active
                      const index = _.indexOf(this.state.active, v.id)
                      active =
                        index > -1
                          ? _.pull(active, v.id)
                          : _.concat(active, [v.id])
                      this.setState({
                        active
                      })
                    }}
                  />
                )
              })}
            </List>
          </Content>
        )}
      </Container>
    )
  }
}

export default connect(
  state => ({
    dataSate: state.dataProblem,
    taskState: state.taskForm
  }),
  dispatch => ({
    updateDispatch: data => dispatch(update(data)),
    proUpdateDispatch: data => dispatch(proUpdate(data))
  })
)(ProSelect)
