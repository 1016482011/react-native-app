import React, { Component } from 'react'
import { FlatList, Image } from 'react-native'
import { connect } from 'react-redux'
import {
  Container,
  Header,
  Button,
  Icon,
  Text,
  Body,
  Left,
  Title,
  Right,
  Fab,
  ActionSheet,
  Tab,
  Tabs
} from 'native-base'
import _ from 'lodash'
import navigation from '../helper/navigationService'
import { update } from '../actions/data/problem'
import { update as proUpdate } from '../actions/addPro/proForm'
import { delProblem } from '../helper/apis'
import { toastTip } from '../helper/util'
import ProList from '../components/ProList'

const logo = require('../assets/img/logo.png')
class ManageListView extends Component {
  constructor(props) {
    super(props)
  }
  // 点击添加问题按钮
  _fabPress = () => {
    const { proUpdateDispatch, problemType } = this.props
    proUpdateDispatch({ problemType })
    navigation.navigate('AddProModelFilter')
  }
  // 删除当前选择的问题
  deleteRow = item => {
    delProblem(item.id).then(v => {
      this.props.onRefresh()
      toastTip('删除成功', 'success')
    })
  }
  // 编辑当前选择的问题
  _leftHiddenRow = item => {
    const { updateDispatch } = this.props
    updateDispatch({ proSelect: item })
    navigation.navigate('AddProEditPro')
  }
  // 下拉刷新执行事件
  _onRefresh = () => {
    this.props.onRefresh()
  }
  // 跳往问题详情页
  _toProDetail = item => {
    const { updateDispatch } = this.props
    updateDispatch({ proSelect: item })
    navigation.navigate('ProblemDetails')
  }
  // 定义列表的子元素渲染的组件
  renderItem = ({ item }) => {
    return (
      <ProList
        data={item}
        onClick={() => {
          if (item.problemStatus !== 0) {
            this._toProDetail(item)
            return
          }
          ActionSheet.show(
            {
              options: [
                { text: '查看', icon: 'analytics', iconColor: '#f42ced' },
                { text: '编辑', icon: 'color-filter', iconColor: '#ea943b' },
                { text: '删除', icon: 'trash', iconColor: '#fa213b' },
                { text: '取消', icon: 'close', iconColor: '#25de5b' }
              ],
              cancelButtonIndex: 3,
              title: '请选择操作'
            },
            buttonIndex => {
              if (buttonIndex === 0) this._toProDetail(item)
              if (buttonIndex === 1) this._leftHiddenRow(item)
              if (buttonIndex === 2) this.deleteRow(item)
            }
          )
        }}
      />
    )
  }

  _filterData = value => {
    const { data } = this.props
    return _.filter(data, { problemStatus: value })
  }

  flatList = type => {
    const { spinner } = this.props
    return (
      <FlatList
        data={this._filterData(type)}
        renderItem={this.renderItem}
        keyExtractor={item => item.id}
        refreshing={spinner}
        onRefresh={this._onRefresh}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', paddingTop: 15 }}>暂无数据</Text>
        }
      />
    )
  }

  render() {
    const { roleState, title, onSort } = this.props
    return (
      <Container>
        <Header>
          <Left>
            <Image style={{ width: 30, height: 34 }} source={logo} />
          </Left>
          <Body>
            <Title>{title}</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => onSort()}>
              <Icon type="FontAwesome" name="sort" />
            </Button>
          </Right>
        </Header>
        {roleState.HomeAddProBtn && (
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
        <Tabs>
          <Tab heading="新建">{this.flatList(0)}</Tab>
          <Tab heading="待整改">{this.flatList(1)}</Tab>
          <Tab heading="待通过">{this.flatList(2)}</Tab>
          <Tab heading="已通过">{this.flatList(3)}</Tab>
        </Tabs>
      </Container>
    )
  }
}

export default connect(
  state => ({
    roleState: state.role,
    loginState: state.login
  }),
  dispatch => ({
    updateDispatch: data => dispatch(update(data)),
    proUpdateDispatch: data => dispatch(proUpdate(data))
  })
)(ManageListView)
