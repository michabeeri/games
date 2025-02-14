import {Block} from './types'

export const Blocks: Record<string, Block> = {
    L: {
        init: [1, 4],
        parts: [[-1, 0], [0, 0], [1, 0], [1, 1]],
    },
    J:  {
        init: [1, 5],
        parts: [[-1, 0], [0, 0], [1, 0], [1, -1]]
    },
    O: {
        init: [0, 4],
        parts:[[0, 0], [1, 0], [1, 1], [0, 1]]
    },
    Z: {
        init: [0, 5],
        parts: [[-1, 0], [0, 0], [1, 0], [1, 1]]
    },
    S: {
        init: [0, 4],
        parts: [[0, 1], [0, 0], [1, 0], [-1, 1]]
    },
    T: {
        init: [0, 4],
        parts: [[0, -1], [0, 0], [0, 1], [1, 0]],
    },
    I: {
        init: [1, 4],
        parts: [[-1, 0], [0, 0], [1, 0], [2, 0]]
     }
}