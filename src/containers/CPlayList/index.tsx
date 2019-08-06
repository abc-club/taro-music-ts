import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtFloatLayout } from "taro-ui"
import classnames from 'classnames'

import './index.scss'

type PageStateProps = {
  canPlayList: Array<Song>,
  currentSongInfo: Song
}

type PageDispatchProps = {
}

type PageOwnProps = {
  isOpened: boolean
  handleClose: ()=> void
  doPlaySong: (song) => void
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface CPlayList {
  props: IProps
}

@connect(({
  song
}) => ({
  canPlayList: song.canPlayList,
  currentSongInfo: song.currentSongInfo,
}))
class CPlayList extends Component {
  static options = {
    addGlobalClass: true
  }

  componentWillMount() {
    console.log(this.props.canPlayList)
  }

  doPlaySong(song) {
    this.props.doPlaySong(song)
  }

  renderList() {
    const { canPlayList, currentSongInfo } = this.props
    let result = canPlayList.map((item, index) => {
      const cls = classnames({
        playlist: true,
        active: item.current
      })
      return (
        <View className={cls} key={item.name} onClick={this.doPlaySong.bind(this,item)}>
          <View className='info'>
            {item.name}
            <View className='sub-text'>{` - ${item.ar[0] ? item.ar[0].name : ''}`}</View>
          </View>
          <View className='icon iconfont icon-cuowu'></View>
        </View>
      )
    })
    return result
  }

  handleClose() {
    this.props.handleClose()
  }
  render() {
    const { isOpened, canPlayList } = this.props
    return (
      <AtFloatLayout isOpened={isOpened} title="播放列表" onClose={this.handleClose.bind(this)}>
        {this.renderList()}
      </AtFloatLayout>
    )
  }
}
export default CPlayList
