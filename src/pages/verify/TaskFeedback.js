import React, { Component } from 'react'
import { connect } from 'react-redux'
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
  View,
  Form,
  Picker,
  Item,
  Label,
  Textarea,
  Spinner
} from 'native-base'
import { Button as PaButton } from 'react-native-paper'
import { getProList } from '../../actions/data/task'
import ProblemDetail from '../../components/ProblemDetail'
import FeedBackDetail from '../../components/FeedBackDetail'
import {
  getProblemDetail,
  getProblemFeedBack,
  submitTransact
} from '../../helper/apis'

class TaskFeedBack extends Component {
  constructor(props) {
    super(props)
    this.state = {
      problemStatus: 3,
      proSelectDetail: {},
      proSelectFeedBack: [],
      spinner: true,
      isSubmit: false
    }
    this.form = {
      id: null,
      problemStatus: 3,
      content: null,
      inspectStatus: 1,
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
      dataSate: {
        proSelect: { id }
      },
      loginState: {
        userData: { depertName }
      }
    } = this.props
    const proDetail = await getProblemDetail({ id })
    const proFeedBack = await getProblemFeedBack({ id })
    this.setState({
      proSelectDetail: proDetail.obj || {},
      proSelectFeedBack: proFeedBack.obj || [],
      spinner: false
    })
    this.form.id = id
    this.form.userName = depertName
  }
  // 提交表单,此处在专监处存在一个问题，可无限修改问题
  submitData = () => {
    const {
      selectState: {
        myDealSelect: { businessKey }
      },
      getProListDispatch
    } = this.props
    const { isSubmit } = this.state
    if (isSubmit) return
    this.setState({ isSubmit: true })
    submitTransact(this.form)
      .then(v => {
        getProListDispatch(businessKey)
        this.setState({ isSubmit: false }, () => this.props.navigation.goBack())
      })
      .catch(e => {
        this.setState({ isSubmit: false })
      })
  }
  render() {
    const { proSelectDetail, proSelectFeedBack, spinner, isSubmit } = this.state
    const proFeedBack = proSelectFeedBack || {}
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
          <Content padder>
            <ProblemDetail
              navigation={this.props.navigation}
              proSelectDetail={proSelectDetail}
            />
            <FeedBackDetail proFeedBack={proFeedBack}>
              <View>
                <Form>
                  <Item fixedLabel last>
                    <Label>审核结果: </Label>
                    <Picker
                      mode="dropdown"
                      iosIcon={<Icon name="ios-arrow-down-outline" />}
                      placeholder="请选择"
                      placeholderStyle={{ color: '#bfc6ea' }}
                      placeholderIconColor="#007aff"
                      selectedValue={this.state.problemStatus}
                      onValueChange={v => {
                        this.setState({ problemStatus: v })
                        this.form.problemStatus = v
                        this.form.inspectStatus = v === 3 ? 1 : 2
                      }}
                    >
                      <Picker.Item label="通过" value={3} />
                      <Picker.Item label="不通过" value={1} />
                    </Picker>
                  </Item>
                  <Label style={{ lineHeight: 40, paddingLeft: 10 }}>
                    审核意见:
                  </Label>
                  <Textarea
                    rowSpan={5}
                    placeholder="请输入审核意见"
                    onChangeText={content => (this.form.content = content)}
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
            </FeedBackDetail>
          </Content>
        )}
      </Container>
    )
  }
}

export default connect(
  state => ({
    dataSate: state.dataProblem,
    loginState: state.login,
    selectState: state.dataTask
  }),
  dispatch => ({
    getProListDispatch: data => dispatch(getProList(data))
  })
)(TaskFeedBack)
