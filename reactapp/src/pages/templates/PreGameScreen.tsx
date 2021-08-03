import React from 'react'
import './PreGameScreen.scss'

type PreGameScreenProps = {
  children?: JSX.Element | JSX.Element[]
}

const PreGameScreen = ({ children }: PreGameScreenProps): JSX.Element => {
  return <>
    <div id='header-container'>
      <h1>MewSeek</h1>
    </div>
    <div id='main-container'>
      <div id='children-container'>
        {children}
      </div>
    </div>
    <div id='footer-container'><p>Created by <a href='https://jackp.me/'>Jack Pfeiffer</a></p></div>
  </>
}

export default PreGameScreen