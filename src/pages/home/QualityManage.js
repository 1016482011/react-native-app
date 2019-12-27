import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import ManageList from '../../components/ManageList'
import { getQulityPro, sortByTime } from '../../actions/data/problem'

class QualityManageView extends Component {
  componentDidMount() {
    this.getData()
  }
  // 获取数据
  getData = async () => {
    const { getQulityProDispatch } = this.props
    getQulityProDispatch()
  }
  // 下拉刷新执行事件
  _onRefresh = () => {
    this.getData()
  }

  render() {
    const { dataSate, sortByTimeDispatch } = this.props
    return (
      <ManageList
        title="质量管理"
        type="quality"
        problemType={2}
        data={dataSate.quality}
        spinner={dataSate.qualitySpinner}
        onRefresh={this._onRefresh}
        onSort={() => sortByTimeDispatch('quality')}
      />
    )
  }
}

export default connect(
  state => ({
    dataSate: state.dataProblem
  }),
  dispatch => ({
    getQulityProDispatch: data => dispatch(getQulityPro(data)),
    sortByTimeDispatch: data => dispatch(sortByTime(data))
  })
)(QualityManageView)
