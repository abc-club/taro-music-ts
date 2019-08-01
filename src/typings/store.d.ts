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

interface Artist {
  name: string,
  id: number,
  picUrl: string,
}

interface Song {
  name: string,
  id: number,
  alias: Array<string>,
  artists: Array<Artist>,
  album: Album
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
