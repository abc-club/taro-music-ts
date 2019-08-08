import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './index.scss'

type Props = {
  userInfo: {
    avatarUrl: string,
    nickname: string,
    signature?: string,
    gender: number
  }
}

export default class CUserListItem extends Component<Props, {}> {

  componentWillMount() {
  }

  render() {
    const { userInfo } = this.props
    if (!userInfo) return null
    return (
        <View className='userListItem_components'>
            <Image
							src={userInfo.avatarUrl+'?imageView&thumbnail=100x100'}
							className='userListItem__avatar'
            />
            <View className='userListItem__info'>
            <View className='userListItem__info__name'>
              {userInfo.nickname}
              {
                userInfo.gender === 1 ? <View className='icon iconfont icon-nan'></View> : ''
              }
              {
                userInfo.gender === 2 ? <View className='icon iconfont icon-nv'></View> : ''
              }
            </View>
            <View className='userListItem__info__signature'>{userInfo.signature || ''}</View>
            </View>
        </View>
    )
  }
}
