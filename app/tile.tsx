export interface TileProps {
    row: number
    col: number
    isFull: boolean
}

export function Tile({row, col, isFull}: TileProps) {
    return (<div
        data-key={`row${row}-col${col}`}
        className={`cell ${isFull ? 'bg-black' : 'bg-white'}`}
        style={{
            width: '20px',
            height: '20px',
            border: '1px solid black',
            gridRow: `${row + 1} / ${row + 2}`,
            gridColumn: `${col + 1} / ${col + 2}`,
            backgroundColor: isFull ? 'black' : 'white'
        }}
    />)
}