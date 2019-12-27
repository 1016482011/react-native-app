import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import ManageList from '../../components/ManageList'
import { getSafePro, sortByTime } from '../../actions/data/problem'

class SafeManageView extends Component {
  componentDidMount() {
    this.getData()
  }
  // 获取数据
  getData = async () => {
    const { getSafeProDispatch } = this.props
    getSafeProDispatch()
  }
  // 下拉刷新执行事件
  _onRefresh = () => {
    this.getData()
  }
  render() {
    const { dataSate, sortByTimeDispatch } = this.props
    return (
      <ManageList
        title="安全管理"
        type="safe"
        problemType={1}
        data={dataSate.safe}
        spinner={dataSate.safeSpinner}
        onRefresh={this._onRefresh}
        onSort={() => sortByTimeDispatch('safe')}
      />
    )
  }
}

export default connect(
  state => ({
    dataSate: state.dataProblem
  }),
  dispatch => ({
    getSafeProDispatch: data => dispatch(getSafePro(data)),
    sortByTimeDispatch: data => dispatch(sortByTime(data))
  })
)(SafeManageView)
