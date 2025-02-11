import { createContext } from 'react'
import {GameData} from './types'
const GameContext = createContext<GameData | null>(null)
export default GameContext