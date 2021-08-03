
import { Game, Song } from 'mewseek'
import { SocketContext } from 'context'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { PreGameScreen } from './templates'
import './GameScreen.scss'

const GameScreen = (): JSX.Element => {
  const { roomCode } = useParams<{ roomCode: string }>()
  const history = useHistory()
  const socket = useContext(SocketContext)
  const [isMounted, setMounted] = useState(true)

  const [game, setGame] = useState<Game>()

  const startGame = () => {
    socket?.emit('startGame', roomCode)
  }

  const leaveGame = () => {
    socket?.emit('leaveGame', roomCode)
    history.push('/')
  }

  const joinedGame = () => {
    socket?.emit('getGameData', roomCode)
  }

  const nextRound = (game: Game) => {
    setGame(game)
  }

  const playerAnswer = (song: Song) => {
    socket?.emit('playerAnswer', song)
  }

  const onGameData = (game: Game) => {
    if (isMounted) {
      if (!game) {
        history.push('/')
        setMounted(false)
      } else {
        setGame(game)
      }
    }
  }

  const endRound = (game: Game) => {
    setGame(game)
  }

  useEffect(() => {
    socket?.on('gameData', onGameData)
    socket?.on('nextRound', nextRound)
    socket?.on('endRound', endRound)
    socket?.on('joinedGame', joinedGame)

    const updateInterval = setInterval(() => {
      socket?.emit('getGameData', roomCode)
    }, 0, 3000)

    return () => {
      clearInterval(updateInterval)
      setMounted(false)
    }
  }, [])

  if (game?.status == 'ROUND-OVER') {
    return <PreGameScreen>
      <h1>Leaderboard</h1>
      <ul id='players' className='leaderboard'>
        {game.leaderboard
          .sort((e1, e2) => e1.place - e2.place)
          .map((player, index) =>
            <li key={`place-${index}`}>
              <b>{player.place}</b>
              <u>{player.nickname}</u>
              <i className={player.lastAnswerCorrect ? 'correct' : 'wrong'}>{player.score}</i>
            </li>
          )}
      </ul>
    </PreGameScreen>
  }

  return <PreGameScreen>
    {game?.currentRound ? <>
      <h1>Round {game.roundNumber}</h1>
      {/* {song && <MusicVisualizer song={song} />} */}
      {game.currentRound.options.map((answer, index) =>
        <button key={`answer-${index}`} className='answer' onClick={() => playerAnswer(answer)}>
          <img src={answer.album.images[2].url}></img>
          <div>
            <p className='title'>{answer.name}</p>
            <p className='artist'>{answer.artists[0].name}</p>
          </div>
        </button>)}
    </> : <>
      {game?.gameStart ?
        <h1>Game Starting in {Math.floor((game.gameStart - Date.now()) / 1000)}</h1> :
        <>
          <h4>ROOM CODE</h4>
          <h1 style={{ fontSize: '6rem', fontFamily: 'Trebuchet MS', fontWeight: 'bold' }}><a>{game?.roomCode}</a></h1>
        </>}


      <h1>Players</h1>
      <ul id='players'>
        {game?.players.map((player, index) =>
          <li key={`player-${index}`}>
            {player.socketId == game.hostSocketId && "👑"} {` `}
            {player.nickname}</li>
        )}
      </ul>
      <div id='menu-container'>
        {game?.hostSocketId == socket?.id && <button
          className='titleButton primary'
          onClick={startGame}>
          Start
        </button>}
        <button
          className='titleButton'
          onClick={leaveGame}>
          Leave
        </button>
      </div>
    </>}
  </PreGameScreen>
}

export default GameScreen