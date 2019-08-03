interface Event {
  id: number,
  user: {
    avatarUrl: string,
    nickname: string,
  }
  eventTime: number
  forwardCount: number
  json: string,
  info: {
    commentCount: number
    likedCount: number
    shareCount: number
  }
}

interface UserInfo {
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

interface ListItemInfo {
  coverImgUrl: string,
  name: string,
  trackCount: number,
  playCount: number
}

interface Artist {
  name: string,
  id: number,
  picUrl: string,
}

// 缩写的字段
interface Song {
  name: string,
  id: number,
  alia: Array<string>,
  ar: Array<Artist>,
  al: Album
}

interface Song2 {
  name: string,
  id: number,
  alias: Array<string>,
  artists: Array<Artist>,
  album: Album
}



interface RecentPlaySong {
  playCount: number
  score: number
  song: Song
}

interface Album {
  name: string,
  id: number,
  picUrl: string,
  blurPicUrl: string,
  songs: Array<Song>,
  artist: Artist,
  artists: Array<Artist>
}
