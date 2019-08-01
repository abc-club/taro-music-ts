import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import CUserEvent from '../../components/CUserEvent'
import { getEventsDao } from './services'
import './index.scss'


type PageState = {
  eventList: Array<Event>,
  userId: number,
}

class Page extends Component<{}, PageState> {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '我的动态'
  }

  constructor (props) {
    super(props)
    this.state = {
      userId: Taro.getStorageSync('userId'),
      eventList: [],
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentWillMount () {
    Taro.showLoading({
      title: 'loading'
    })
    const { userId } = this.state
    getEventsDao(userId).then((res) => {
      this.setState({
        eventList: res.events,
      })
    }).finally(()=> {
      Taro.hideLoading()
    })
  }

  componentDidShow () {
   }

  componentDidHide () { }


  render () {
    const { eventList } = this.state
    return (
      <View className='my_focus_container'>
        <View className='eventList'>
        {
            eventList.map((item, index) => <CUserEvent event={item} key={item.id+index} />)
          }
        </View>
      </View>
    )
  }
}

export default Page
