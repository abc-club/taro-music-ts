import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtTag } from 'taro-ui'

import './index.scss'

type Props = {
  song: Song
  onClick?: (song: Song)=> void
  onRightClick?: (song: Song)=> void
}

export default class CSong extends Component<Props, {}> {
  static options = {
    addGlobalClass: true
  }

  componentWillMount() {
  }

  onClick() {
    if (!this.props.onClick) return
    this.props.onClick(this.props.song)
  }

  onRightClick() {
    if (!this.props.onRightClick) return
    this.props.onRightClick(this.props.song)
  }

  render() {
    const { song } = this.props
    if (!song) return null
    return (
      <View className='item'  onClick={this.onClick.bind(this)}>
        <View className='left'>
          <Text className='name'>{song.name}</Text>
          <View className='desc'>
            <Text className='tag'>SQ</Text>
            <Text className='text'>{song.ar[0].name + ' - ' +song.al.name}</Text>
          </View>
        </View>
        <View className='right' onClick={this.onRightClick.bind(this)}>
          <View className='icon iconfont icon-more'></View>
        </View>
      </View>
    )
  }
}
