import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { format } from 'date-fns'
import _ from 'lodash'

const Notice = props => {
  const {
    dataNoticeState: {
      noticeType,
      code,
      constructionUnit,
      cause,
      content,
      limitReplyDate
    },
    loginState
  } = props
  const time = format(limitReplyDate, 'YYYY年MM月DD日')
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        监理通知单 ({noticeType === 1 ? '安全文明类' : '质量控制类'})
      </Text>
      <View style={styles.content}>
        <View style={styles.flexRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.tableText, { paddingLeft: 5 }]}>
              工程名称: {loginState.projectData.projectName}
            </Text>
          </View>
          <View>
            <Text style={styles.tableText}>编号: {code}</Text>
          </View>
        </View>
        <View style={styles.table}>
          <View style={{ flexDirection: 'row' }}>
            <View
              style={{
                flex: 1,
                padding: 2,
                borderRightWidth: 1,
                borderColor: '#666666'
              }}
            >
              <Text style={styles.tableText}>
                施工项目经理部签收人姓名及姓名
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text />
            </View>
            <View
              style={{
                flex: 1,
                padding: 2,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderColor: '#666666'
              }}
            >
              <Text style={styles.tableText}>建设单位签收人姓名及时间</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text />
            </View>
          </View>
          <View style={styles.tableContent}>
            <Text style={[styles.tableText, styles.contentText]}>
              致: {constructionUnit} (施工项目经理部)
            </Text>
            <Text style={[styles.tableText, styles.contentText]}>事由:</Text>
            <Text
              style={[
                styles.tableText,
                styles.contentText,
                { marginBottom: 18 }
              ]}
            >
              {cause}
            </Text>
            <Text style={[styles.tableText, styles.contentText]}>内容:</Text>
            <Text
              style={[
                styles.tableText,
                styles.contentText,
                { marginBottom: 18 }
              ]}
            >
              {content}
            </Text>
            <Text style={[styles.tableText, styles.contentText]}>
              如对本监理通知单内容有异议，请在24小时内向监理提出书面报告。
            </Text>
            <Text style={[styles.tableText, styles.contentText]}>
              请于 {time} 前填报回复单
            </Text>
            <Text
              style={[
                styles.tableText,
                styles.contentText,
                { marginBottom: 36 }
              ]}
            >
              (B.51)。
            </Text>
            <Text
              style={[
                styles.tableText,
                styles.contentText,
                { textAlign: 'right', paddingRight: 100 }
              ]}
            >
              项目监理机构 (章):
            </Text>
            <Text
              style={[
                styles.tableText,
                styles.contentText,
                { textAlign: 'right', paddingRight: 50 }
              ]}
            >
              总监理工程师/专业监理工程师 (签字):
            </Text>
            <Text
              style={[
                styles.tableText,
                styles.contentText,
                { textAlign: 'right', paddingRight: 30, marginBottom: 10 }
              ]}
            >
              ___ 年 __ 月 __ 日
            </Text>
          </View>
          <View style={{ padding: 6 }}>
            <Text style={[styles.tableText]}>
              注: 1、本通知单分为质量控制类 (A.0.101)、造价控制类
              (A.0.102)、进度控制类 (A.0.103)、安全文明类 (A.0.104)、工程变更类
              (A.0.105)、其他类 (A.0.106)。
            </Text>
            <Text style={[styles.tableText]}>
              2、本表一式三份，项目监理机构、施工项目经理部、建设单位各一份。
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default connect(
  state => ({
    dataNoticeState: state.dataNotice,
    loginState: state.login
  }),
  dispatch => ({})
)(Notice)

const styles = StyleSheet.create({
  container: {
    padding: 10,
    overflow: 'scroll'
  },
  title: {
    color: '#2D2D2D',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  flexRow: {
    flexDirection: 'row'
  },
  content: {
    marginTop: 10,
    paddingBottom: 20
  },
  table: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#666666'
  },
  tableText: {
    color: '#3E3E3E',
    fontSize: 12
  },
  tableContent: {
    padding: 6,
    borderColor: '#666666',
    borderTopWidth: 1,
    borderBottomWidth: 1
  },
  contentText: {
    lineHeight: 20
  }
})
