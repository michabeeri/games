import styles from './tile.module.css'
import {memo} from "react";

export interface TileProps {
    row: number
    col: number
    isFull?: boolean
    isStandBy?: boolean
}

export const Tile = memo(function ({row, col, isFull, isStandBy}: TileProps) {
    return (<>
        <div
            data-key={`row${row}-col${col}-shadow`}
            className={Object.entries({
                [styles.tile]: true,
                [styles.shadow]: true,
                [styles.full]: isFull,
                [styles.standBy]: isStandBy
            }).reduce((acc, [key, value]) => value ? `${acc} ${key}` : acc, '')}
            style={{
                gridRow: `${row + 1} / ${row + 2}`,
                gridColumn: `${col + 1} / ${col + 2}`
            }}
        />
        <div
            data-key={`row${row}-col${col}-overlay`}
            className={Object.entries({
                [styles.tile]: true,
                [styles.overlay]: true,
                [styles.full]: isFull,
                [styles.standBy]: isStandBy
            }).reduce((acc, [key, value]) => value ? `${acc} ${key}` : acc, '')}
            style={{
                gridRow: `${row + 1} / ${row + 2}`,
                gridColumn: `${col + 1} / ${col + 2}`
            }}
        />
    </>)
} as React.FC<TileProps>)