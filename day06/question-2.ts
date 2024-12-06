import fs from "fs";
import path from "path";
import {cloneDeep} from "lodash";

function resolvePuzzle(lines: string[][]) {
    let x = 0;
    let y = 0
    let maxX = lines[0].length;
    let maxY = lines.length;
    for (const [index, line] of lines.entries()) {
        y = index
        x = line.indexOf('^')
        if (x !== -1) break;
    }

    let newMap = cloneDeep(lines)

    let direction = 'up';

    let positionHistory : Record<string, number> = {}

    while (x < maxX && x >= 0 && y < maxY && y >= 0) {
        if (positionHistory[`${x},${y}`] > 5) {
            return {
                map: newMap,
                finished: false
            }
        }
        newMap[y][x] = 'X';
        if (direction === 'up') {
            if (lines[y - 1]?.[x] === '#') {
                direction = 'right';
            } else {
                positionHistory[`${x},${y}`] = (positionHistory[`${x},${y}`] || 0) + 1;
                y--;
            }
        } else if (direction === 'right') {
            if (lines[y]?.[x + 1] === '#') {
                direction = 'down';
            } else {
                positionHistory[`${x},${y}`] = (positionHistory[`${x},${y}`] || 0) + 1;
                x++;
            }
        } else if (direction === 'down') {
            if (lines[y + 1]?.[x] === '#') {
                direction = 'left';
            } else {
                positionHistory[`${x},${y}`] = (positionHistory[`${x},${y}`] || 0) + 1;
                y++;
            }
        } else if (direction === 'left') {
            if (lines[y]?.[x - 1] === '#') {
                direction = 'up';
            } else {
                positionHistory[`${x},${y}`] = (positionHistory[`${x},${y}`] || 0) + 1;
                x--;
            }
        }
    }

    return {
        map: newMap,
        finished: true
    };
}
async function run(file: string) {
    const input = fs.readFileSync(path.join(__dirname, file)).toString();

    const lines = input.split('\n').map((line) => line.split(''));

    let x = 0;
    let y = 0;

    let total = 0;
    while (x < lines[0].length && y < lines.length) {
        let newMap = cloneDeep(lines);
        if (newMap[y][x] === '^' || newMap[y][x] === '#') {
            x++;
            if (x === lines[0].length) {
                x = 0;
                y += 1;
            }
            continue;
        }
        newMap[y][x] = '#';
        let res = resolvePuzzle(newMap);
        console.log(res.finished)
        if (!res.finished) {
            total++;
        }
        x++;
        if (x === lines[0].length) {
            x = 0;
            y += 1;
        }
    }


    console.log(total);

}

// run('input-test.txt').catch(console.error);
run('input.txt').catch(console.error);