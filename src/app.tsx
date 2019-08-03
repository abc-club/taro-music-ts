import '@tarojs/async-await'
import Taro, { Component, Config } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'

import dva from './dva'
import models from './models/index'
import Index from './pages/index'
import '@/utils/moment'


import './assets/fonts/iconfont.css'
import 'taro-ui/dist/style/index.scss'
import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }


const dvaApp = dva.createApp({
  initialState: {},
  models
})
const store = dvaApp.getStore()


class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/index/index',
      'pages/my/index',
      'pages/recentPlay/index',
      'pages/account/index',
      'pages/myEvents/index',
      'pages/myFans/index',
      'pages/myFocus/index',
      'pages/login/index',
      'pages/register/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#d43c33',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'white'
    },
    tabBar: {
      color: '#7A7E83',
      selectedColor: '#ab3319',
      borderStyle: 'black',
      backgroundColor: '#ffffff',
      list: [
        {
          text: '发现',
          pagePath: 'pages/index/index',
          iconPath: 'assets/images/icon_API.png',
          selectedIconPath: 'assets/images/icon_API_HL.png',
        },
        {
          text: '我的',
          pagePath: 'pages/my/index',
          iconPath: 'assets/images/icon_component.png',
          selectedIconPath: 'assets/images/icon_component_HL.png',
        },
        {
          text: '账号',
          pagePath: 'pages/account/index',
          iconPath: 'assets/images/icon_component.png',
          selectedIconPath: 'assets/images/icon_component_HL.png',
        }
      ]
    }
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
