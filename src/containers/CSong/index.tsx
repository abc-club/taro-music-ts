import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import './index.scss'

type PageStateProps = {
}

type PageDispatchProps = {
  playSingle: (object) => void,
}

type PageOwnProps = {
  song: Song
  onRightClick?: (song: Song)=> void
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface CSong {
  props: IProps
}

@connect(({
}) => ({
}), (dispatch) => ({
  playSingle (payload) {
    dispatch({
      type: 'song/playSingle',
      payload
    })
  },
}))
class CSong extends Component {
  static options = {
    addGlobalClass: true
  }

  componentWillMount() {
  }

  onClick() {
    const { song, playSingle, } = this.props
    if (!playSingle) return
    // 没有权限
    if (song.st === -200) {
      Taro.showToast({
        title: '暂无版权',
        icon: 'none'
      })
      return
    }
    playSingle({song})
    Taro.navigateTo({
      url: `/pages/playSong/index?id=${song.id}`
    })
  }

  onRightClick() {
    if (!this.props.onRightClick) return
    this.props.onRightClick(this.props.song)
  }

  render() {
    const { song, onRightClick, } = this.props
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
        {
          onRightClick &&
          <View className='right' onClick={this.onRightClick.bind(this)}>
            <View className='icon iconfont icon-more'></View>
          </View>
        }
      </View>
    )
  }
}
export default CSong
