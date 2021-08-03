import fetch from 'node-fetch'

export default class Spotify  {
  accessToken = undefined

  constructor() {
  }

  authenticate = async () => {
    const { CLIENT_ID, CLIENT_SECRET } = process.env
    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`, 'utf-8').toString('base64')

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    const data = await response.json()
    this.accessToken = data.access_token
  }

  getPlaylist = (playlist_id: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      fetch(`https://api.spotify.com/v1/playlists/${playlist_id}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      })
        .then(response => response.json())
        .then(res => resolve(res))
        .catch(reject)
    })
  }

  getTrack = (track_id: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      fetch(`https://api.spotify.com/v1/tracks/${track_id}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      })
        .then(response => response.json())
        .then(res => resolve(res))
        .catch(reject)
    })
  }

  getStream = (url: string): Promise<NodeJS.ReadableStream> => {
    return new Promise<NodeJS.ReadableStream>((resolve, reject) => {
      fetch(url)
        .then((response) => response.body)
        .then((res) => resolve(res))
        .catch(reject)
    })
  }

}