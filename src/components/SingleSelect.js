import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native'
import { Text, View, Radio } from 'native-base'

export default class SingleSelect extends Component {
  render() {
    const { data, active } = this.props
    return (
      <View style={{ flex: 1 }}>
        {data.map((v, k) => {
          return (
            <TouchableOpacity
              key={v.code}
              onPress={() => {
                this.props.onClick(k)
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  paddingTop: 4,
                  paddingBottom: 4,
                }}
              >
                <Text style={{ flex: 1 }}>{v.value}</Text>
                <Radio
                  style={{ width: 30 }}
                  color={'#f0ad4e'}
                  selectedColor={'#5cb85c'}
                  selected={k === active}
                />
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }
}
