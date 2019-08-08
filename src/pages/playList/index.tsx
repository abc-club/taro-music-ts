import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtAvatar, } from 'taro-ui'
import CSong from '@/containers/CSong'
import SongDetailLayout from '@/containers/SongDetailLayout'
import {getPlayListDetailDao} from './service'
// import { add, minus, asyncAdd } from '../../actions/counter'

import './index.scss'

// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

type PageStateProps = {
}

type PageDispatchProps = {
  playAll: (payload) => void

}

type PageOwnProps = {}

type PageState = {
  playList: PlayList | null,
  isLayoutOpened: boolean
  selectSong: Song | null
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

@connect(({
}) => ({
}), (dispatch) => ({
  playAll (payload) {
    dispatch({
      type: 'song/playAll',
      payload
    })
  },
}))
class Index extends Component<IProps, PageState> {

  /**
 * 指定config的类型声明为: Taro.Config
 *
 * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
 * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
 * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
 */
  config: Config = {
    navigationBarTitleText: '首页'
  }

  constructor () {
    super(...arguments)
    this.state = {
      playList: null,
      isLayoutOpened: false,
      selectSong: null,
    }
  }

  componentWillMount() {
    const { id, name } = this.$router.params
    Taro.setNavigationBarTitle({
      title: name
    })
    getPlayListDetailDao(id).then(res => {
      this.setState({
        playList: res.playlist
      })
    })
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () {

   }

  componentDidHide () { }

  onRightClick(song) {
    this.setState({
      isLayoutOpened: true,
      selectSong: song
    })
  }

  closeLayout() {
    this.setState({
      isLayoutOpened: false,
    })
  }

  goUserList() {
    const { playList, } = this.state
    Taro.setStorageSync('userList', (playList as PlayList).subscribers)
    Taro.navigateTo({
      url: '/pages/userList/index?title=收藏者'
    })
  }

  playAll() {
    if (!this.state.playList) return
    this.props.playAll({list: this.state.playList.tracks})
    Taro.navigateTo({
      url: `/pages/playSong/index?id=${this.state.playList.tracks[0].id}`
    })
  }

  renderSubscribers() {
    const { playList, } = this.state
    if (!playList) return
    return (
      <View className='subscribers' onClick={this.goUserList.bind(this)}>
        <View className='avatars'>
          {
            playList.subscribers.slice(0,5).map((item, index) => {
              return <AtAvatar circle key={item.name} image={item.avatarUrl}></AtAvatar>
            })
          }
        </View>
        <View className='count'>
          {
            playList.subscribedCount < 10000 ?
              playList.subscribedCount :
              `${Number(playList.subscribedCount/10000).toFixed(1)}万收藏`
          }
          <View className='icon iconfont icon-youjiantou'></View>
        </View>
        </View>
    )
  }

  render () {
    const { playList, isLayoutOpened, selectSong } = this.state
    if (!playList) return
    return (
      <View>
        <View className='header'>
          <Image
            className='header__bg'
            src={playList.coverImgUrl+'?imageView&thumbnail=252x252'}
          />
          <View className='header__cover'>
            <Image
              className='header__cover__img'
              src={playList.coverImgUrl+'?imageView&thumbnail=252x252'}
            />
            <Text className='header__cover__desc'>歌单</Text>
            <View className='header__cover__num'>
              <Text className='at-icon at-icon-sound'></Text>
              {
                playList.playCount < 10000 ?
                playList.playCount :
                `${Number(playList.playCount/10000).toFixed(1)}万`
              }
            </View>
          </View>
          <View className='header__info'>
            <View className='header__info__title'>
            {playList.name}
            </View>
            <View className='header__info__user'>
              <Image
                className='header__info__user_avatar'
                src={playList.creator.avatarUrl+'?imageView&thumbnail=60x60'}
              />{playList.creator.nickname}
            </View>
          </View>
        </View>
        <View className='header--more'>
          <View className='header--more__tag'>
              标签：
              {
                playList.tags.map((tag, index) => <Text key={index} className='header--more__tag__item'>{tag}</Text>)
              }
              {
                playList.tags.length === 0 ? '暂无' : ''
              }
          </View>
          <View className='header--more__desc'>
            简介：{playList.description || '暂无'}
          </View>
        </View>
        <View className='play-wrapper' onClick={this.playAll.bind(this)}>
          <View className='icon iconfont icon-bofang'></View>
          <Text className='left-text'>播放全部</Text>
          <Text className='left-text-sub'>(共{playList.tracks.length}首)</Text>
        </View>
        <View className='song-list'>
          {
            playList.tracks.map((song, index) => {
              return (
                <CSong song={song} key={song.name+index} onRightClick={this.onRightClick.bind(this)}/>
              )
            })
          }
        </View>
        {/* 收藏人列表 */}
        {this.renderSubscribers()}
        <SongDetailLayout isOpened={isLayoutOpened} song={selectSong as Song} handleClose={this.closeLayout.bind(this)}></SongDetailLayout>

      </View>
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Index
