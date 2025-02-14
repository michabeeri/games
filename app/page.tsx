"use client"
import {rowLength, colLength, gameSpeed} from './config'
import type {CellData, FallingBlock} from './types'
import {RefObject, useEffect, useRef, useState} from 'react'
import {Board} from './board'
import {Matrix2D, matrixProduct, Point2D, rotation0, rotation270, vectorMatrixProduct} from "@/app/math2D";
import {Blocks} from "@/app/blocks";
import gameLogic from "@/app/gameLogic";
import {GameData} from "./types";

export default function Page() {
    const gameData = gameLogic.getGameContext()
    const [renderRoot, setRenderRoot] = useState(false)
    const forceRender = () => setRenderRoot(root => !root)

    useEffect(() => {
        setInterval(() => {
            gameLogic.step()
            forceRender()
        }, gameSpeed)

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && gameLogic.moveLeft()) {
                forceRender()
            } else if (e.key === 'ArrowRight' && gameLogic.moveRight()) {
                forceRender()
            } else if (e.key === 'ArrowUp' && gameLogic.rotate()) {
                forceRender()
            }  else if (e.key === 'ArrowDown' && gameLogic.moveDown()) {
                forceRender()
            }
        })

    }, [])

  return (
    <main className="flex min-h-screen flex-col p-6">
        <Board renderRoot={renderRoot}/>
    </main>
  );
}
