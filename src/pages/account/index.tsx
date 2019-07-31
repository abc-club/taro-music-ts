import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton, AtList, AtListItem, AtFloatLayout, } from 'taro-ui'

// import { add, minus, asyncAdd } from '../../actions/counter'
import { getRecommendList } from './service'
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
  counter: {
    num: number
  }
}

type PageDispatchProps = {
  add: () => void
  add2: (payload) => void
  dec: () => void
  asyncAdd: () => any
}

type PageOwnProps = {}

type PageState = {
  show: boolean
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps



@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add () {
    dispatch({
      type: 'counter/ADD',
      payload: {}
    })
  },
  add2 (payload) {
    dispatch({
      type: 'counter/ADD2',
      payload
    })
  },
  dec () {
    dispatch({
      type: 'counter/MINUS',
      payload: {}
    })
  },
  asyncAdd () {
    dispatch({
      type: 'counter/asyncAdd',
      payload: {}
    })
  }
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
    navigationBarTitleText: '账号'
  }

  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount() {
    getRecommendList().then(res => {
      console.log(res)
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  goLogin() {
    this.setState({
      show: false
    })
    Taro.redirectTo({
      url: '/pages/login/index'
    })
  }

  goRegister() {
    this.setState({
      show: false
    })
    Taro.redirectTo({
      url: '/pages/register/index'
    })
  }


  handleShow() {
    this.setState({
      show: true
    })
  }

  handleClose() {
    this.setState({
      show: false
    })
  }
  render () {
    let { show } = this.state

    return (
      <View className='root'>
        <View className='wrapper login_wrapper'>
          <View className='login_wrapper_text'><Text>登录网易云音乐</Text></View>
          <View className='login_wrapper_text'><Text>手机电脑多端同步，尽享海量高品质音乐</Text></View>
          <View className='login_wrapper_btn'>
            <AtButton type='secondary' circle onClick={this.handleShow.bind(this)}>立即登录</AtButton>
          </View>
        </View>

        <View className='wrapper'>
          <AtList hasBorder={false}>
            <AtListItem
              hasBorder={false}
              title='标题文字'
              arrow='right'
              thumb='https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png'
            />
          </AtList>
        </View>

        <View className='wrapper'>
          <AtList hasBorder={false}>
            <AtListItem
              title='标题文字'
              arrow='right'
              iconInfo={{value: 'iconfont icon-xinfeng', size: 16}}
            />
            <AtListItem
              title='标题文字'
              arrow='right'
              thumb='https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png'
            />
            <AtListItem
              title='标题文字'
              arrow='right'
              thumb='https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png'
            />
          </AtList>
        </View>

        <AtFloatLayout isOpened={show} onClose={this.handleClose.bind(this)}>
          <View className='iconfont icon-baseline-close-px icon-close' onClick={this.handleClose.bind(this)}></View>
          <View className='layout_img_wrapper'>
            <Image
              className='layout_img'
              src='https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3215804841,2810938819&fm=58&bpow=1024&bpoh=1024'
            />
          </View>
          <View className='form_btn'>
            <AtButton type='secondary' circle onClick={this.goLogin.bind(this)}>手机号登录</AtButton>
          </View>
          <View className='form_btn'>
            <AtButton type='secondary' circle onClick={this.goRegister.bind(this)}>注册</AtButton>
          </View>
        </AtFloatLayout>
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
