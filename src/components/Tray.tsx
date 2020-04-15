import React, { useState } from 'react'

import { GAME_STATE } from '../lib/constants'
import { MinesweeperBoard } from '../types'

interface RenderPropProps {
  gameState: number // For the state of the smiley face
  numberOfMines: number // For the text display
  seconds: number // For the text display
}

type RenderProp = (props: RenderPropProps) => React.ReactElement | null

interface TrayProps {
  board: MinesweeperBoard
  children: RenderProp
  gameState: GAME_STATE
}

export const Tray: React.FC<TrayProps> = ({children, gameState}) => {
  const [numberOfMines, setNumberOfMines] = useState(0)
  const [seconds, setSeconds] = useState(0)

  return children({gameState, numberOfMines, seconds})
}

interface XPTrayProps extends Omit<TrayProps, 'children'>, React.HTMLAttributes<HTMLElement> {}

export const XPTray: React.FC<XPTrayProps> = ({board, children, gameState, ...props}) => {
  return (
    <Tray board={board} gameState={gameState}>
      {({gameState, numberOfMines, seconds}) => {
        return <main {...props}>
          {children}
        </main>
      }}
    </Tray>
  )
}

export default XPTray