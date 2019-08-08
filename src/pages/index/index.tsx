import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text, Image, Swiper, SwiperItem,} from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtTabs, AtTabsPane, } from 'taro-ui'
import { getRecommendPlayListDao, getRecommendDjDao, getBannerDao, getRecommendSongsDao,} from './services'
import CMusic from '@/components/CMusic'
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
  song: PlaySong
}

type PageDispatchProps = {
  updateState: (payload)=> void
}

type PageOwnProps = {}

type PageState = {
  current: number,
  recommendPlayList: Array<{
    name: string,
    picUrl: string,
    playCount: number
  }>,
  recommendDj: Array<{
    name: string,
    picUrl: string
  }>,
  recommendSongs: Array<{
    name: string,
    picUrl: string
  }>,
  recommend: any,
  banners: Array<Banner>
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

@connect(({
  song
}) => ({
  song: song
}), (dispatch) => ({
  updateState(payload) {
    dispatch({
      type: 'song/updateState',
      payload
    })
  },
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
    navigationBarTitleText: '首页'
  }

  constructor () {
    super(...arguments)
    this.state = {
      current: 0,
      recommendPlayList: [],
      recommendDj: [],
      recommendSongs: [],
      recommend: [],
      banners: [],
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () {
    this.getBanner()
    this.getRecommendPlayList()
    this.getRecommendDj()
    this.getRecommendSongs()
  }

  componentDidHide () { }

  handleClick (value) {
    this.setState({
      current: value
    })
  }

  getBanner() {
    getBannerDao().then(res=> {
      this.setState({
        banners: res.banners
      })
    })
  }

  getRecommendPlayList() {
    getRecommendPlayListDao().then(res=> {
      this.setState({
        recommendPlayList: res.result
      })
    })
  }

  getRecommendDj() {
    getRecommendDjDao().then(res=> {
      this.setState({
        recommendDj: res.result
      })
    })
  }

  getRecommendSongs() {
    getRecommendSongsDao().then(res=> {
      this.setState({
        recommendSongs: res.result
      })
    })
  }

  clickBanner(banner: Banner) {
    switch(banner.targetType) {
      case 1:
        Taro.navigateTo({
          url: `/pages/playSong/index?id=${banner.targetId}`
        })
        break
        case 10:
          Taro.navigateTo({
            url: `/pages/playList/index?id=${banner.targetId}&name=${banner.typeTitle}`
          })
          break
        case 3000:
          Taro.navigateTo({
            url: `/pages/webview/index?name=${banner.typeTitle}&url=${banner.url}`
          })
          break
    }
  }

  goDetail(item) {
    Taro.navigateTo({
      url: `/pages/playList/index?id=${item.id}&name=${item.name}`
    })
  }
  render () {
    const tabList = [{ title: '个性推荐' }, { title: '主播电台' }]
    const { recommendPlayList, recommendDj, banners, } = this.state
    return (
      <View>
        <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={this.state.current} index={0} >
          <Swiper
            className='test-h'
            indicatorColor='#999'
            indicatorActiveColor='#333'
            circular
            indicatorDots
            autoplay>
            {
              banners.map((item) => {
                return (
                  <SwiperItem key={item.targetId}>
                    <Image className='img' src={item.pic+'?imageView&thumbnail=0x300'} onClick={this.clickBanner.bind(this,item)}/>
                  </SwiperItem>
                )
              })
            }
          </Swiper>
          <View className='recommend_playlist'>
            <View className='recommend_playlist__title'>
              推荐歌单
            </View>
            <View className='recommend_playlist__content'>
              {
                recommendPlayList.map((item, index) => <View key={index} className='recommend_playlist__item' onClick={this.goDetail.bind(this, item)}>
                  <Image
                    src={item.picUrl+'?imageView&thumbnail=0x200'}
                    className='recommend_playlist__item__cover'
                  />
                  <View className='recommend_playlist__item__cover__num'>
                    <Text className='at-icon at-icon-sound'></Text>
                    {
                      item.playCount < 10000 ?
                      item.playCount :
                      `${Number(item.playCount/10000).toFixed(0)}万`
                    }
                  </View>
                  <View className='recommend_playlist__item__title'>{item.name}</View>
                </View>)
              }
            </View>
          </View>


          </AtTabsPane>

          <AtTabsPane current={this.state.current} index={1}>
            <View className='recommend_playlist'>
              <View className='recommend_playlist__title'>
                主播电台
              </View>
              <View className='recommend_playlist__content'>
                {
                  recommendDj.map((item, index) => <View key={index} className='recommend_playlist__item' onClick={this.goDetail.bind(this, item)}>
                    <Image
                      src={item.picUrl+'?imageView&thumbnail=0x200'}
                      className='recommend_playlist__item__cover'
                    />
                    <View className='recommend_playlist__item__title'>{item.name}</View>
                  </View>)
                }
              </View>
            </View>
          </AtTabsPane>
        </AtTabs>
        <CMusic songInfo={ this.props.song } onUpdatePlayStatus={this.props.updateState.bind(this)} />

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
