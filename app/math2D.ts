export type Point2D = [number, number]
export type Matrix2D = [[number, number], [number, number]]
export const rotation0: Matrix2D = [[1, 0], [0, 1]]
export const rotation270: Matrix2D = [[0, 1], [-1, 0]]

export const matrixProduct = (a: Matrix2D, b: Matrix2D) => {
    return a.map((row, i) => row.map((_, j) => row.reduce((acc, _, k) => acc + a[i][k] * b[k][j], 0)))
}

export const vectorMatrixProduct = (point: Point2D, mat: Matrix2D) => {
    return [point[0] * mat[0][0] + point[1] * mat[0][1], point[0] * mat[1][0] + point[1] * mat[1][1]]
}