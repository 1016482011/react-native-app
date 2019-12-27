import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Container,
  Header,
  Left,
  Body,
  Button,
  Icon,
  Title,
  Content,
  Text,
  Form,
  Item,
  Input,
  Label,
  DatePicker,
  Textarea,
  View,
  Picker,
  Footer
} from 'native-base'
import _ from 'lodash'
import { format } from 'date-fns'
import { Button as PaButton } from 'react-native-paper'
import { getMyStart } from '../../actions/data/task'
import { update, formReset } from '../../actions/task/form'
import { noticeSubmit } from '../../helper/apis'
import { toastTip } from '../../helper/util'
import navigation from '../../helper/navigationService'

const Divide = () => <View style={{ height: 25, backgroundColor: '#F5F5F9' }} />

class Notice extends Component {
  constructor(props) {
    super(props)
    this.state = {
      code: '',
      isSubmit: false
    }
  }
  componentDidMount() {
    const { loginState, updateDispatch } = this.props
    updateDispatch({
      projectId: loginState.projectData.projectId,
      createBy: loginState.userData.userName,
      roleCode: loginState.userData.roleCode
    })
  }

  componentWillUnmount() {
    const { formResetDispatch } = this.props
    formResetDispatch()
  }

  // 校验和提交表单
  submitForm = () => {
    const { state, formResetDispatch, getMyStartDispatch } = this.props
    if (_.isEmpty(state.constructionUnit)) {
      toastTip('施工单位不得为空')
      return
    }
    if (_.isEmpty(state.cause) || state.cause.length > 30) {
      toastTip('事由不得为空或者大于30字')
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
    const { state, updateDispatch, loginState } = this.props
    const { isSubmit } = this.state
    const type = `A.0.10${state.noticeType === 1 ? '4' : '1'} - `
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>监理通知单</Title>
          </Body>
        </Header>
        <Content>
          <Form>
            <Item fixedLabel last>
              <Label>编号: </Label>
              <Text>{type}</Text>
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
              <Text>{loginState.projectData.projectName}</Text>
            </Item>
            <Item fixedLabel last style={{ height: 50, paddingRight: 10 }}>
              <Label>施工单位: </Label>
              <Input
                placeholder="请输入"
                onChangeText={constructionUnit =>
                  updateDispatch({ constructionUnit })
                }
              />
            </Item>
            <Item fixedLabel last style={{ height: 50, paddingRight: 10 }}>
              <Label>监理通知单类型: </Label>
              <Picker
                mode="dropdown"
                headerStyle={{ backgroundColor: '#b95dd3' }}
                headerBackButtonTextStyle={{ color: '#fff' }}
                headerTitleStyle={{ color: '#fff' }}
                selectedValue={state.noticeType}
                onValueChange={noticeType => {
                  const noticeTypeText = `A.0.10${
                    noticeType === 1 ? '4' : '1'
                  } - `
                  updateDispatch({
                    noticeType,
                    code: `${noticeTypeText}${this.state.code}`,
                    problemIds: []
                  })
                }}
              >
                <Picker.Item label="安全文明类" value={1} />
                <Picker.Item label="质量控制类" value={2} />
              </Picker>
            </Item>
            <Item fixedLabel last />
            <Item fixedLabel last style={{ height: 50, paddingRight: 10 }}>
              <Label>选择问题: </Label>
              <Text
                onPress={() => this.props.navigation.navigate('TaskProSelect')}
              >
                {`已选择${state.problemIds.length}个问题`}
              </Text>
            </Item>
            <Label style={{ lineHeight: 40, paddingLeft: 10 }}>事由:</Label>
            <Textarea
              rowSpan={5}
              placeholder="请输入"
              onChangeText={cause => updateDispatch({ cause })}
            />
            <Item fixedLabel last />
            <Label style={{ lineHeight: 40, paddingLeft: 10 }}>内容:</Label>
            <Textarea
              rowSpan={5}
              placeholder="请输入"
              value={state.content}
              onChangeText={content => updateDispatch({ content })}
            />
            <Divide />

            <Item fixedLabel last style={{ height: 50 }}>
              <Label>回复单截止时间: </Label>

              <DatePicker
                defaultDate={new Date()}
                modalTransparent={false}
                animationType={'fade'}
                androidMode={'default'}
                placeHolderText="请选择时间"
                textStyle={{ color: '#343434', textAlign: 'left' }}
                placeHolderTextStyle={{ color: '#d3d3d3' }}
                onDateChange={time => {
                  const limitReplyDate = format(time, 'YYYY-MM-DD')
                  updateDispatch({ limitReplyDate })
                }}
              />
            </Item>

            <Item fixedLabel last>
              <Label>负责监理机构: </Label>
              <Input
                placeholder="请输入"
                onChangeText={receiveUnit => updateDispatch({ receiveUnit })}
              />
            </Item>
            <Divide />
          </Form>
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
              <Button
                full
                light
                style={{ height: 55 }}
                onPress={() => {
                  this.props.navigation.navigate('TaskDetailInfo')
                }}
              >
                <Text> 预览 </Text>
              </Button>
            </View>
            <View style={{ width: '60%' }}>
              <PaButton
                loading={isSubmit}
                onPress={this.submitForm}
                dark={true}
                style={{
                  height: 55,
                  justifyContent: 'center',
                  borderRadius: 0
                }}
                mode="contained"
              >
                提交
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
    state: state.taskForm,
    loginState: state.login
  }),
  dispatch => ({
    updateDispatch: data => dispatch(update(data)),
    formResetDispatch: data => dispatch(formReset(data)),
    getMyStartDispatch: data => dispatch(getMyStart(data))
  })
)(Notice)
