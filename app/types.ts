import type {Point2D} from './math2D'
import type {RefObject} from 'react'

export interface Block {
    init: Point2D
    parts: Point2D[]
}

export interface FallingBlock {
    center: Point2D
    shape: Point2D[]
    rotation: Point2D[]
}

export interface CellData {
    row: number
    col: number
    isFull: boolean
}

export interface GameData {
    cellsDataRef: RefObject<CellData[][]>
}