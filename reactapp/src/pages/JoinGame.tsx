import React from 'react'
import { useContext } from 'react'
import { SocketContext } from 'context'
import { PreGameScreen } from './templates'
import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useEffect } from 'react'

const JoinGame = (): JSX.Element => {
  const history = useHistory()
  const socket = useContext(SocketContext)

  const { defaultRoomCode } = useParams<{ defaultRoomCode: string }>()

  const [nickname, setNickname] = useState('')
  const [roomCode, setRoomCode] = useState(defaultRoomCode)

  const joinGame = () => {
    if (nickname == '') {
      Swal.fire({
        icon: 'error',
        title: "Error!",
        text: "Nickname cannot be empty"
      })
      return
    }

    socket?.emit('joinGame', roomCode.toUpperCase(), nickname)
  }

  useEffect(() => {
    socket?.on('joinedGame', game => {
      history.push(`/${game.roomCode}`)
    })
  }, [socket])

  return <PreGameScreen>
    <div id='menu-container'>
      {defaultRoomCode != undefined ||
        <input
          className='titleInput'
          placeholder="ROOM CODE"
          style={{ textTransform: 'uppercase' }}
          value={roomCode}
          onChange={e => setRoomCode(e.target.value)} />
      }

      <input
        className='titleInput'
        placeholder="NICKNAME"
        value={nickname}
        onChange={e => setNickname(e.target.value)} />

      <button
        className='titleButton primary'
        onClick={joinGame}>
        Join
      </button>

      <a href='/'>
        <button className='titleButton'>
          Go Back
        </button>
      </a>
    </div>
  </PreGameScreen>
}

export default JoinGame
