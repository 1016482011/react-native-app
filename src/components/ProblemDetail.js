import React, { Component } from 'react'
import { Image, Modal, TouchableOpacity, StatusBar } from 'react-native'
import { Button } from 'react-native-paper'
import ImageViewer from 'react-native-image-zoom-viewer'
import _ from 'lodash'
import { Content, Text, View } from 'native-base'
import { DOMAIN } from '../helper/apis'
import { format } from 'date-fns'

export default class ProblemDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      index: 0
    }
  }

  onBack = () => {
    this.setState({ visible: false })
    StatusBar.setBackgroundColor('#3ba283')
  }

  render() {
    const { proSelectDetail, navigation } = this.props
    const time = format(proSelectDetail.problemDate, 'YYYY年MM月DD日')
    const imgFile = proSelectDetail.files || []
    const images = _.map(imgFile, v => {
      return { url: `${DOMAIN}${v.filePath}`, props: {} }
    })
    const { visible, index } = this.state
    return (
      <View
        style={{
          backgroundColor: '#fff',
          marginVertical: 15,
          paddingHorizontal: 15,
          paddingVertical: 15
        }}
      >
        <Modal
          visible={visible}
          transparent={true}
          onRequestClose={this.onBack}
        >
          <ImageViewer
            imageUrls={images}
            index={index}
            saveToLocalByLongPress={false}
          />
        </Modal>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 7
          }}
        >
          <Text style={{ fontSize: 24, marginRight: 30 }}>
            {proSelectDetail.problemName}
          </Text>
          {!_.isEmpty(proSelectDetail.bimMemberId) && (
            <Button
              mode="outlined"
              style={{
                height: 30,
                justifyContent: 'center'
              }}
              onPress={() => navigation.navigate('ModelViewDetails')}
            >
              查看模型
            </Button>
          )}
        </View>
        <View style={{ flex: 1, flexDirection: 'row', marginVertical: 7 }}>
          <Text style={{ width: 60 }}>填报人: </Text>
          <Text style={{ flex: 1 }}>{proSelectDetail.submitPerson}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', marginVertical: 7 }}>
          <Text style={{ width: 76 }}>问题描述: </Text>
          <Text style={{ flex: 1 }}>{proSelectDetail.problemDescription}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', marginVertical: 7 }}>
          <Text style={{ width: 76 }}>所在位置: </Text>
          <Text style={{ flex: 1 }}>{proSelectDetail.position}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', marginVertical: 7 }}>
          <Text style={{ width: 106 }}>问题发生日期: </Text>
          <Text style={{ flex: 1 }}>{time}</Text>
        </View>
        {!_.isEmpty(imgFile) && (
          <Content>
            <Text>问题现场图片: </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {imgFile.map((v, k) => (
                <TouchableOpacity
                  key={k}
                  onPress={() => {
                    this.setState({ visible: true, index: k })
                    StatusBar.setBackgroundColor('#000')
                    console.log(`${DOMAIN}${v.thumPath}`)
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
                      uri: `${DOMAIN}${v.thumPath}`
                    }}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </Content>
        )}
      </View>
    )
  }
}
