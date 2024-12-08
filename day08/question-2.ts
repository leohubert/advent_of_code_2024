import fs from "fs";
import path from "path";
import {groupBy, max} from "lodash";

type Position = {
    x: number,
    y: number
}

function calculateLineDistance(position1: Position, position2: Position): number {
    return Math.sqrt(Math.pow(position2.x - position1.x, 2) + Math.pow(position2.y - position1.y, 2));
}

/**
 * This function takes two points and calculates two new point positions by increasing the distance between them.
 */
function calculateNewPositionOnLine(positions: Position[], distance: number, maxPosition: Position): Position[] {
    const [a, b] = positions;
    const angle = Math.atan2(b.y - a.y, b.x - a.x);

    let newPositions: Position[] = [];

    let x = Math.round(a.x + distance * Math.cos(angle));
    let y = Math.round(a.y + distance * Math.sin(angle));
    while (x >= 0 && x < maxPosition.x && y >= 0 && y < maxPosition.y) {
        newPositions.push({x, y});
        x += Math.round(distance * Math.cos(angle));
        y += Math.round(distance * Math.sin(angle));
    }

    x = Math.round(b.x + distance * Math.cos(angle));
    y = Math.round(b.y + distance * Math.sin(angle));
    while (x >= 0 && x < maxPosition.x && y >= 0 && y < maxPosition.y) {
        newPositions.push({x, y});
        x += Math.round(distance * Math.cos(angle));
        y += Math.round(distance * Math.sin(angle));
    }

    return newPositions;
}
async function run(file: string) {
    const input = fs.readFileSync(path.join(__dirname, file)).toString();

    const lines = input.split('\n').map(line => line.split(''));

    const maxX = lines[0].length;
    const maxY = lines.length;

    const antennas: Array<Position & {frequency: string}> = [];
    for (const [y, line] of lines.entries()) {
        for (const [x, char] of line.entries()) {
            if (char === '.') {
                continue;
            }
            antennas.push({x, y, frequency: char});
        }
    }

    const groupByFrequency = groupBy(antennas, 'frequency');

    let uniquePositions: Record<string, Position> = {};
    for (const [frequency, positions] of Object.entries(groupByFrequency)) {
        for (let i = 0; i < positions.length; i++) {
            for (let j = 0; j < positions.length; j++) {
                if (i === j) {
                    continue;
                }
                const distance = calculateLineDistance(positions[i], positions[j]);
                const positionsToChange = calculateNewPositionOnLine([positions[i], positions[j]], distance, {x: maxX, y: maxY});

                for (const position of positionsToChange) {

                    if (position.x < 0 || position.x >= maxX || position.y < 0 || position.y >= maxY) {
                        continue;
                    }

                    if (uniquePositions[`${position.x}-${position.y}`]) {
                        continue;
                    }

                    if (lines[position.y][position.x] !== '#') {
                        lines[position.y][position.x] = '#';
                        uniquePositions[`${position.x}-${position.y}`] = position;
                    }
                }
            }
        }
    }

    let count = 0;
    for (const line of lines) {
        for (let i = 0; i < line.length; i++) {
            if (line[i] === '#') {
                count++;
            }
        }
    }


    console.log(lines.map(line => line.join('')).join('\n'));
    console.log('Count:', count, Object.entries(uniquePositions).length);
}

// run('input-test.txt').catch(console.error);
run('input.txt').catch(console.error);