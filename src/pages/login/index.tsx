import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton, AtInput, AtForm, } from 'taro-ui'

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

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

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
class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
  */
  config: Config = {
    navigationBarTitleText: '登录'
  }

  state = {
    cellphone: '',
    password: ''
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

  handleChange(e) {
    console.log(e)
  }

  onSubmit() {

  }

  render () {
    let { cellphone, password, } = this.state
    return (
      <View className='root'>
        <AtForm
          onSubmit={this.onSubmit.bind(this)}
        >
          <AtInput
            clear
            name='cellphone'
            title='手机号'
            type='number'
            placeholder='请输入手机号'
            value={cellphone}
            onChange={this.handleChange.bind(this)}
          />
          <AtInput
            clear
            name='password'
            title='密码'
            type='password'
            placeholder='密码不能少于6位数'
            value={password}
            onChange={this.handleChange.bind(this)}
          />
          <View className='form_btn'>
            <AtButton type='primary' circle formType='submit'>登录</AtButton>
          </View>
          <View className='form_reset'>
            <Text className='form_reset_text'>重设密码</Text>
          </View>
        </AtForm>

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
