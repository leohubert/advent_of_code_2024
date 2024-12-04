import fs from "fs";
import path from "path";
import {max, maxBy, minBy} from "lodash";

type Position = {x: number, y: number, letter: string}

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

    let i = 0;
    for (const position of positions) {
        if (!position.letter.includes(lines[position.y][position.x])) {
            return false
        }
        i++
    }

    return true
 }

function exploreXmas(lines: string[], x: number, y: number): Position[][] {
    let positions: Position[][] = []

    const xMasPositions1: Position[] = [
        {x: x - 1, y: y - 1, letter: 'M'},
        {x: x + 1, y: y - 1, letter: 'M'},
        {x, y, letter: 'A'},
        {x: x - 1, y: y + 1, letter: 'S'},
        {x: x + 1, y: y + 1, letter: 'S'},
    ]

    if (isXmas(lines, xMasPositions1)) {
        positions.push(xMasPositions1)
    }

    const xMasPositions2: Position[] = [
        {x: x - 1, y: y - 1, letter: 'S'},
        {x: x + 1, y: y - 1, letter: 'M'},
        {x, y, letter: 'A'},
        {x: x - 1, y: y + 1, letter: 'S'},
        {x: x + 1, y: y + 1, letter: 'M'},
    ]

    if (isXmas(lines, xMasPositions2)) {
        positions.push(xMasPositions2)
    }

    const xMasPositions3: Position[] = [
        {x: x - 1, y: y - 1, letter: 'M'},
        {x: x + 1, y: y - 1, letter: 'S'},
        {x, y, letter: 'A'},
        {x: x - 1, y: y + 1, letter: 'M'},
        {x: x + 1, y: y + 1, letter: 'S'},
    ]
    if (isXmas(lines, xMasPositions3)) {
        positions.push(xMasPositions3)
    }

    const xMasPositions4: Position[] = [
        {x: x - 1, y: y - 1, letter: 'S'},
        {x: x + 1, y: y - 1, letter: 'S'},
        {x, y, letter: 'A'},
        {x: x - 1, y: y + 1, letter: 'M'},
        {x: x + 1, y: y + 1, letter: 'M'},
    ]
    if (isXmas(lines, xMasPositions4)) {
        positions.push(xMasPositions4)
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

        if (char === 'A') {
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