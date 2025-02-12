"use client"
import {rowLength, colLength, gameSpeed} from './config'
import type {CellData, FallingBlock} from './types'
import {RefObject, useEffect, useRef, useState} from 'react'
import {Board} from './board'
import GameContext from './gameContext'
import {Matrix2D, matrixProduct, Point2D, rotation0, rotation270, vectorMatrixProduct} from "@/app/math2D";
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

interface BlockMoveOptions {
    delta?: Point2D
    angle?: Matrix2D
    onFailure?: (fallingBlock: FallingBlock) => void
}
const tryMoveBlock = (
    cellsData: CellData[][],
    fallingBlock: FallingBlock,
    onSuccess: (fallingBlock: FallingBlock) => void,
    options: BlockMoveOptions = {}
) => {
    const {shape, center, rotation} = fallingBlock
    const delta = options.delta || [0, 0]
    const angle = options.angle || rotation0
    const adjustedCenter = [center[0] + delta[0], center[1] + delta[1]]
    const adjustedRotation = matrixProduct(rotation, angle)
    const adjustedShape = shape
        .map(point => vectorMatrixProduct(point, adjustedRotation))
        .map(([row, col]) => [row + adjustedCenter[0], col + adjustedCenter[1]])
    const adjustedBlock = {
        center: adjustedCenter,
        shape: shape,
        rotation: adjustedRotation
    }
    const isLegit = adjustedShape.every(position => verifyPosition(position, cellsData))
    if (isLegit) {
        onSuccess(adjustedBlock)
    } else if (options.onFailure){
        options.onFailure(fallingBlock)
    }
}

function GameContextProvider() {
    const cellsDataRef: RefObject<CellData[][]> = useRef<CellData[][]>(Array.from({ length: colLength }).map((_, i) => (
        Array.from({ length: rowLength }).map((_, j) => ({
            row: i,
            col: j,
            isFull: false
        }))
    )));
    const [fallingBlock, setFallingBlock] = useState<FallingBlock>({
        center: Blocks.L.init,
        shape: Blocks.L.parts,
        rotation: rotation0
    })
    const fallingBlockRef = useRef(fallingBlock)
    useEffect(() => {
        fallingBlockRef.current = fallingBlock
    }, [fallingBlock])

    useEffect(() => {
        const _tryMoveBlock = (options?: BlockMoveOptions) => tryMoveBlock(cellsDataRef.current, fallingBlockRef.current, setFallingBlock, options)

        setInterval(() => {
            _tryMoveBlock({delta: [1, 0], onFailure: fallingBlock => {
                const {shape, center, rotation} = fallingBlock
                shape
                    .map(point => vectorMatrixProduct(point, rotation))
                    .map(([row, col]) => [row + center[0], col + center[1]])
                    .forEach(([row, col]) => cellsDataRef.current[row][col].isFull = true)
                setFallingBlock(randomBlock())
            }})
        }, gameSpeed)

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                _tryMoveBlock({delta: [0, -1]})
            } else if (e.key === 'ArrowRight') {
                _tryMoveBlock({delta: [0, 1]})
            } else if (e.key === 'ArrowUp') {
                _tryMoveBlock({angle: rotation270})
            }  else if (e.key === 'ArrowDown') {
                _tryMoveBlock({delta: [1, 0]})
            }
        })

    }, [])
    return (
        <GameContext.Provider value={{cellsDataRef}}>
            <Board fallingBlock={fallingBlock} />
        </GameContext.Provider>
    )
}

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
        <GameContextProvider/>
    </main>
  );
}
