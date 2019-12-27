import React, { Component } from 'react'
import { BottomNavigation } from 'react-native-paper'
import { connect } from 'react-redux'
import _ from 'lodash'
import SplashScreen from 'react-native-splash-screen'
import QualityManage from './QualityManage'
import SafeManage from './SafeManage'
import Task from './Task'
import Setting from './Setting'
import { reset } from '../../actions/data/problem'
import { reset as taskReset } from '../../actions/data/task'
import { getProject } from '../../actions/login'

class HomeView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      index: 0,
      routes: [
        { key: 'safe', title: '安全管理', icon: 'bug-report' },
        { key: 'quality', title: '质量管理', icon: 'next-week' },
        { key: 'task', title: '任务管理', icon: 'storage' },
        { key: 'user', title: '个人中心', icon: 'settings-applications' }
      ]
    }
  }
  componentDidMount() {
    const {
      roleState: { taskEnable }
    } = this.props
    if (!taskEnable) {
      this.setState({
        tabData: _.without(this.state.tabData, this.state.tabData[2])
      })
    }
    SplashScreen.hide()
    this.props.getProjectDispatch()
  }

  _handleIndexChange = index => this.setState({ index })

  _renderScene = BottomNavigation.SceneMap({
    safe: SafeManage,
    quality: QualityManage,
    task: Task,
    user: Setting
  })

  render() {
    return (
      <BottomNavigation
        shifting={false}
        barStyle={{ backgroundColor: '#fff' }}
        activeColor="#3ba283"
        navigationState={this.state}
        onIndexChange={this._handleIndexChange}
        renderScene={this._renderScene}
      />
    )
  }
}

export default connect(
  state => ({
    roleState: state.role
  }),
  dispatch => ({
    resetDispatch: data => dispatch(reset(data)),
    taskResetDispatch: data => dispatch(taskReset(data)),
    getProjectDispatch: data => dispatch(getProject(data))
  })
)(HomeView)
