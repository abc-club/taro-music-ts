import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtTabs, AtTabsPane } from 'taro-ui'
import CSong from '@/containers/CSong'
import SongDetailLayout from '@/containers/SongDetailLayout'

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
  my: {
    recentPlay: Array<RecentPlaySong>
  }
}

type PageDispatchProps = {

}

type PageOwnProps = {}

type PageState = {
  current: number,
  isLayoutOpened: boolean
  selectSong: Song | null
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

@connect(({my}) => ({
  my
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
    navigationBarTitleText: '最近播放'
  }

  constructor () {
    super(...arguments)
    this.state = {
      current: 0,
      isLayoutOpened: false,
      selectSong: null,
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleClick (value) {
    this.setState({
      current: value
    })
  }

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

  renderRecentPlaySong() {
    const {recentPlay} = this.props.my
    if (recentPlay.length<=0) {
      return (
        <View className='no-record'>暂无播放记录</View>
      )
    }
    return (
      <View>
        <View className='play-wrapper'>
          <View className='icon iconfont icon-bofang'></View>
          <Text className='left-text'>播放全部</Text>
          <Text className='left-text-sub'>(共{recentPlay.length}首)</Text>
        </View>
        <View className='song-list'>
          {
            recentPlay.map((item, index) => {
              return (
                <CSong song={item.song} key={item.song.name+index} onRightClick={this.onRightClick.bind(this)}/>
              )
            })
          }
        </View>
      </View>
    )
  }

  render () {
    const {isLayoutOpened, selectSong} = this.state
    const {recentPlay} = this.props.my
    const tabList = [{ title: '歌曲 ' + (recentPlay.length>0 ? recentPlay.length:'') }, { title: '视频' }, { title: '其他' }]
    return (
      <View>
        <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={this.state.current} index={0} >
            { this.renderRecentPlaySong() }
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1}>
            <View className='no-record'>暂无播放记录</View>
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1}>
            <View className='no-record'>暂无播放记录</View>
          </AtTabsPane>
        </AtTabs>
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
