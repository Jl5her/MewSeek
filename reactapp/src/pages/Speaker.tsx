
import { Song } from 'mewseek'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MusicVisualizer } from 'components'
import { SocketContext } from 'context'

const Speaker = (): JSX.Element => {
  const { roomCode } = useParams<{ roomCode: string }>()
  const [song, setSong] = useState<Song>()
  const socket = useContext(SocketContext)

  useEffect(() => {
    socket?.on('nextRound', (game) => {
      setSong(game.currentRound.song)
      console.log("Playing song!")
    })

    socket?.emit('speaker', roomCode)
  }, [socket])

  return <>
    {song && <MusicVisualizer song={song} />}
  </>
}

export default Speaker