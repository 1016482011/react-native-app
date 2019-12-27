import React, { Component } from 'react'
import { connect } from 'react-redux'
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
  Card,
  CardItem,
  Content,
  Text,
  View,
  Footer,
  Item,
  Label,
  DatePicker,
  Textarea,
  Form,
  Spinner
} from 'native-base'
import _ from 'lodash'
import { Button as PaButton, TouchableRipple } from 'react-native-paper'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { format } from 'date-fns'
import ImagePicker from 'react-native-image-picker'
import { getProblemDetail, getProblemFeedBack } from '../../helper/apis'
import { update, formRest } from '../../actions/task/verifyPro.js'
import { getProList } from '../../actions/data/task'
import ProblemDetail from '../../components/ProblemDetail'
import FeedBackDetail from '../../components/FeedBackDetail'
import { addTransact, submitPic } from '../../helper/apis'
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
          source={{ uri: this.props.imgUrl }}
        />
      </TouchableOpacity>
    )
  }
}

class Problem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      proSelectDetail: {},
      proSelectFeedBack: [],
      spinner: true,
      isSubmit: false
    }
  }
  componentWillMount() {
    this.getData()
  }

  // 请求数据
  getData = async () => {
    const {
      dataSate: {
        proSelect: { id }
      },
      loginState: { userData },
      updateDispatch
    } = this.props
    const proDetail = await getProblemDetail({ id })
    const proFeedBack = await getProblemFeedBack({ id })
    this.setState({
      proSelectDetail: proDetail.obj || {},
      proSelectFeedBack: proFeedBack.obj || [],
      spinner: false
    })
    updateDispatch({
      problemId: id,
      transactPerson: userData.id,
      userName: userData.realName
    })
  }

  // 点击删除图片
  imgClick = v => () => {
    const { updateDispatch, verifyState } = this.props
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
            const files = verifyState.files.filter(val => {
              return val !== v
            })
            updateDispatch({ files: files })
          }
        }
      ],
      { cancelable: false }
    )
  }

  // 选择图片
  takePic = () => {
    const { updateDispatch, verifyState } = this.props
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
        updateDispatch({
          files: verifyState.files.concat([response.uri])
        })
      }
    })
  }

  // 提交表单
  submitData = () => {
    const { verifyState } = this.props
    const { isSubmit } = this.state
    if (isSubmit) return
    if (_.isEmpty(verifyState.transactDate)) {
      toastTip('整改日期不得为空')
      return
    }
    this.setState({ isSubmit: true })
    addTransact(verifyState)
      .then(v => {
        if (verifyState.files.length === 0) {
          this.afferSubmit()
          return
        }
        submitPic(v.obj.id, verifyState.files)
          .then(result => {
            this.afferSubmit()
          })
          .catch(e => {
            this.setState({ isSubmit: false })
          })
      })
      .catch(e => {
        this.setState({ isSubmit: false })
      })
  }
  // 表单提交成功后触发的事件
  afferSubmit = () => {
    const {
      getProListDispatch,
      formRestDispatch,
      selectState: {
        myDealSelect: { businessKey }
      }
    } = this.props
    getProListDispatch(businessKey)
    formRestDispatch()
    this.setState({ isSubmit: false }, () => this.props.navigation.goBack())
  }

  render() {
    const { verifyState, updateDispatch } = this.props
    const { proSelectDetail, proSelectFeedBack, spinner, isSubmit } = this.state
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
            <FeedBackDetail proFeedBack={proSelectFeedBack} />
            <Card>
              <CardItem header>
                <Text>整改反馈</Text>
                <Right />
              </CardItem>
              <CardItem>
                <Content>
                  <Form>
                    <Item fixedLabel last style={{ height: 50 }}>
                      <Label>整改日期: </Label>
                      <DatePicker
                        defaultDate={new Date()}
                        locale={'en'}
                        timeZoneOffsetInMinutes={undefined}
                        modalTransparent={false}
                        animationType={'fade'}
                        androidMode={'default'}
                        placeHolderText="请选择时间"
                        textStyle={{ color: '#343434', textAlign: 'left' }}
                        placeHolderTextStyle={{ color: '#d3d3d3' }}
                        onDateChange={time => {
                          const transactDate = format(time, 'YYYY-MM-DD')
                          updateDispatch({ transactDate })
                        }}
                      />
                    </Item>
                    <Label style={{ lineHeight: 40, paddingLeft: 10 }}>
                      整改措施及反馈:
                    </Label>
                    <Textarea
                      rowSpan={5}
                      placeholder="请输入"
                      onChangeText={content => {
                        updateDispatch({ content })
                      }}
                    />
                    <Label style={{ lineHeight: 40, paddingLeft: 10 }}>
                      整改图片:
                    </Label>
                    <View style={styles.imgBox}>
                      {verifyState.files.map((v, k) => (
                        <ImgItem
                          key={k}
                          imgUrl={v}
                          onImgClick={this.imgClick(v)}
                        />
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
              </CardItem>
            </Card>
          </Content>
        )}

        {!spinner && (
          <Footer>
            <View
              padder
              style={{
                backgroundColor: '#ffffff',
                flex: 1
              }}
            >
              <PaButton
                loading={isSubmit}
                onPress={this.submitData}
                dark={true}
                mode="contained"
              >
                提交
              </PaButton>
            </View>
          </Footer>
        )}
      </Container>
    )
  }
}

export default connect(
  state => ({
    dataSate: state.dataProblem,
    verifyState: state.taskVerifyPro,
    loginState: state.login,
    selectState: state.dataTask
  }),
  dispatch => ({
    getProListDispatch: data => dispatch(getProList(data)),
    updateDispatch: data => dispatch(update(data)),
    formRestDispatch: data => dispatch(formRest(data))
  })
)(Problem)

const styles = StyleSheet.create({
  imgBox: {
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
