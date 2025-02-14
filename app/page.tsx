"use client"
import {rowLength, colLength, gameSpeed} from './config'
import type {CellData, FallingBlock} from './types'
import {RefObject, useEffect, useRef, useState} from 'react'
import {Board} from './board'
import {ControlPanel} from "@/app/controls";
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

        document.body.style.overflow = 'hidden'
        document.body.style.height = '100%'
        document.addEventListener("dblclick", (e) => {e.preventDefault()})
    }, [])

  return (
    <main
        className='flex min-h-screen flex-col p-6'
        style={{
            backgroundImage: 'url(/background-1.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            display: 'grid',
            gridTemplateColumns: '50fr 240px 50fr',
            gridTemplateRows: '25fr 440px 25fr 140px 50fr'
        }}>
        <div
        style={{
            backgroundImage: 'url(/frame-1.png)',
            backgroundSize: '113% 104%',
            backgroundPosition: 'center',
            padding: '17px 17px 23px 23px',
            gridColumnStart: 2,
            gridRowStart: 2,
            gridRowEnd: 3
        }}>
            <Board renderRoot={renderRoot}/>
        </div>
        <ControlPanel
            onLeft={() => gameLogic.moveLeft() && forceRender()}
            onRight={() => gameLogic.moveRight() && forceRender()}
            onDown={() => gameLogic.moveDown() && forceRender()}
            onRotate={() => gameLogic.rotate() && forceRender()}/>
    </main>
  );
}
