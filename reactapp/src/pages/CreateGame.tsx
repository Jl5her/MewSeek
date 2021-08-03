import { SocketContext } from 'context'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'
import { PreGameScreen } from './templates'

const CreateGame = (): JSX.Element => {
  const history = useHistory()
  const [nickname, setNickname] = useState('')
  const socket = useContext(SocketContext)

  const createGame = () => {
    if (nickname == '') {
      Swal.fire({
        icon: 'error',
        title: "Error!",
        text: "Nickname cannot be empty"
      })
      return
    }
    socket?.emit('createGame', nickname)
  }

  useEffect(() => {

    socket?.on('createdGame', game => {
      history.push(`/${game.roomCode}`)
    })
  })

  return <PreGameScreen>
    <div id='menu-container'>
      <input
        className='titleInput'
        placeholder="NICKNAME"
        value={nickname}
        onChange={e => setNickname(e.target.value)} />


      <button
        className='titleButton primary'
        onClick={createGame}>
        Create
      </button>

      <a href='/'>
        <button className='titleButton'>
          Go Back
        </button>
      </a>
    </div>
  </PreGameScreen>
}

export default CreateGame
