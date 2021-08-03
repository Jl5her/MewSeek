import React from 'react'

type InGameScreenProps = {
  children?: JSX.Element | JSX.Element[]
}

const InGameScreen = ({ children }: InGameScreenProps): JSX.Element => {
  return <>{children}</>
}

export default InGameScreen