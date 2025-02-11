"use client"
import {useEffect, useState} from "react"
import {clearInterval} from "timers";

const rowLength = 10
const colLength = 20

interface CellData {
    row: number
    col: number
    isFull: boolean
}

interface Piece {
    center: [number, number]
    shape: [number, number][]
    rotation: Matrix2D
}

type Matrix2D = number[][]

const cellsData: CellData[][] = Array.from({ length: colLength }).map((_, i) => (
    Array.from({ length: rowLength }).map((_, j) => ({
        row: i,
        col: j,
        isFull: false
    }))
))

const rotation0: Matrix2D = [[1, 0], [0, 1]]
const rotation270: Matrix2D = [[0, 1], [-1, 0]]

const tetrisPieces: Record<string, Piece> = {
    L: {
        center: [1, 4],
        shape: [[-1, 0], [0, 0], [1, 0], [1, 1]],
        rotation: rotation0
    },
    // J: [
    //     [0, 1],
    //     [0, 1],
    //     [1, 1]
    // ],
    // O: [
    //     [1, 1],
    //     [1, 1]
    // ],
    // Z: [
    //     [1, 1, 0],
    //     [0, 1, 1]
    // ],
    // S: [
    //     [0, 1, 1],
    //     [1, 1, 0]
    // ],
    // T: [
    //     [1, 1, 1],
    //     [0, 1, 0]
    // ],
    // I: [
    //     [1],
    //     [1],
    //     [1],
    //     [1]
    // ]
}

const gameSpeed = 500

const matrixMultiply = (a: Matrix2D, b: Matrix2D) => {
    return a.map((row, i) => row.map((_, j) => row.reduce((acc, _, k) => acc + a[i][k] * b[k][j], 0)))
}

const calcPosition = (point: [number, number], rotation: Matrix2D) => {
    return [point[0] * rotation[0][0] + point[1] * rotation[0][1], point[0] * rotation[1][0] + point[1] * rotation[1][1]]
}

const verifyPosition = (position: [number, number], cellsData: CellData[][]): boolean => {
    return position[0] >= 0 && position[0] < colLength && position[1] >= 0 && position[1] < rowLength && !cellsData[position[0]][position[1]].isFull
}

export default function Page() {
    const [piece, setPiece] = useState<Piece>(tetrisPieces.L)

    useEffect(() => {
        console.log('used effect')
        const intervalId = setInterval(() => {
            setPiece(({shape, center, rotation}) => {
                const isLegal = shape
                    .map(point => calcPosition(point, rotation))
                    .map(([row, col]) => [row + center[0] + 1, col + center[1]])
                    .every(position => verifyPosition(position, cellsData))

                if (!isLegal) {
                    shape
                        .map(point => calcPosition(point, rotation))
                        .forEach(([row, col]) => {
                            cellsData[row + center[0]][col + center[1]].isFull = true
                        })
                    setPiece(tetrisPieces.L)
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
                setPiece(({shape, center, rotation}) => {
                    const isLegal = shape
                        .map(point => calcPosition(point, rotation))
                        .map(([row, col]) => [row + center[0], col + center[1] - 1])
                        .every(position => verifyPosition(position, cellsData))
                    return {
                        center: [center[0], center[1] - (isLegal ? 1 : 0)],
                        shape,
                        rotation
                    }
                })
            } else if (e.key === 'ArrowRight') {
                setPiece(({shape, center, rotation}) => {
                    const isLegal = shape
                        .map(point => calcPosition(point, rotation))
                        .map(([row, col]) => [row + center[0], col + center[1] + 1])
                        .every(position => verifyPosition(position, cellsData))
                    return {
                        center: [center[0], center[1] + (isLegal ? 1 : 0)],
                        shape,
                        rotation
                    }
                })
            } else if (e.key === 'ArrowUp') {
                setPiece(({shape, center, rotation}) => {
                    const newRot = matrixMultiply(rotation, rotation270)
                    const isLegal = shape
                        .map(point => calcPosition(point, newRot))
                        .map(([row, col]) => [row + center[0], col + center[1]])
                        .every(position => verifyPosition(position, cellsData))
                    return {
                        center: [center[0], center[1]],
                        shape,
                        rotation: isLegal ? newRot : rotation
                    }
                })
            }
        })

    }, [])

    const {shape, center, rotation} = piece
    const positions = shape
        .map(point => calcPosition(point, rotation))
        .map(([row, col]) => [row + center[0], col + center[1]])

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="board"
        style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${rowLength}, 20px)`,
            gridTemplateRows: `repeat(${colLength}, 20px)`
        }}>
          {cellsData.flatMap((col, i) => (
              col.map((cell, j) => {
                  const isFull = cell.isFull || positions.some(([x, y]) => x === i && y === j)
                  return (<div
                      key={`row${i}-col${j}`}
                      data-key={`row${i}-col${j}`}
                      className={`cell ${isFull ? 'bg-black' : 'bg-white'}`}
                      style={{
                          width: '20px',
                          height: '20px',
                          border: '1px solid black',
                          gridRow: `${i + 1} / ${i + 2}`,
                          gridColumn: `${j + 1} / ${j + 2}`,
                          backgroundColor: isFull ? 'black' : 'white'
                      }}
                  />)
              })
          ))}
      </div>
    </main>
  );
}
