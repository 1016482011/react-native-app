import React, { Component } from 'react'
import { StyleSheet, Image, FlatList, RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import {
  Container,
  Button,
  Segment,
  Text,
  Card,
  CardItem,
  Body,
  View,
  Fab,
  Icon,
  Content,
  Header,
  Left,
  Title
} from 'native-base'
import navigation from '../../helper/navigationService'
import { getMyStart, getMyDeal, update } from '../../actions/data/task'
import { update as mainUpdate } from '../../actions/index'
import { format } from 'date-fns'

const logo = require('../../assets/img/logo.png')
// 定义任务列表子元素渲染组件
const TaskItem = props => {
  const { data } = props
  const time = format(data.createTime, 'YYYY年MM月DD日')
  return (
    <View
      style={{
        paddingLeft: 10,
        paddingRight: 10
      }}
    >
      <Card>
        <CardItem
          button
          onPress={() => {
            props.onClick(data.businessKey)
          }}
        >
          <Body>
            <Text style={styles.cardTitle}>{data.processName}</Text>
            <Text style={styles.cardTitle}>
              事由：
              {data.cause}
            </Text>
            <Text style={styles.cardTitle}>
              状态：
              {data.status}
            </Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardText}>{time}</Text>
            </View>
          </Body>
        </CardItem>
      </Card>
    </View>
  )
}

class Task extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: 0,
      isMystartLoaded: false
    }
  }
  componentDidMount() {
    this.props.getMyDealDispatch()
  }

  _onMyStartPress = () => {
    this.props.mainUpdateDispatch({ taskActive: 1 })
    if (!this.state.isMystartLoaded) {
      this.props.getMyStartDispatch()
      this.setState({ isMystartLoaded: true })
    }
  }

  // 定义待办的FlatList渲染的子元素
  renderItem = ({ item }) => {
    const { updateDispatch } = this.props
    return (
      <TaskItem
        data={item}
        onClick={id => {
          const { userData } = this.props
          updateDispatch({ myDealSelect: item })
          if (
            item.bpmStatus === '2' &&
            item.isSign === 2 &&
            userData.roleCode === 'ProManager'
          ) {
            navigation.navigate('TaskSignForNoticeFeedBack')
            return
          }

          if (item.bpmStatus === '2' && item.isSign === 2) {
            navigation.navigate('VerifyTask')
            return
          }
          if (item.isSign === 3) {
            navigation.navigate('TaskDetailDealPro')
          } else {
            navigation.navigate('TaskSignForNotice')
          }
        }}
      />
    )
  }
  // 定义我发起的FlatList渲染的子元素
  renderMystart = ({ item }) => {
    const { updateDispatch } = this.props
    return (
      <TaskItem
        data={item}
        onClick={id => {
          updateDispatch({ myStartSelect: item })
          navigation.navigate('TaskMyStartInfo')
        }}
      />
    )
  }
  // 刷新页面
  _onRefresh = () => {
    this.state.active === 0
      ? this.props.getMyDealDispatch()
      : this.props.getMyStartDispatch
  }
  // 发起任务按钮点击事件
  _fabPress = () => {
    navigation.navigate('TaskNotice')
  }

  render() {
    const {
      dataTaskState,
      roleState,
      mainUpdateDispatch,
      mainState
    } = this.props
    const active = mainState.taskActive
    return (
      <Container>
        <Header>
          <Left>
            <Image style={{ width: 30, height: 34 }} source={logo} />
          </Left>
          <Body>
            <Title>任务管理</Title>
          </Body>
        </Header>
        {roleState.HomeTaskMyStart && (
          <Segment>
            <Button
              first
              active={active === 0}
              onPress={() => mainUpdateDispatch({ taskActive: 0 })}
            >
              <Text>待办任务</Text>
            </Button>
            <Button last active={active === 1} onPress={this._onMyStartPress}>
              <Text>我发起的</Text>
            </Button>
          </Segment>
        )}

        <View style={{ flex: 1 }}>
          {active === 1 && roleState.HomeAddProBtn && (
            <Fab
              active={true}
              direction="up"
              containerStyle={{ zIndex: 99 }}
              style={{ backgroundColor: '#3ba283' }}
              position="bottomRight"
              onPress={this._fabPress}
            >
              <Icon type="FontAwesome" name="plus" />
            </Fab>
          )}

          <Content
            refreshControl={
              <RefreshControl
                refreshing={dataTaskState.refreshSpinner}
                onRefresh={this._onRefresh}
              />
            }
          >
            <View style={{ display: !active ? 'flex' : 'none', flex: 1 }}>
              <FlatList
                data={dataTaskState.myDeal}
                renderItem={this.renderItem}
                keyExtractor={item => item.businessKey}
                ListEmptyComponent={
                  <Text style={{ textAlign: 'center', paddingTop: 15 }}>
                    暂无数据
                  </Text>
                }
              />
            </View>
            <View style={{ display: !active ? 'none' : 'flex', flex: 1 }}>
              <FlatList
                data={dataTaskState.myStart}
                renderItem={this.renderMystart}
                keyExtractor={item => item.businessKey}
                ListEmptyComponent={
                  <Text style={{ textAlign: 'center', paddingTop: 15 }}>
                    暂无数据
                  </Text>
                }
              />
            </View>
          </Content>
        </View>
      </Container>
    )
  }
}

export default connect(
  state => ({
    mainState: state.main,
    userData: state.login.userData,
    dataTaskState: state.dataTask,
    roleState: state.role
  }),
  dispatch => ({
    getMyDealDispatch: () => dispatch(getMyDeal()),
    getMyStartDispatch: () => dispatch(getMyStart()),
    updateDispatch: data => dispatch(update(data)),
    mainUpdateDispatch: data => dispatch(mainUpdate(data))
  })
)(Task)

const styles = StyleSheet.create({
  cardTitle: {
    fontSize: 16
  },
  cardText: {
    fontSize: 14,
    paddingRight: 30
  },
  cardFooter: {
    flexDirection: 'row'
  }
})
