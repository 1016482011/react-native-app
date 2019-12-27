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
  Spinner,
  View
} from 'native-base'
import { getProblemDetail, getProblemFeedBack } from '../../helper/apis'
import ProblemDetail from '../../components/ProblemDetail'
import FeedBackDetail from '../../components/FeedBackDetail'

class Problem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      proSelectDetail: {},
      proSelectFeedBack: [],
      spinner: true
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
    const proFeedBack = await getProblemFeedBack({ id })
    this.setState({
      proSelectDetail: proDetail.obj || {},
      proSelectFeedBack: proFeedBack.obj || [],
      spinner: false
    })
  }

  render() {
    const { proSelectDetail, proSelectFeedBack, spinner } = this.state
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>问题详情</Title>
          </Body>
          <Right />
        </Header>
        {spinner ? (
          <Spinner />
        ) : (
          <Content style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
            <View>
              <ProblemDetail
                navigation={this.props.navigation}
                proSelectDetail={proSelectDetail}
              />
              <FeedBackDetail proFeedBack={proSelectFeedBack} />
            </View>
          </Content>
        )}
      </Container>
    )
  }
}

export default connect(state => ({
  dataSate: state.dataProblem
}))(Problem)
