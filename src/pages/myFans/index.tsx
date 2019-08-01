import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import CUserListItem from '../../components/CUserListItem'
import { getFollowedsDao } from './services'
import './index.scss'

type userInfo = {
  avatarUrl: string,
  nickname: string,
  signature?: string,
  gender: number
}

type PageState = {
  userList: Array<userInfo>,
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
    navigationBarTitleText: '我的粉丝'
  }

  constructor (props) {
    super(props)
    this.state = {
      userId: Taro.getStorageSync('userId'),
      userList: [],
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
    getFollowedsDao(userId).then((res) => {
      this.setState({
        userList: res.followeds,
      })
    }).finally(()=> {
      Taro.hideLoading()
    })
  }

  componentDidShow () {
   }

  componentDidHide () { }


  render () {
    const { userList } = this.state
    return (
      <View className='my_focus_container'>
        <View className='userList'>
          {
            userList.map((item, index) => <CUserListItem userInfo={item} key={item.nickname+index} />)
          }
        </View>
      </View>
    )
  }
}

export default Page
