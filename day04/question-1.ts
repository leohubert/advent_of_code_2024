import fs from "fs";
import path from "path";
import {max, maxBy, minBy} from "lodash";

type Position = {x: number, y: number}

function isXmas(lines: string[], positions: Position[]) {
    let maxXPosition = lines[0].length - 1;
    let maxYPosition = lines.length - 1;
    const maxX = maxBy(positions, 'x')!.x
    const minX = minBy(positions, 'x')!.x
    const maxY = maxBy(positions, 'y')!.y
    const minY = minBy(positions, 'y')!.y

    if (minX < 0 || minY < 0 || maxX > maxXPosition || maxY > maxYPosition) {
        return false
    }

    let search = 'XMAS'
    let i = 0;
    for (const position of positions) {
        if (lines[position.y][position.x] != search[i]) {
            return false
        }
        i++
    }

    return true
 }

function exploreXmas(lines: string[], x: number, y: number): Position[][] {

    let positions = []

    const horizonRight: Position[] = [
        {x, y},
        {x: x + 1, y},
        {x: x + 2, y},
        {x: x + 3, y},
    ]

    if (isXmas(lines, horizonRight)) {
        positions.push(horizonRight)
    }

    const horizonLeft: Position[] = [
        {x, y},
        {x: x - 1, y},
        {x: x - 2, y},
        {x: x - 3, y},
    ]

    if (isXmas(lines, horizonLeft)) {
        positions.push(horizonLeft)
    }

    const verticalTop: Position[] = [
        {x, y},
        {x, y: y - 1},
        {x, y: y - 2},
        {x, y: y - 3},
    ]
    if (isXmas(lines, verticalTop)) {
        positions.push(verticalTop)
    }

    const verticalBottom: Position[] = [
        {x, y},
        {x, y: y + 1},
        {x, y: y + 2},
        {x, y: y + 3},
    ]
    if (isXmas(lines, verticalBottom)) {
        positions.push(verticalBottom)
    }

    const diagTopRight: Position[] = [
        {x, y},
        {x: x + 1, y: y - 1},
        {x: x + 2, y: y - 2},
        {x: x + 3, y: y - 3},
    ]
    if (isXmas(lines, diagTopRight)) {
        positions.push(diagTopRight)
    }

    const diagTopLeft: Position[] = [
        {x, y},
        {x: x - 1, y: y - 1},
        {x: x - 2, y: y - 2},
        {x: x - 3, y: y - 3},
    ]
    if (isXmas(lines, diagTopLeft)) {
        positions.push(diagTopLeft)
    }


    const diagBottomRight: Position[] = [
        {x, y},
        {x: x + 1, y: y + 1},
        {x: x + 2, y: y + 2},
        {x: x + 3, y: y + 3},
    ]
    if (isXmas(lines, diagBottomRight)) {
        positions.push(diagBottomRight)
    }

    const diagBottomLeft: Position[] = [
        {x, y},
        {x: x - 1, y: y + 1},
        {x: x - 2, y: y + 2},
        {x: x - 3, y: y + 3},
    ]

    if (isXmas(lines, diagBottomLeft)) {
        positions.push(diagBottomLeft)
    }

    return positions
}

async function run(file: string) {
    const input = fs.readFileSync(path.join(__dirname, file)).toString();

    const lines = input.split('\n')

    let x = 0;
    let y = 0;
    let xLength = lines[0].length;
    let yLength = lines.length;

    const finalTable = Array.from({length: yLength}).map(() => Array.from({length: xLength}).map(() => '.'))

    let total = 0
    while(x < xLength && y < yLength) {
        const line = lines[y];
        const char = line[x];

        if (char === 'X') {
            const allPositions = exploreXmas(lines, x, y)
            if (allPositions.length) {
                total += allPositions.length;
                for (const positions of allPositions) {
                    for (const position of positions) {
                        finalTable[position.y][position.x] = lines[position.y][position.x]
                    }
                }
            }
        }

        x++;
        if (x > xLength - 1) {
            y++;
            x = 0;
        }
    }

    console.log(finalTable.map((line) => line.join('')).join('\n'))
    console.log(total);

}

// run('input-test.txt').catch(console.error);
run('input.txt').catch(console.error);