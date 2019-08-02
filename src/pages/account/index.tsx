import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton, AtList, AtListItem, AtFloatLayout, AtAvatar,AtTag } from 'taro-ui'

// import { add, minus, asyncAdd } from '../../actions/counter'
import { getUserDetailDao, doDailySigninDao, doLogoutDao, } from './service'
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
  userInfo: {
    account: {
      id: number
    },
    profile: {
      avatarUrl: string,
      backgroundUrl: string,
      nickname: string,
      eventCount: number,
      follows: number,
      followeds: number
    }
  }
  userDetail: {
    userLevel?: number
    dailySignin?: boolean,
  }
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
      show: false,
      userInfo: Taro.getStorageSync('userInfo'),
      userDetail: {},
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount() {

  }

  componentWillUnmount () { }

  componentDidShow () {
    this.setState({
      userInfo: Taro.getStorageSync('userInfo')
    })
    if (!this.state.userInfo) return
    this.getUserDetail()
  }

  componentDidHide () { }

  jumpPage(name) {
    this.setState({
      show: false
    })
    Taro.navigateTo({
      url: `/pages/${name}/index`
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

  getUserDetail() {
    const { id } = this.state.userInfo.account
    getUserDetailDao(id).then((res) => {
      this.setState({
        userDetail: { ... this.state.userDetail, ...{
          userLevel: res.level,
          dailySignin: res.mobileSign || res.pcSign
        }},
        userInfo: {
          ...this.state.userInfo,
          ... {
            profile: res.profile
          }
        }
      })
    })
  }

  // 登出
  logOut() {
    Taro.clearStorage()
    doLogoutDao()
    this.setState({
      show: true,
      userInfo: Taro.getStorageSync('userInfo')
    })
  }

  // 签到
  doDailySignin() {
    doDailySigninDao().then(res => {
      if (res.code === 200) {
        Taro.showToast({
          title: `签到成功，获得${res.point}积分`,
          icon: 'success'
        })
      } else {
        Taro.showToast({
          title: '已经签到过了哦~',
          icon: 'none'
        })
      }
    }, ()=>{
      Taro.showToast({
        title: '已经签到过了哦~',
        icon: 'none'
      })
    })
  }

  showToast() {
    Taro.showToast({
      title: '暂未实现，敬请期待',
      icon: 'none'
    })
  }

  render () {
    const { show, userInfo, userDetail, } = this.state

    return (
      <View className='root'>
        {
          !userInfo && (
            <View className='wrapper login_wrapper'>
              <View className='login_wrapper_text'><Text>登录网易云音乐</Text></View>
              <View className='login_wrapper_text'><Text>手机电脑多端同步，尽享海量高品质音乐</Text></View>
              <View className='login_wrapper_btn'>
                <AtButton type='secondary' circle onClick={this.handleShow.bind(this)}>立即登录</AtButton>
              </View>
            </View>
          )
        }
        {
          userInfo && (
            <View className='wrapper profile_wrapper'>
              <View className='header'>
                <AtAvatar circle image={userInfo.profile.avatarUrl}></AtAvatar>
                <View className='header__info'>
                  <Text className='header__info__name'>{userInfo.profile.nickname}</Text>
                  <AtTag size='small' circle>LV.{userDetail.userLevel}</AtTag>
                </View>
                {
                  !userDetail.dailySignin && (
                    <View className='header__checkin' onClick={this.doDailySignin.bind(this)}>
                    签到<View className='icon iconfont icon-jiantou'></View>
                    </View>
                  )
                }
                {
                  userDetail.dailySignin && (
                    <View className='header__checkin' onClick={this.doDailySignin.bind(this)}>
                      已签到
                    </View>
                  )
                }
              </View>
              <View className='user_count'>
                <View className='user_count__sub border_right_1px' onClick={this.jumpPage.bind(this, 'myEvents')}>
                  <Text className='profile_wrapper_follow_item_title'>动态</Text>
                  <Text className='user_count__sub--num'>{userInfo.profile.eventCount}</Text>
                </View>
                <View className='user_count__sub border_right_1px' onClick={this.jumpPage.bind(this, 'myFocus')}>
                  <Text className='profile_wrapper_follow_item_title'>关注</Text>
                  <Text className='user_count__sub--num'>{userInfo.profile.follows}</Text>
                </View>
                <View className='user_count__sub border_right_1px' onClick={this.jumpPage.bind(this, 'myFans')}>
                  <Text className='profile_wrapper_follow_item_title'>粉丝</Text>
                  <Text className='user_count__sub--num'>{userInfo.profile.followeds}</Text>
                </View>
                <View className='user_count__sub' onClick={this.showToast.bind(this)}>
                  <View className='icon iconfont icon-pan_icon'></View>
                  <Text className='profile_wrapper_follow_item_title'>我的资料</Text>
                </View>
              </View>
            </View>
          )
        }

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

        <View className='wrapper logout-wrapper'>
          <Text onClick={this.logOut.bind(this)}>退出登录</Text>
        </View>
        <AtFloatLayout isOpened={show} onClose={this.handleClose.bind(this)}>
          <View className='iconfont icon-baseline-close-px icon-close' onClick={this.handleClose.bind(this)}></View>
          <View className='layout_img_wrapper'>
            <Image
              className='layout_img'
              src={require('@/assets/images/cloudmusic.jpeg')}
            />
          </View>
          <View className='form_btn'>
            <AtButton type='secondary' circle onClick={this.jumpPage.bind(this, 'login')}>手机号登录</AtButton>
          </View>
          <View className='form_btn'>
            <AtButton type='secondary' circle onClick={this.jumpPage.bind(this, 'register')}>注册</AtButton>
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
