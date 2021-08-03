declare module 'mewseek' {
  export interface Config extends Object {
    max_rounds: number
    playlists: string[]
  }

  export interface Game {
    status: 'LOBBY' | 'IN-ROUND' | 'ROUND-OVER' | 'GAME-OVER',
    roomCode: string,
    roundNumber: number,
    currentRound: Round | undefined,
    gameStart: number | undefined,
    hostSocketId: string,
    players: Player[],
    leaderboard: LeaderboardPlayer[]
  }

  export interface Round {
    roundStart: number,
    options: Song[],
    answer: Song,
    roundNumber: number
  }

  export interface Player {
    nickname: string,
    socketId: string
  }

  export interface LeaderboardPlayer extends Player {
    place: number,
    score: number,
    lastAnswerCorrect: boolean | undefined
  }

  export interface Song {
    preview_url: string,
    name: string,
    album: Album,
    artists: Artist[]
  }

  export interface Image {
    url: string
  }

  export interface Album {
    images: Image[]
  }

  export interface Artist {
    name: string
  }

}