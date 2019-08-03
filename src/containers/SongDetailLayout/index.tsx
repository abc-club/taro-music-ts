import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtTabs, AtTabsPane, AtFloatLayout } from 'taro-ui'

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

}

type PageOwnProps = {
  song: Song
  isOpened: boolean
  handleClose: ()=>void
}

type PageState = {
  current: number
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps


class Index extends Component<IProps, PageState> {

  static options = {
    addGlobalClass: true
  }
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
      current: 0,
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleClose () {
    this.props.handleClose()
  }

  render () {
    const { isOpened, song } = this.props
    if (!song) return
    return (
      <AtFloatLayout isOpened={isOpened} title={song.name} onClose={this.handleClose.bind(this)}>
        <View className='item'>
          <View className='icon iconfont icon-xiayishou'></View>
          <Text className='text'>下一首播放</Text>
        </View>
        <View className='item'>
          <View className='icon iconfont icon-favorite'></View>
          <Text className='text'>收藏到歌单</Text>
        </View>
        <View className='item'>
          <View className='icon iconfont icon-pinglun '></View>
          <Text className='text'>评论()</Text>
        </View>
        <View className='item'>
          <View className='icon iconfont icon-ziyuan'></View>
          <Text className='text'>分享</Text>
        </View>
        <View className='item'>
          <View className='icon iconfont icon-geshou'></View>
          <Text className='text'>歌手：{song.ar[0].name}</Text>
        </View>
        <View className='item'>
          <View className='icon iconfont icon-zhuanji1'></View>
          <Text className='text'>专辑：{song.al.name}</Text>
        </View>
        <View className='item'>
          <View className='icon iconfont icon-delete'></View>
          <Text className='text'>删除</Text>
        </View>
      </AtFloatLayout>
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
