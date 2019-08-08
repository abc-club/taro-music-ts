import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtIcon, AtFloatLayout } from 'taro-ui'
import classnames from 'classnames'
import CPlayList from '@/containers/CPlayList'

import './index.scss'
type Props = {
  songInfo: PlaySong,
  isHome?: boolean,
  onUpdatePlayStatus: (object) => any
}

type State = {
  isOpened: boolean
}

const backgroundAudioManager = Taro.getBackgroundAudioManager()


export default class CMusic extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      isOpened: false
    }
  }
  goDetail() {
    const { id } = this.props.songInfo.currentSongInfo
    Taro.navigateTo({
      url: `/pages/playSong/index?id=${id}`
    })
  }

  switchPlayStatus() {
    const { isPlaying } = this.props.songInfo
    if (isPlaying) {
      backgroundAudioManager.pause()
      this.props.onUpdatePlayStatus({
        isPlaying: false
      })
    } else {
      backgroundAudioManager.play()
      this.props.onUpdatePlayStatus({
        isPlaying: true
      })
    }
  }

  showPlayList() {
    this.setState({
      isOpened: true
    })
  }

  closePlayList() {
    this.setState({
      isOpened: false
    })
  }

  doPlaySong(song) {
    // 没有权限
    if (song.st === -200) {
      Taro.showToast({
        title: '暂无版权',
        icon: 'none'
      })
      return
    }
    Taro.navigateTo({
      url: `/pages/playSong/index?id=${song.id}`
    })
    this.setState({
      isOpened: false,
    })
  }

  removeSong() {

  }

  render() {
    if (!this.props.songInfo) return
    const { currentSongInfo, isPlaying, canPlayList } = this.props.songInfo
    const { isOpened } = this.state
    if (!currentSongInfo.name) return <View></View>
    return (
      <View className={
        classnames({
          music_components: true,
          isHome: this.props.isHome
        })
      }>
        <Image
          className={
            classnames({
              music__pic: true,
              'z-pause': false,
              circling: isPlaying
            })
          }
          src={currentSongInfo.al.picUrl+'?imageView&thumbnail=80x80'}
        />
        <View className="music__info" onClick={this.goDetail.bind(this)}>
          <View className='music__info__name'>
            {currentSongInfo.name}
          </View>
          <View className='music__info__desc'>
            {currentSongInfo.ar[0] ? currentSongInfo.ar[0].name : ''}  - {currentSongInfo.al.name}
          </View>
        </View>
        <View className='music__icon--play'>
          <AtIcon value={isPlaying ? 'pause' : 'play'} size='30' color='#FFF' onClick={this.switchPlayStatus.bind(this)}></AtIcon>
        </View>
        <AtIcon value='playlist' size='28' color='#FFF' className="icon_playlist" onClick={this.showPlayList.bind(this)}></AtIcon>
        {
          isOpened&&<CPlayList isOpened={isOpened} handleClose={this.closePlayList.bind(this)} doPlaySong={this.doPlaySong.bind(this)}/>
        }
      </View>
    )
  }
}
