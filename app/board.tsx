import {rowLength, colLength, gameSpeed} from './config'
import {Tile} from './tile'
import GameContext from './gameContext'
import {useContext, useEffect, useState} from 'react'
import type {CellData, FallingBlock} from './types'
import {matrixProduct, rotation0, rotation270, vectorMatrixProduct} from './math2D'
import {Blocks} from "@/app/blocks";

const randomBlock = (): FallingBlock => {
    const blocks = Object.values(Blocks)
    const blockIndex = Math.floor(Math.random() * blocks.length)
    const block = blocks[blockIndex]
    return {
        center: block.init,
        shape: block.parts,
        rotation: rotation0
    }
}

const verifyPosition = (position: [number, number], cellsData: CellData[][]): boolean => {
    return position[0] >= 0 && position[0] < colLength && position[1] >= 0 && position[1] < rowLength && !cellsData[position[0]][position[1]].isFull
}

export const Board = () => {
    const {cellsDataRef} = useContext(GameContext)
    const [fallingBlock, setFallingBlock] = useState<FallingBlock>({
        center: Blocks.L.init,
        shape: Blocks.L.parts,
        rotation: rotation0
    })

    useEffect(() => {
        const intervalId = setInterval(() => {
            setFallingBlock(({shape, center, rotation}) => {
                const isLegal = shape
                    .map(point => vectorMatrixProduct(point, rotation))
                    .map(([row, col]) => [row + center[0] + 1, col + center[1]])
                    .every(position => verifyPosition(position, cellsDataRef.current))

                if (!isLegal) {
                    shape
                        .map(point => vectorMatrixProduct(point, rotation))
                        .forEach(([row, col]) => {
                            cellsDataRef.current[row + center[0]][col + center[1]].isFull = true
                        })
                    setFallingBlock(randomBlock())
                    // clearInterval(intervalId)
                    // console.log('finished !')
                }

                return {
                    center: [center[0] + (isLegal ? 1 : 0), center[1]],
                    shape,
                    rotation
                }
            })
        }, gameSpeed)

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                setFallingBlock(({shape, center, rotation}) => {
                    const isLegal = shape
                        .map(point => vectorMatrixProduct(point, rotation))
                        .map(([row, col]) => [row + center[0], col + center[1] - 1])
                        .every(position => verifyPosition(position, cellsDataRef.current))
                    return {
                        center: [center[0], center[1] - (isLegal ? 1 : 0)],
                        shape,
                        rotation
                    }
                })
            } else if (e.key === 'ArrowRight') {
                setFallingBlock(({shape, center, rotation}) => {
                    const isLegal = shape
                        .map(point => vectorMatrixProduct(point, rotation))
                        .map(([row, col]) => [row + center[0], col + center[1] + 1])
                        .every(position => verifyPosition(position, cellsDataRef.current))
                    return {
                        center: [center[0], center[1] + (isLegal ? 1 : 0)],
                        shape,
                        rotation
                    }
                })
            } else if (e.key === 'ArrowUp') {
                setFallingBlock(({shape, center, rotation}) => {
                    const newRot = matrixProduct(rotation, rotation270)
                    const isLegal = shape
                        .map(point => vectorMatrixProduct(point, newRot))
                        .map(([row, col]) => [row + center[0], col + center[1]])
                        .every(position => verifyPosition(position, cellsDataRef.current))
                    return {
                        center: [center[0], center[1]],
                        shape,
                        rotation: isLegal ? newRot : rotation
                    }
                })
            }
        })

    }, [])

    const {shape, center, rotation} = fallingBlock
    const positions = shape
        .map(point => vectorMatrixProduct(point, rotation))
        .map(([row, col]) => [row + center[0], col + center[1]])

    return (<div className="board"
         style={{
             display: 'grid',
             gridTemplateColumns: `repeat(${rowLength}, 20px)`,
             gridTemplateRows: `repeat(${colLength}, 20px)`
         }}>
        {cellsDataRef.current.flatMap((col, i) => (
            col.map((cell, j) => (<Tile
                key={`row${i}-col${j}`}
                row={i}
                col={j}
                isFull={cell.isFull || positions.some(([x, y]) => x === i && y === j)}/>)
            )
        ))}
    </div>)
}