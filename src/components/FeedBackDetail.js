import React, { Component } from 'react'
import { Image, StatusBar, Modal, TouchableOpacity } from 'react-native'
import { Body, Right, Card, CardItem, Content, Text, View } from 'native-base'
import ImageViewer from 'react-native-image-zoom-viewer'
import _ from 'lodash'
import { DOMAIN } from '../helper/apis'
import { format } from 'date-fns'

export default class FeedBackDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      imgShow: [],
      index: 0
    }
  }
  onBack = () => {
    this.setState({ visible: false })
    StatusBar.setBackgroundColor('#3ba283')
  }
  render() {
    const { children, proFeedBack } = this.props
    const { visible, imgShow, index } = this.state
    return (
      <View>
        <Modal
          visible={visible}
          transparent={true}
          onRequestClose={this.onBack}
        >
          <ImageViewer
            imageUrls={imgShow}
            index={index}
            saveToLocalByLongPress={false}
          />
        </Modal>
        {proFeedBack.length > 0 &&
          proFeedBack.map((v, index) => {
            let dateName = '整改日期'
            let contentName = '整改反馈'
            if (v.title.indexOf('审核') > -1) {
              dateName = '审核日期'
              contentName = '审核意见'
            }
            const time = format(v.transactDate, 'YYYY年MM月DD日')
            const imgFile = v.files || []
            const images = _.map(imgFile, val => {
              return { url: `${DOMAIN}${val.filePath}`, props: {} }
            })
            return (
              <View
                key={v.id}
                style={{
                  backgroundColor: '#fff',
                  marginVertical: 15,
                  paddingHorizontal: 15,
                  paddingVertical: 15
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 7
                  }}
                >
                  <Text style={{ fontSize: 24, marginRight: 30 }}>
                    {v.title}
                  </Text>
                </View>
                <View
                  style={{ flex: 1, flexDirection: 'row', marginVertical: 7 }}
                >
                  <Text style={{ width: 76 }}>{dateName}: </Text>
                  <Text style={{ flex: 1 }}>{time}</Text>
                </View>
                <View
                  style={{ flex: 1, flexDirection: 'row', marginVertical: 7 }}
                >
                  <Text style={{ width: 76 }}>{contentName}: </Text>
                  <Text style={{ flex: 1 }}>{v.content}</Text>
                </View>
                {v.inspectStatus && (
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={{ width: 76 }}>审核结果: </Text>
                    <Text style={{ flex: 1 }}>
                      {v.inspectStatus === 1 ? '通过' : '不通过'}
                    </Text>
                  </View>
                )}
                {imgFile.length > 0 && (
                  <Content>
                    <Text>整改图片: </Text>
                    <View style={{ flexDirection: 'row' }}>
                      {imgFile.map((v, k) => (
                        <TouchableOpacity
                          key={k}
                          onPress={() => {
                            this.setState({
                              visible: true,
                              imgShow: images,
                              index: k
                            })
                            StatusBar.setBackgroundColor('#000')
                          }}
                        >
                          <Image
                            style={{
                              width: 100,
                              height: 100,
                              marginRight: 5,
                              marginTop: 10
                            }}
                            source={{
                              uri: `${DOMAIN}${v.filePath}`
                            }}
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  </Content>
                )}
              </View>
            )
          })}
        {children}
      </View>
    )
  }
}
