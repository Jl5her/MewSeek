/* eslint-disable no-console */
import { Game, Song } from 'mewseek'
import { Socket, Server } from 'socket.io'
import fs from 'fs'
import yaml from 'js-yaml'
import Spotify from './spotify'

let io: Server
const games: { [key: string]: Game } = {}
const music: Song[] = []
type Data = { max_rounds: number, playlists: string[] }

const spotify = new Spotify()

const loadMusic = async () => {
  await spotify.authenticate()
  const data: Data = yaml.load(fs.readFileSync('data.yml', { encoding: 'utf-8' })) as Data
  for (const playlist of data.playlists) {
    const album = await spotify.getPlaylist(playlist)
    for (const item of album.tracks.items)
      if (item.track.preview_url != null)
        music.push(item.track)
  }
  console.log(`Loaded ${music.length} song(s) from spotify.`)
}


function createGame(this: Socket, nickname: string) {
  const player = { nickname, socketId: this.id }

  let roomCode = undefined;
  while (roomCode == undefined || roomCode in games)
    roomCode = Math.random().toString(36).substring(2, 7).toUpperCase()

  games[roomCode] = {
    status: 'LOBBY',
    roomCode,
    hostSocketId: this.id,
    roundNumber: 0,
    currentRound: undefined,
    gameStart: undefined,
    players: [player],
    leaderboard: [{ ...player, score: 0, place: 0, lastAnswerCorrect: undefined }]
  }

  this.join(roomCode)

  this.emit('createdGame', games[roomCode])
}

function joinGame(this: Socket, roomCode: string, nickname: string) {
  if (!(roomCode in games)) {
    this.emit('error', "Room doess not exist!")
    return
  }

  if (games[roomCode].gameStart != undefined) {
    this.emit('error', "Game already started!")
    return
  }

  games[roomCode].players.push({
    nickname,
    socketId: this.id
  })

  this.join(`${roomCode}`)

  io.to(roomCode).emit('joinedGame', games[roomCode])
}

function speaker(this: Socket, roomCode: string) {
  if (!(roomCode in games)) {
    this.emit('error', "Room does not exist!")
    return
  }

  this.join(`${roomCode}`)
}

function getGameData(this: Socket, roomCode: string) {
  this.emit('gameData', games[roomCode])
}

function leaveGame(this: Socket, roomCode: string) {
  if (!(roomCode in games)) return

  this.leave(`${roomCode}`)
  games[roomCode].players = games[roomCode].players.filter(player => player.socketId != this.id)

  if (games[roomCode].hostSocketId == this.id) {
    io.to(`${roomCode}`).emit('error', "Host left game!")
    delete games[roomCode]
    return
  }
}

function nextRound(roomCode: string) {
  if (!(roomCode in games)) return

  const game = games[roomCode]
  const answers = []

  for (let i = 0; i < 4; i++) {
    let randomIndex = Math.floor(Math.random() * music.length)
    answers.push(music[randomIndex])
  }

  const round = {
    song: answers[Math.floor(Math.random() * answers.length)],
    roundNumber: 1,
    answers
  }

  io.to(`${roomCode}`).emit('nextRound', game, round)
}

function startGame(this: Socket, roomCode: string) {
  if (!(roomCode in games)) return
  const game = games[roomCode]
  if (game.hostSocketId != this.id) return
  if (game.gameStart != undefined) return

  game.gameStart = Date.now() + (1 * 1000)

  setTimeout(() => {
    nextRound(roomCode)
  }, 1 * 1000)

  io.to(`${roomCode}`).emit('gameData', game)
}

const connection = (sio: Server, socket: Socket) => {
  io = sio

  socket.on('createGame', createGame)
  socket.on('joinGame', joinGame)
  socket.on('speaker', speaker)
  socket.on('getGameData', getGameData)
  socket.on('leaveGame', leaveGame)
  socket.on('startGame', startGame)
}

export default { connection, loadMusic }