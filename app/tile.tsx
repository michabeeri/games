import {memo} from "react";

export interface TileProps {
    row: number
    col: number
    isFull?: boolean
    isStandBy?: boolean
}

export const Tile = memo(function ({row, col, isFull, isStandBy}: TileProps) {
    return (<div
        data-key={`row${row}-col${col}`}
        className={`cell ${isFull ? 'bg-black' : 'bg-white'}`}
        style={{
            width: '20px',
            height: '20px',
            border: '1px solid black',
            gridRow: `${row + 1} / ${row + 2}`,
            gridColumn: `${col + 1} / ${col + 2}`,
            backgroundColor: isStandBy  ? 'white' : (isFull ? 'black' : 'white'),
            transition: isStandBy ? 'backgroundColor 0.3s ease-in' : ''
        }}
    />)
} as React.FC<TileProps>)