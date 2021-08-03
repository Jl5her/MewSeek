import React from 'react'
import { PreGameScreen } from './templates'

const HomeScreen = (): JSX.Element => (
  <PreGameScreen>
    <div id='menu-container'>
      <a href='/create'>
        <button className='titleButton primary'>Create Game</button>
      </a>
      <a href='/join'>
        <button className='titleButton primary'>Join Game</button>
      </a>
    </div>
  </PreGameScreen>
)

export default HomeScreen
