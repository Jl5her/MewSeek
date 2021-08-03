import { Song } from 'mewseek'
import { Server } from 'socket.io'

export class Discord{
  io: Server

  attachIO = (io: Server) => {
    this.io = io
  }

  pause = (room: string) => {
    this.io.to(room).emit('pause')
  }

  stop = (room: string) => {
    this.io.to(room).emit('stop')
  }

  resume = (room: string) => {
    this.io.to(room).emit('resume')
  }

  play = (room: string, song: Song) => {
    this.io.to(room).emit('play', { song })
  }

}