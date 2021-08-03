import discord, { TextChannel, VoiceChannel, VoiceConnection } from 'discord.js'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { io } from 'socket.io-client'

dotenv.config({ path: '../.env' })

const socket = io('http://localhost')
const discordClient = new discord.Client()

let connection: VoiceConnection | undefined = undefined

const MEWSEEK_URL_REGEX = /https*:\/\/mewseek.jackp.me\/([a-zA-Z0-9]+)/

const rooms: { [key: string]: { voiceChannel: VoiceChannel, textChannel: TextChannel } } = {}

const getTrackStream = (url: string): Promise<any> => new Promise((resolve, reject) => {
  fetch(url)
    .then(response => response.body)
    .then(res => resolve(res))
    .catch(reject)
})

discordClient.on('message', (message) => {
  if (message.author.bot) return
  const textChannel = message.channel as TextChannel

  const match = message.content.match(MEWSEEK_URL_REGEX) || []
  if (match.length > 1) {
    const [, roomId] = match
    const voiceChannel = message.member?.voice.channel

    if (!voiceChannel) {
      message.reply("Can't join game until you choose a voice channel first!")
      return
    }

    rooms[`${roomId}`] = {
      voiceChannel,
      textChannel
    }

    socket.emit('join', roomId)
  }
})

socket.on('joinedRoom', roomId => {
  const { voiceChannel, textChannel } = rooms[`${roomId}`]

  voiceChannel.join().then((conn) => {
    connection = conn
  })

  textChannel.send("Click the following link to join the game:")
  textChannel.send(`http://mewseek.jackp.me/join/${roomId}`)
})

socket.on('error', ({ roomId }) => {
  const { textChannel } = rooms[roomId]

  textChannel.send("Error! Could not find room!")
})

const play = async (url: string) => {
  getTrackStream(url)
    .then(res => connection?.play(res))
    .catch(console.error)
}

const pause = async () => {
  connection?.dispatcher.pause()
}

socket.on('play', play)
socket.on('pause', pause)

discordClient.login(process.env.BOT_TOKEN)

console.log("🤖 Discord bot logging in!")
