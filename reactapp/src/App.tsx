import React, { useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import { SocketContext } from 'context'
import { CreateGame, GameScreen, HomeScreen, JoinGame, Speaker } from 'pages'
import io from 'socket.io-client'
import 'semantic-ui-css/semantic.min.css'
import 'App.scss'
import Swal from 'sweetalert2'

const App = (): JSX.Element => {
  const socket = io('http://192.168.68.166:8080/')

  useEffect(() => {
    socket.on('error', msg =>
      Swal.fire({
        icon: 'error',
        title: "An error has occurred!",
        text: msg
      }))
  }, [])

  return <SocketContext.Provider value={socket}>
    <Switch>
      <Route path='/create' component={CreateGame} />
      <Route path='/join/:defaultRoomCode' component={JoinGame} />
      <Route path='/join' component={JoinGame} />
      <Route path='/speaker/:roomCode' component={Speaker} />
      <Route path='/:roomCode' component={GameScreen} />
      <Route path='/' component={HomeScreen} />
    </Switch>
  </SocketContext.Provider>


}

export default App
