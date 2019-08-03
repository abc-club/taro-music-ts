import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtTag } from 'taro-ui'

import './index.scss'

type Props = {
  song: Song
}

export default class CSong extends Component<Props, {}> {
  static options = {
    addGlobalClass: true
  }

  componentWillMount() {
  }

  render() {
    const { song } = this.props
    if (!song) return null
    return (
      <View className='item'>
        <View className='left'>
          <Text className='name'>{song.name}</Text>
          <View className='desc'>
            <Text className='tag'>SQ</Text>
            <Text className='text'>{song.ar[0].name + ' - ' +song.al.name}</Text>
          </View>
        </View>
        <View className='right'>
          <View className='icon iconfont icon-more'></View>
        </View>
      </View>
    )
  }
}
