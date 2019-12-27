import React, { Component } from 'react'
import { Text, Body, Left, Right, ListItem, Thumbnail, Icon } from 'native-base'
import { DOMAIN } from '../helper/apis'
import { format } from 'date-fns'

const noImg = require('../assets/img/nd.jpg')
const loseImg = require('../assets/img/lose.jpg')
export default class ProList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imgError: false
    }
  }
  render() {
    const { data, noIndent } = this.props
    const { imgError } = this.state
    const imgpath =
      data.files.length > 0 ? `${DOMAIN}${data.files[0].thumPath}` : noImg

    let status = '#666666'
    if (data.problemStatus === 2) status = '#6666FF'
    if (data.problemStatus === 3) status = '#66CC00'
    if (data.problemStatus === 1) status = '#CC3333'
    const time = format(data.problemDate, 'YYYY年MM月DD日')
    return (
      <ListItem thumbnail onPress={() => this.props.onClick()}>
        <Left>
          {data.files.length > 0 ? (
            <Thumbnail
              square
              onError={() => {
                this.setState({ imgError: true })
              }}
              source={imgError ? loseImg : { uri: imgpath }}
            />
          ) : (
            <Thumbnail square onError={e => {}} source={imgpath} />
          )}
        </Left>
        <Body>
          <Text>{data.problemName}</Text>
          <Text note numberOfLines={1}>
            {time}
          </Text>
        </Body>
        <Right>
          {!!noIndent ? (
            <Icon
              type="AntDesign"
              name="check"
              style={{
                fontSize: 24,
                color: '#1D9D74'
              }}
            />
          ) : (
            <Text style={{ color: status }}>{data.problemStatusName}</Text>
          )}
        </Right>
      </ListItem>
    )
  }
}
