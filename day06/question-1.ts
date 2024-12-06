import fs from "fs";
import path from "path";
import {cloneDeep} from "lodash";

async function run(file: string) {
    const input = fs.readFileSync(path.join(__dirname, file)).toString();

    const lines = input.split('\n');
    let x = 0;
    let y = 0
    let maxX = lines[0].length;
    let maxY = lines.length;
    for (const [index, line] of lines.entries()) {
        y = index
        x = line.indexOf('^')
        if (x !== -1) break;
    }

    let newMap = cloneDeep(lines).map((line) => line.split(''));

    let direction = 'up';

    while (x < maxX && x >= 0 && y < maxY && y >= 0) {
        newMap[y][x] = 'X';
        if (direction === 'up') {
            if (lines[y - 1]?.[x] === '#') {
                direction = 'right';
            } else {
                y--;
            }
        } else if (direction === 'right') {
            if (lines[y]?.[x + 1] === '#') {
                direction = 'down';
            } else {
                x++;
            }
        } else if (direction === 'down') {
            if (lines[y + 1]?.[x] === '#') {
                direction = 'left';
            } else {
                y++;
            }
        } else if (direction === 'left') {
            if (lines[y]?.[x - 1] === '#') {
                direction = 'up';
            } else {
                x--;
            }
        }

    }

    let total = 0;
    for (const line of newMap) {
        for (const char of line) {
            if (char === 'X') {
                total++;
            }
        }
    }

    console.log(newMap.map((line) => line.join('')).join('\n'));

    console.log(total);

}

// run('input-test.txt').catch(console.error);
run('input.txt').catch(console.error);