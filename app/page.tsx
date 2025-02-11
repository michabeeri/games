"use client"
import {rowLength, colLength} from './config'
import type {CellData} from './types'
import {RefObject, useRef} from 'react'
import {Board} from './board'
import GameContext from './gameContext'

function GameContextProvider({children}) {
    const cellsData: CellData[][] = Array.from({ length: colLength }).map((_, i) => (
        Array.from({ length: rowLength }).map((_, j) => ({
            row: i,
            col: j,
            isFull: false
        }))
    ))
    const cellsDataRef: RefObject<CellData[][]> = useRef<CellData[][]>(cellsData);
    return <GameContext.Provider value={{cellsDataRef}}>{children}</GameContext.Provider>
}

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
        <GameContextProvider>
          <Board/>
        </GameContextProvider>
    </main>
  );
}
