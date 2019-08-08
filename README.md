
### 说明

由taro-cli搭建，搭配typescript和dva使用
适配微信小程序和h5（由于Taro.getBackgroundAudioManager不兼容h5,目前h5端不能正常播放）

部分代码参考自 https://github.com/lsqy/taro-music

### 运行

1. 首先启动服务端，接口服务由[NeteaseCloudMusicApi](https://binaryify.github.io/NeteaseCloudMusicApi/#/)提供，下载代码，启动服务，命令如下：
```
npm i
npm run start
```

2. 启动客户端
```
npm install
npm run dev:weapp 或 npm run dev:h5
```

### TODO
- 收藏
- 评论
- 播放视频
- 设置
- 动效


### 屏幕截图

- 首页
  
![首页](/screenshot/首页.png)
![首页](/screenshot/首页1.png)

- 我的
  
![我的](/screenshot/我的.png)
![我的1](/screenshot/我的1.png)

- 账号
  
![账号](/screenshot/账号.png)
![账号1](/screenshot/账号1.png)

- 专辑
  
![专辑](/screenshot/专辑.png)
![专辑1](/screenshot/专辑1.png)

- 播放
  
![播放](/screenshot/播放.png)

- 登录
  
![登录](/screenshot/登录.png)


- 签到
  
![签到](/screenshot/签到.png)


- 我的动态
  
![我的动态](/screenshot/我的动态.png)

- 我的关注
  
![我的关注](/screenshot/我的关注.png)

- 最近播放
  
![最近播放](/screenshot/最近播放.png)
