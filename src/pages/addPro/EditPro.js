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
import {
  DOMAIN,
  updataProblem,
  submitPic,
  getProblemDetail,
  delFile
} from '../../helper/apis'
import { getQulityPro, getSafePro } from '../../actions/data/problem'
import { toastTip } from '../../helper/util'

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
          source={{
            uri: this.props.isServer
              ? `${DOMAIN}${this.props.imgUrl}`
              : this.props.imgUrl
          }}
        />
      </TouchableOpacity>
    )
  }
}

class EditPro extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imgs: [],
      imgSubmited: [],
      imgDelete: [],
      files: [],
      isSubmit: false,
      problemType: 1
    }
  }

  componentWillMount() {
    this.getData()
  }

  // 请求问题详细数据
  getData = () => {
    const {
      dataSate: {
        proSelect: { id }
      },
      updateDispatch
    } = this.props
    getProblemDetail({ id })
      .then(data => {
        _.unset(data, 'obj.createDate')
        updateDispatch(
          _.assign({}, data.obj, {
            files: [],
            problemDate: format(data.obj.problemDate, 'YYYY-MM-DD')
          })
        )
        this.setState({
          imgSubmited: data.obj.files.map(v => {
            return v.filePath
          }),
          files: data.obj.files,
          problemType: data.obj.problemType
        })
      })
      .catch(e => {
        this.props.navigation.goBack()
      })
  }

  // 卸载组件时清空状态
  componentWillUnmount() {
    const { formResetDispatch } = this.props
    formResetDispatch()
  }

  // 拼接显示的图片
  addPicDispatch = data => {
    const imgs = this.state.imgs.concat([data])
    this.setState({ imgs })
  }

  // 点击拍照事件
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

  // 点击已上传图片触发事件
  imgSubmitedClick = v => () => {
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
            let delImg = []
            const files = state.imgSubmited.filter(val => {
              const isEqual = val !== v
              if (!isEqual) delImg.push(v)
              return isEqual
            })
            this.setState({
              imgSubmited: files,
              imgDelete: state.imgDelete.concat(delImg)
            })
          }
        }
      ],
      { cancelable: false }
    )
  }
  // 点击提交按钮触发事件
  submitInfos = () => {
    const { formState, formResetDispatch } = this.props
    const { imgDelete, isSubmit, files, problemType } = this.state
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
    updataProblem(formState)
      .then(v => {
        const thImgDel = _.map(
          _.filter(files, v => _.indexOf(imgDelete, v.filePath) !== -1),
          'thumPath'
        )
        delFile(_.concat(thImgDel, imgDelete), formState.id)
          .then(v => {
            submitPic(formState.id, this.state.imgs)
              .then(result => {
                formResetDispatch()
                this.setState({ isSubmit: false }, () => {
                  problemType === 1
                    ? this.props.getSafeProDispatch()
                    : this.props.getQulityProDispatch()
                  this.props.navigation.goBack()
                })
              })
              .catch(e => {
                this.setState({ isSubmit: false })
              })
          })
          .catch(e => {
            this.setState({ isSubmit: false })
          })
      })
      .catch(e => {
        this.setState({ isSubmit: false })
      })
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
              修改
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
                value={formState.problemName}
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
                placeHolderText={format(formState.problemDate, 'DD/MM/YYYY')}
                textStyle={{ color: '#343434', textAlign: 'left' }}
                placeHolderTextStyle={{ color: '#d3d3d3' }}
                onDateChange={time => {
                  const problemDate = format(time, 'YYYY-MM-DD')
                  updateDispatch({ problemDate })
                }}
              />
            </Item>
            {_.isEmpty(formState.position) || (
              <Item fixedLabel last style={{ height: 50, paddingRight: 10 }}>
                <Label>所在位置: </Label>
                <Text>{formState.position}</Text>
              </Item>
            )}
            <Item fixedLabel last>
              <Label>填报人: </Label>
              <Input
                placeholder="请输入"
                value={formState.submitPerson}
                onChangeText={submitPerson => {
                  updateDispatch({ submitPerson })
                }}
              />
            </Item>
            <Label style={{ lineHeight: 40, paddingLeft: 10 }}>问题描述:</Label>
            <Textarea
              rowSpan={5}
              placeholder="请输入"
              value={formState.problemDescription}
              onChangeText={problemDescription => {
                updateDispatch({ problemDescription })
              }}
            />
            <Label style={{ lineHeight: 40, paddingLeft: 10 }}>
              问题现场照片:
            </Label>
            <View style={styles.imgBox}>
              {state.imgSubmited.map((v, k) => (
                <ImgItem
                  key={k}
                  isServer
                  imgUrl={v}
                  onImgClick={this.imgSubmitedClick(v)}
                />
              ))}

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
    dataSate: state.dataProblem,
    formState: state.addProForm,
    loginState: state.login
  }),
  dispatch => ({
    updateDispatch: data => dispatch(update(data)),
    formResetDispatch: data => dispatch(formReset(data)),
    getSafeProDispatch: data => dispatch(getSafePro(data)),
    getQulityProDispatch: data => dispatch(getQulityPro(data))
  })
)(EditPro)

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
