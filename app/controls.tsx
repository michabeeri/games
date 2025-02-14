import styles from './controls.module.css'
import { ArrowLeft, ArrowRight, ArrowDown, RotateCcw } from 'lucide-react'

export interface ControlPanelProps {
    onLeft: () => void
    onRight: () => void
    onDown: () => void
    onRotate: () => void
}

export const ControlPanel = ({onLeft, onRight, onDown, onRotate}: ControlPanelProps) => {
    return (
        <div className={'flex flex-col items-center space-y-2 ' + styles.controls}>
            <button
                onClick={onRotate}
                style={{
                    gridColumnStart: 3,
                    gridRowStart: 1,
                    gridRowEnd: 2
                }}
                className={'w-12 h-12 flex items-center justify-center rounded-full border border-white text-white hover:bg-white/20 transition ' + styles.button}
            >
                <RotateCcw size={24}/>
            </button>
            <button
                onClick={onLeft}
                style={{
                    gridColumnStart: 1,
                    gridRowStart: 3,
                    gridRowEnd: 4
                }}
                className={'w-12 h-12 flex items-center justify-center rounded-full border border-white text-white hover:bg-white/20 transition ' + styles.button}
            >
                <ArrowLeft size={24}/>
            </button>
            <button
                onClick={onDown}
                style={{
                    gridColumnStart: 3,
                    gridRowStart: 3,
                    gridRowEnd: 4
                }}
                className={'w-12 h-12 flex items-center justify-center rounded-full border border-white text-white hover:bg-white/20 transition ' + styles.button}
            >
                <ArrowDown size={24}/>
            </button>
            <button
                onClick={onRight}
                style={{
                    gridColumnStart: 5,
                    gridRowStart: 3,
                    gridRowEnd: 4
                }}
                className={'w-12 h-12 flex items-center justify-center rounded-full border border-white text-white hover:bg-white/20 transition ' + styles.button}
            >
                <ArrowRight size={24}/>
            </button>
        </div>
    );
}
