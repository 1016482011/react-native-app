import React, { Component } from 'react'
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image
} from 'react-native'
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
  Footer,
  View,
  Form,
  Item,
  Input,
  Label,
  DatePicker,
  Textarea
} from 'native-base'
import { Button as PaButton, TouchableRipple } from 'react-native-paper'
import { connect } from 'react-redux'
import _ from 'lodash'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { format } from 'date-fns'
import ImagePicker from 'react-native-image-picker'
import { update, formReset } from '../../actions/addPro/proForm'
import { getQulityPro, getSafePro } from '../../actions/data/problem'
import { submitPro, submitPic } from '../../helper/apis'
import { toastTip } from '../../helper/util'
import navigation from '../../helper/navigationService'

const { width } = Dimensions.get('window')
const ImgWidth = (width - 32) / 4 - 10

class ImgItem extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.onImgClick(this.props.imgUrl)
        }}
      >
        <Image
          style={{
            width: ImgWidth,
            height: ImgWidth,
            marginLeft: 5,
            marginRight: 5,
            marginBottom: 10
          }}
          source={{ uri: this.props.imgUrl }}
        />
      </TouchableOpacity>
    )
  }
}

class Infos extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imgs: [],
      isSubmit: false
    }
  }

  componentWillMount() {
    const { updateDispatch, loginState } = this.props
    updateDispatch({ projectId: loginState.projectData.projectId })
  }

  // 组件卸载时清空状态
  componentWillUnmount() {
    const { updateDispatch } = this.props
    updateDispatch({
      problemName: null,
      problemDate: null,
      submitPerson: null,
      problemDescription: null
    })
  }

  // 添加图片
  addPicDispatch = data => {
    const imgs = this.state.imgs.concat([data])
    this.setState({ imgs })
  }

  // 点击拍照触发事件
  takePic = () => {
    const addPicDispatch = this.addPicDispatch
    const options = {
      quality: 0.6,
      title: '请选择',
      takePhotoButtonTitle: '拍一张',
      cancelButtonTitle: '取消',
      chooseFromLibraryButtonTitle: '从相册中选择',
      storageOptions: {
        skipBackup: true
      }
    }
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.error) {
        toastTip('图片选取错误')
      } else {
        addPicDispatch(response.uri)
      }
    })
  }

  // 点击删除图片
  imgClick = v => () => {
    const state = this.state
    Alert.alert(
      '警告',
      '确定删除此图片吗',
      [
        {
          text: '取消',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: '确定',
          onPress: () => {
            const files = state.imgs.filter(val => {
              return val !== v
            })
            this.setState({ imgs: files })
          }
        }
      ],
      { cancelable: false }
    )
  }

  // 点击提交触发事件
  submitInfos = () => {
    const { formState } = this.props
    const { isSubmit } = this.state
    if (isSubmit) return
    if (_.isEmpty(formState.problemName)) {
      toastTip('问题名称不得为空')
      return
    }
    if (_.isEmpty(formState.problemDate)) {
      toastTip('问题发生时间不得为空')
      return
    }
    if (_.isEmpty(formState.submitPerson)) {
      toastTip('填报人不得为空')
      return
    }
    if (_.isEmpty(formState.problemDescription)) {
      toastTip('问题描述不得为空')
      return
    }
    this.setState({ isSubmit: true })
    submitPro(formState)
      .then(v => {
        if (this.state.imgs.length === 0) {
          this.onSubmitSuccess()
          return
        }
        submitPic(v.obj, this.state.imgs)
          .then(result => {
            this.onSubmitSuccess()
          })
          .catch(e => {
            this.setState({ isSubmit: false })
          })
      })
      .catch(e => {
        this.setState({ isSubmit: false })
      })
  }

  onSubmitSuccess = () => {
    const {
      formResetDispatch,
      getSafeProDispatch,
      getQulityProDispatch,
      formState
    } = this.props
    formResetDispatch()
    formState.problemType === 1 ? getSafeProDispatch() : getQulityProDispatch()
    this.setState({ isSubmit: false }, () => navigation.popToTop())
  }

  render() {
    const { formState, updateDispatch } = this.props
    const state = this.state
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>
              添加
              {formState.problemType === 1 ? '安全' : '质量'}
              问题
            </Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <Form>
            <Item fixedLabel last>
              <Label>问题名称: </Label>
              <Input
                placeholder="请输入"
                onChangeText={problemName => {
                  updateDispatch({ problemName })
                }}
              />
            </Item>
            <Item fixedLabel last style={{ height: 50 }}>
              <Label>问题发生日期: </Label>
              <DatePicker
                defaultDate={new Date()}
                timeZoneOffsetInMinutes={undefined}
                modalTransparent={false}
                animationType={'fade'}
                androidMode={'default'}
                placeHolderText="请选择时间"
                textStyle={{ color: '#343434', textAlign: 'left' }}
                placeHolderTextStyle={{ color: '#d3d3d3' }}
                onDateChange={time => {
                  const problemDate = format(time, 'YYYY-MM-DD')
                  updateDispatch({ problemDate })
                }}
              />
            </Item>
            {_.isNull(formState.position) || (
              <Item fixedLabel last style={{ height: 50, paddingRight: 10 }}>
                <Label>所在位置: </Label>
                <Text>{formState.position}</Text>
              </Item>
            )}
            <Item fixedLabel last>
              <Label>填报人: </Label>
              <Input
                placeholder="请输入"
                onChangeText={submitPerson => {
                  updateDispatch({ submitPerson })
                }}
              />
            </Item>
            <Label style={{ lineHeight: 40, paddingLeft: 10 }}>问题描述:</Label>
            <Textarea
              rowSpan={5}
              placeholder="请输入"
              onChangeText={problemDescription => {
                updateDispatch({ problemDescription })
              }}
            />
            <Label style={{ lineHeight: 40, paddingLeft: 10 }}>
              问题现场照片:
            </Label>
            <View style={styles.imgBox}>
              {state.imgs.map((v, k) => (
                <ImgItem key={k} imgUrl={v} onImgClick={this.imgClick(v)} />
              ))}
              <TouchableRipple
                onPress={this.takePic}
                style={styles.imgAdd}
                rippleColor="rgba(0, 0, 0, .32)"
              >
                <FontAwesome
                  name={'plus'}
                  size={40}
                  style={{ textAlign: 'center' }}
                  color={'#E1E1E1'}
                />
              </TouchableRipple>
            </View>
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
              loading={state.isSubmit}
              onPress={this.submitInfos}
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
    formState: state.addProForm,
    loginState: state.login
  }),
  dispatch => ({
    updateDispatch: data => dispatch(update(data)),
    formResetDispatch: data => dispatch(formReset(data)),
    getSafeProDispatch: data => dispatch(getSafePro(data)),
    getQulityProDispatch: data => dispatch(getQulityPro(data))
  })
)(Infos)

const styles = StyleSheet.create({
  imgBox: {
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  imgAdd: {
    width: ImgWidth,
    height: ImgWidth,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 10,
    justifyContent: 'center',
    borderColor: '#E1E1E1',
    borderWidth: 1
  }
})
