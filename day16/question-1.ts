import fs from "fs";
import path from "path";
import {cloneDeep, keyBy} from "lodash";
import { PathFinding } from 'astarjs';

type Position = {
    x: number;
    y: number;
}

function positionToString(position: Position) {
    return `${position.x}|${position.y}`;
}

async function displayMap(map: string[][], paths: Position[]) {
    const newMap = cloneDeep(map);

    for (let path of paths) {
        newMap[path.y][path.x] = 'O';
    }

    console.clear();
    console.log(newMap.map(line => line.join('')).join('\n'));
}

function countStepsPrice(paths: Position[]) {
    let price = 0
    const pathByPosition = keyBy(paths, (path: Position) => `${path.x}-${path.y}`);

    for (const curPath of paths) {
        const upPosition = pathByPosition[`${curPath.x}-${curPath.y - 1}`];
        const downPosition = pathByPosition[`${curPath.x}-${curPath.y + 1}`];
        const leftPosition = pathByPosition[`${curPath.x - 1}-${curPath.y}`];
        const rightPosition = pathByPosition[`${curPath.x + 1}-${curPath.y}`];

        if (downPosition && leftPosition) {
            price += 1001;
        } else if (downPosition && rightPosition) {
            price += 1001;
        } else if (upPosition && leftPosition) {
            price += 1001;
        } else if (upPosition && rightPosition) {
            price += 1001;
        } else {
            price += 1;
        }

    }

    return price;
}

async function run(file: string) {
    const input = fs.readFileSync(path.join(__dirname, file)).toString();

    const lines = input.split('\n').map(line => line.split(''));

    let startPosition: Position = {x: 0, y: 0};
    let endPosition: Position = {x: 0, y: 0};
    let paths: number[][] = Array.from({length: lines.length}, () => Array.from({length: lines[0].length}, () => -1));

    function getMapItem(x: number, y: number) {
        if (x < 0 || y < 0 || y >= lines.length || x >= lines[y].length) {
            return null;
        }

        return lines[y][x];
    }

    for (let y = 0; y < lines.length; y++) {
        const line = lines[y];
        for (let x = 0; x < line.length; x++) {
            const char = line[x];
            const pos = positionToString({x, y});

            const top = getMapItem(x, y - 1);
            const top2 = getMapItem(x, y - 2);

            const bottom = getMapItem(x, y + 1);
            const bottom2 = getMapItem(x, y + 2);

            const left = getMapItem(x - 1, y);
            const left2 = getMapItem(x - 2, y);

            const right = getMapItem(x + 1, y);
            const right2 = getMapItem(x + 2, y);

            if (char === '.') {
                if (
                    (left === '.' && left2 !== '.') ||
                    (right === '.' && right2 !== '.') ||
                    (top === '.' && top2 !== '.') ||
                    (bottom === '.' && bottom2 !== '.')
                ) {
                    paths[y][x] = 1000;
                } else {
                    paths[y][x] = 1;
                }
            } else if (char === 'S') {
                startPosition = {x, y};
                paths[y][x] = 1;
            } else if (char === 'E') {
                endPosition = {x, y};
                paths[y][x] = 1;
            } else {
                paths[y][x] = -1;
            }
        }
    }

   let pathFindingManager = new PathFinding()
    pathFindingManager.setWalkable({type: 1, weight: 1}, {type: 1000, weight: 1000})
        .setEnd({col: endPosition.x, row: endPosition.y})
        .setStart({col: startPosition.x -1 , row: startPosition.y})

    const findPath = pathFindingManager.find(paths)

    await displayMap(lines, findPath.map((path) => ({x: path.col, y: path.row})));

    const price = countStepsPrice(findPath.map((path) => ({x: path.col, y: path.row})));


    console.log('Price: ', price - 2);
}

// run('input-test.txt').catch(console.error);
run('input.txt').catch(console.error);