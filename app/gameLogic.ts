import type {CellData, FallingBlock} from './types'
import {colLength, rowLength} from "@/app/config";
import {Blocks} from "@/app/blocks";
import {Matrix2D, matrixProduct, Point2D, rotation0, rotation270, vectorMatrixProduct} from "@/app/math2D";
import {GameData} from "./types";

const emptyBlock: FallingBlock = {
    center: [0, 0],
    shape: [],
    rotation: rotation0
}

class GameLogic {
    private cellsData: CellData[][]
    private fallingBlock?: FallingBlock
    private standByRows: number[]
    constructor() {
        this.cellsData = Array.from({ length: colLength }).map((_, i) => (
            Array.from({ length: rowLength }).map((_, j) => ({
                isFull: false,
                isStandBy: false
            }))))
        this.fallingBlock = undefined
        this.standByRows = []
    }

    _reset(): void {
        this.cellsData = Array.from({ length: colLength }).map((_, i) => (
            Array.from({ length: rowLength }).map((_, j) => ({
                isFull: false,
                isStandBy: false
            }))))
        this.fallingBlock = undefined
        this.standByRows = []
    }

    getGameContext(): GameData {
        return {
            cellsData: this.cellsData,
            fallingBlock: this.fallingBlock ?? emptyBlock
        }
    }

    _createFallingBlock(): void {
        const blocks = Object.values(Blocks)
        const blockIndex = Math.floor(Math.random() * blocks.length)
        const block = blocks[blockIndex]
        this.fallingBlock = {
            center: block.init,
            shape: block.parts,
            rotation: rotation0
        }
    }

    _markStandbyRows(suspectRows: number[] = Array.from({ length: colLength }, (value, index) => index)) {
        this.standByRows = suspectRows.reduce((indexes: number[], rowIndex: number) => {
            if (this.cellsData[rowIndex].every(cell => cell.isFull)) {
                indexes.push(rowIndex)
            }
            return indexes
        }, [])
        this.standByRows.forEach(rowIndex => {this.cellsData[rowIndex].forEach(cell => cell.isStandBy = true)})
    }

    _tryMoveBlock(delta: Point2D, angle: Matrix2D): boolean {
        const {shape, center, rotation} = this.fallingBlock!
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
        const isLegit = adjustedShape.every(position =>  position[0] >= 0 && position[0] < colLength && position[1] >= 0 && position[1] < rowLength && !this.cellsData[position[0]][position[1]].isFull)
        if (isLegit) {
            this.fallingBlock!.center = adjustedCenter as Point2D
            this.fallingBlock!.rotation = adjustedRotation
            return true
        }
        return false
    }

    moveLeft(): boolean {
        return this.fallingBlock ? this._tryMoveBlock([0, -1], rotation0) : false
    }

    moveRight(): boolean {
        return this.fallingBlock ? this._tryMoveBlock([0, 1], rotation0) : false
    }

    moveDown(): boolean {
        if (this.fallingBlock) {
            this._moveDownAndHandleConsequence()
            return true
        }
        return false
    }

    rotate(): boolean {
        return this.fallingBlock ? this._tryMoveBlock([0, 0], rotation270) : false
    }

    _removeStandByRows(): void {
        this.standByRows.forEach(rowIndex => {
            this.cellsData.splice(rowIndex, 1)
            this.cellsData.unshift(Array.from({ length: rowLength }).map((_, j) => ({
                isFull: false,
                isStandBy: false
            })))
        })
        this.standByRows = []
    }

    _moveDownAndHandleConsequence(): void {
        if (!this._tryMoveBlock([1, 0], rotation0)) {
            const {shape, center, rotation} = this.fallingBlock!
            const newFullCells = shape
                .map(point => vectorMatrixProduct(point, rotation))
                .map(([row, col]) => [row + center[0], col + center[1]])

            newFullCells.forEach(([row, col]) => this.cellsData[row][col].isFull = true)
            this._markStandbyRows(Array.from(new Set(newFullCells.map(([row]) => row))).sort())
            this.fallingBlock = undefined
        }
    }

    step() {
        if (this.standByRows.length > 0) {
            this._removeStandByRows()
            this._createFallingBlock()
        } else if (!this.fallingBlock) {
            this._createFallingBlock()
        } else {
            this._moveDownAndHandleConsequence()
        }
    }
}

const instance = new GameLogic()
export default instance