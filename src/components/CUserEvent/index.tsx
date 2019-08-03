import Taro, { Component } from '@tarojs/taro'
import { View, Text, } from '@tarojs/components'
import { AtAvatar, } from 'taro-ui'
import moment from 'moment'

import './index.scss'

type Props = {
  event: Event,
}

type jsonDetail = {
  msg: string
  event?: Event
  song: Song2
}

export default class CUserListItem extends Component<Props, {}> {

  componentWillMount() {
  }



  render() {
    const { event } = this.props
    if (!event) return null
    let  {json} = event
    let jsonDetail: jsonDetail = JSON.parse(json)
    return (
        <View className='event'>
            <AtAvatar circle image={event.user.avatarUrl}></AtAvatar>
            <View className='event_right'>
              <View className='header'>
                <View className='nickname_wrapper'>
                  <Text className='nickname'>{event.user.nickname}</Text>
                    转发：
                </View>
                <Text className='eventtime'>{moment(event.eventTime).fromNow()}</Text>
              </View>
              <View className='msg_wrapper'>
                <Text className='msg'>{jsonDetail.msg}</Text>
                <View className='song_wrapper'>
                  <AtAvatar image={jsonDetail.song.album.blurPicUrl}></AtAvatar>
                  <View className='song_header'>
                    <Text className='song-name'>{`${jsonDetail.song.name}(${jsonDetail.song.alias.length&&jsonDetail.song.alias[0]})`}</Text>
                    {
                      jsonDetail.song.artists.length>0 && (
                        <Text className='song-artist'>{jsonDetail.song.artists[0].name}</Text>
                      )
                    }
                  </View>
                </View>
              </View>
            </View>
        </View>
    )
  }
}
