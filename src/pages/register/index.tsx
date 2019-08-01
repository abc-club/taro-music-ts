import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon, AtButton, AtInput, AtForm, AtToast } from 'taro-ui'

// import { add, minus, asyncAdd } from '../../actions/counter'
import { LoginDao } from './service'
import CTitle from '@/components/CTitle'
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

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
  */
  config: Config = {
    navigationBarTitleText: '注册'
  }

  state = {
    phone: '',
    password: '',
    showLoading: false,
    showTip: false,
    tip: ''
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount() {
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleChange (type: 'phone' | 'password', value) {
    if (type === 'phone') {
        this.setState({
            phone: value
        })
    } else {
        this.setState({
            password: value
        })
    }
  }

  onSubmit() {
    const { phone, password } = this.state
      if (!phone) {
        this.setState({
            showTip: true,
            tip: '请输入手机号'
        })
        return
      }
      if (!password) {
        this.setState({
            showTip: true,
            tip: '请输入密码'
        })
        return
      }
      this.setState({
          showLoading: true
      })
      LoginDao(phone, password).then((res) => {
          const { code } = res.data
          let tip = '登录成功'
          if (code !== 200) {
            tip = res.data.msg || '登录失败'
          }
          this.setState({
            showLoading: false,
            showTip: true,
            tip
          })
          if (code === 200) {
            Taro.setStorageSync('userInfo', res.data)
            Taro.setStorageSync('userId', res.data.account.id)
            Taro.navigateTo({
              url: '/pages/index/index'
            })
          }
      }).catch(() => {
        this.setState({
          showLoading: false,
          showTip: true,
          tip: '登录失败'
        })
      })
  }

  closeToast() {
    this.setState({
      showTip: false,
    })
  }
  closeLoading() {
    this.setState({
      showLoading: false,
    })
  }
  render () {
    let { phone, password, showLoading, showTip, tip } = this.state
    return (
      <View className='root'>
        <CTitle isFixed={false} />
        <AtForm
          onSubmit={this.onSubmit.bind(this)}
        >
          <View className='login_content__item'>
            <AtIcon value='iphone' size='24' color='#ccc'></AtIcon>
            <AtInput
              clear
              name='phone'
              type='number'
              placeholder='手机号'
              value={phone}
              onChange={(val) => this.handleChange('phone', val)}
            />
          </View>
          <View className='login_content__item'>
            <AtIcon value='lock' size='24' color='#ccc'></AtIcon>
            <AtInput
              clear
              name='password'
              type='password'
              placeholder='密码'
              value={password}
              onChange={(val) => this.handleChange('password', val)}
            />
          </View>

          <View className='form_btn'>
            <AtButton type='primary' circle formType='submit'>登录</AtButton>
          </View>
          <View className='form_reset'>
            <Text className='form_reset_text'>重设密码</Text>
          </View>
        </AtForm>
        <AtToast isOpened={showLoading} text='登录中' status='loading' hasMask duration={30000000} onClose={this.closeLoading.bind(this)}></AtToast>
        <AtToast isOpened={showTip} text={tip} hasMask duration={2000} onClose={this.closeToast.bind(this)}></AtToast>
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

export default Index as ComponentClass<PageOwnProps, PageState>
