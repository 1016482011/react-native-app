import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { format } from 'date-fns'

const Notice = props => {
  const {
    taskNoticeFeedBackState: {
      receiveUnit,
      projectName,
      code,
      noticeCode,
      createDate,
      noticeType
    }
  } = props
  const noticeTypeName = noticeType === 1 ? '安全文明类' : '质量控制类'
  const time = format(createDate, 'YYYY年MM月DD日')
  return (
    <View style={styles.container}>
      <Text style={styles.title}>监理通知单回复单 ({noticeTypeName})</Text>
      <View style={styles.content}>
        <View style={styles.flexRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.tableText, { paddingLeft: 5 }]}>
              工程名称: {projectName}
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
              致: {receiveUnit} (项目监理机构)
            </Text>
            <Text
              style={[
                styles.tableText,
                styles.contentText,
                { marginBottom: 18 }
              ]}
            >
              我方接到编号为
              {noticeCode}
              的监理通知单后，已按要求完成相关工作，请予以复查
            </Text>
            <Text
              style={[
                styles.tableText,
                styles.contentText,
                { marginBottom: 18 }
              ]}
            >
              {'附件:需要说明的情况'}
            </Text>
            <Text
              style={[
                styles.tableText,
                styles.contentText,
                { textAlign: 'right', paddingRight: 100 }
              ]}
            >
              施工项目经理部 (章):
            </Text>
            <Text
              style={[
                styles.tableText,
                styles.contentText,
                { textAlign: 'right', paddingRight: 50 }
              ]}
            >
              项目经理 (签字):
            </Text>
            <Text
              style={[
                styles.tableText,
                styles.contentText,
                { textAlign: 'right', paddingRight: 30, marginBottom: 10 }
              ]}
            >
              {time}
            </Text>
          </View>
          <View style={{ padding: 6 }}>
            <Text style={[styles.tableText]}>
              注: 1、本通知单分为质量控制类 (B.51)、造价控制类
              (B.52)、进度控制类 (B.53)、安全文明类 (B.54)、工程变更类 (B.55)。
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
    taskNoticeFeedBackState: state.taskNoticeFeedBack,
    dataNoticeState: state.dataNotice
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
