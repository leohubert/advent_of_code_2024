import fs from "fs";
import path from "path";
import {keyBy} from "lodash";

type Position = {
    x: number;
    y: number;
}

const passedPositions: Record<string, boolean> = {};
let positions: Position[] = [];

function countLetterGroups(map: string[][], letter: string, x: number, y: number): {
    count: number
} {

    let count = 0;

    if (x < 0 || y < 0 || x >= map[0].length || y >= map.length) {
        return {
            count,
        }
    }

    if (map[y][x] !== letter) {
        return {
            count,
        }
    }

    const key = `${x}|${y}`;
    if (passedPositions[key]) {
        return {
            count,
        }
    }

    passedPositions[key] = true;
    positions.push({x, y});

    count++;

    const top = countLetterGroups(map, letter, x, y - 1);
    const right = countLetterGroups(map, letter, x + 1, y);
    const bottom = countLetterGroups(map, letter, x, y + 1);
    const left = countLetterGroups(map, letter, x - 1, y);


    return {
        count: count + top.count + right.count + bottom.count + left.count,
    }
}


function displayMap(positions: Position[]) {
    const maxX = Math.max(...positions.map(p => p.x));
    const maxY = Math.max(...positions.map(p => p.y));
    const minX = Math.min(...positions.map(p => p.x));
    const minY = Math.min(...positions.map(p => p.y));

    const newMap = Array.from({length: maxY - minY + 1}, () => Array.from({length: maxX - minX + 1}, () => '.'));

    for (const {x, y} of positions) {
        newMap[y - minY][x - minX] = '#';
    }

    console.log(newMap.map(l => l.join('')).join('\n'));
}

function calculateEdges(positions: Position[]): number {
    const positionByKey = keyBy(positions, p => `${p.x}|${p.y}`);

    let totalEdges = 0;
    for (const position of positions) {
        let edges = 0;

        const top = positionByKey[`${position.x}|${position.y - 1}`];
        const right = positionByKey[`${position.x + 1}|${position.y}`];
        const bottom = positionByKey[`${position.x}|${position.y + 1}`];
        const left = positionByKey[`${position.x - 1}|${position.y}`];

        if (!top && !left) {
            edges++;
        }

        if (!top && !right) {
            edges++;
        }

        if (!bottom && !left) {
            edges++;
        }

        if (!bottom && !right) {
            edges++;
        }

        // internal edges

        const topLeft = positionByKey[`${position.x - 1}|${position.y - 1}`];
        const topRight = positionByKey[`${position.x + 1}|${position.y - 1}`];
        const bottomLeft = positionByKey[`${position.x - 1}|${position.y + 1}`];
        const bottomRight = positionByKey[`${position.x + 1}|${position.y + 1}`];

        if (top && right && !topRight) {
            edges++;
        }

        if (top && left && !topLeft) {
            edges++;
        }

        if (bottom && right && !bottomRight) {
            edges++;
        }

        if (bottom && left && !bottomLeft) {
            edges++;
        }

        totalEdges += edges;
    }

    return totalEdges;
}


async function run(file: string) {
    const input = fs.readFileSync(path.join(__dirname, file)).toString();

    const map = input.split('\n').map(l => l.split(''));

    let total = 0;
    for (const [y, line] of map.entries()) {
        for (const [x, letter] of line.entries()) {
            positions = [];
            const res = countLetterGroups(map, letter, x, y);
            if (res.count > 0) {
                // displayMap(positions);
                const edges = calculateEdges(positions);
                total += res.count * edges;
                console.log({...res, edges}, res.count * edges);
            }
        }
    }
    console.log('result:\t\t', total);
    console.log('expected test:\t', 1206);
}

// run('input-test.txt').catch(console.error);
run('input.txt').catch(console.error);