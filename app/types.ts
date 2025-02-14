import type {Point2D, Matrix2D} from './math2D'
import type {RefObject} from 'react'

export interface Block {
    init: Point2D
    parts: Point2D[]
}

export interface FallingBlock {
    center: Point2D
    shape: Point2D[]
    rotation: Matrix2D
}

export interface CellData {
    isFull: boolean
    isStandBy: boolean
}

export interface GameData {
    cellsData: CellData[][]
    fallingBlock: FallingBlock
}