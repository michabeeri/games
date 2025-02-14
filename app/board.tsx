import {rowLength, colLength, gameSpeed} from './config'
import {Tile} from './tile'
import gameLogic from './gameLogic'
import {useContext, useEffect, useState} from 'react'
import type {CellData, FallingBlock, GameData} from './types'
import {matrixProduct, rotation0, rotation270, vectorMatrixProduct} from './math2D'
import {Blocks} from "@/app/blocks";

export const Board = () => {
    const gameData = gameLogic.getGameContext()
    const {shape, center, rotation} = gameData.fallingBlock
    const positions = shape
        .map(point => vectorMatrixProduct(point, rotation))
        .map(([row, col]) => [row + center[0], col + center[1]])

    return (<div className="board"
         style={{
             display: 'grid',
             gridTemplateColumns: `repeat(${rowLength}, 20px)`,
             gridTemplateRows: `repeat(${colLength}, 20px)`
         }}>
        {gameData.cellsData.flatMap((col, i) => (
            col.map((cell, j) => (<Tile
                key={`row${i}-col${j}`}
                row={i}
                col={j}
                isFull={cell.isFull || positions.some(([x, y]) => x === i && y === j)}
                isStandBy={cell.isStandBy}/>)
            )
        ))}
    </div>)
}