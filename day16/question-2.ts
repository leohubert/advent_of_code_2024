import fs from "fs";
import path from "path";
import {cloneDeep, isEqual, keyBy, uniq, uniqBy} from "lodash";
import { PathFinding } from 'astarjs';

type Position = {
    x: number;
    y: number;
}

function positionToString(position: Position) {
    return `${position.x}|${position.y}`;
}

let foundAlternative = 0

async function displayMap(map: string[][], paths: Position[]) {
    const newMap = cloneDeep(map);

    for (let path of paths) {
        newMap[path.y][path.x] = 'O';
    }

    console.log(newMap.map(line => line.join('')).join('\n'));
    console.log('Found alternative paths: ', foundAlternative);
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

    return price - 2;
}

let startPosition: Position = {x: 0, y: 0};
let endPosition: Position = {x: 0, y: 0};

function findPath(paths: number[][]) {

    let pathFindingManager = new PathFinding()
    pathFindingManager.setWalkable({type: 1, weight: 1}, {type: 1000, weight: 1000})
        .setEnd({col: endPosition.x, row: endPosition.y})
        .setStart({col: startPosition.x -1 , row: startPosition.y})

    const findPath = pathFindingManager.find(paths)

    if (!findPath.length) {
        return null;
    }

    return findPath.map((path) => ({x: path.col, y: path.row}));
}

async function findOtherSamePricePaths(bestPath: Position[], paths: number[][], price: number, map: string[][]) {
    let allPaths = [bestPath];

    const pathByPosition = keyBy(paths, (path: Position) => `${path.x}-${path.y}`);

    for (let i = 0; i < bestPath.length; i++) {
        const position = bestPath[i];
        const nextPosition = bestPath[i + 1];

        let upCoords = {x: position.x, y: position.y - 1};
        let downCoords = {x: position.x, y: position.y + 1};
        let leftCoords = {x: position.x - 1, y: position.y};
        let rightCoords = {x: position.x + 1, y: position.y};

        const upPosition = paths[position.y - 1][position.x];
        const downPosition = paths[position.y + 1][position.x];
        const leftPosition = paths[position.y][position.x - 1];
        const rightPosition = paths[position.y][position.x + 1];

        // console.log('Checking: ', {
        //     position,
        //     nextPosition,
        //     up: upPosition,
        //     isUpEqual: isEqual(upCoords, nextPosition),
        //     down: downPosition,
        //     isDownEqual: isEqual(downCoords, nextPosition),
        //     left: leftPosition,
        //     isLeftEqual: isEqual(leftCoords, nextPosition),
        //     right: rightPosition,
        //     isRightEqual: isEqual(rightCoords, nextPosition),
        // });

        if (upPosition != -1 && nextPosition && !isEqual(upCoords, nextPosition)) {
            const newPaths = cloneDeep(paths);
            newPaths[nextPosition.y][nextPosition.x] = -1;
            const newPath = findPath(newPaths);

            if (newPath && countStepsPrice(newPath) === price) {
                foundAlternative++;
                allPaths.push(newPath);
                await displayMap(map, newPath)
            }
        }

        if (downPosition != -1 && nextPosition && !isEqual(downCoords, nextPosition)) {
            const newPaths = cloneDeep(paths);
            newPaths[nextPosition.y][nextPosition.x] = -1;
            const newPath = findPath(newPaths);

            if (newPath && countStepsPrice(newPath) === price) {
                foundAlternative++;
                allPaths.push(newPath);
                await displayMap(map, newPath);

            }
        }

        if (leftPosition != -1 && nextPosition && !isEqual(leftCoords, nextPosition) ) {
            const newPaths = cloneDeep(paths);
            newPaths[nextPosition.y][nextPosition.x] = -1;
            const newPath = findPath(newPaths);


            if (newPath && countStepsPrice(newPath) === price) {
                foundAlternative++;
                allPaths.push(newPath);
                await displayMap(map, newPath);
            }
        }

        if (rightPosition != -1 && nextPosition && !isEqual(rightCoords, nextPosition)) {
            const newPaths = cloneDeep(paths);
            newPaths[nextPosition.y][nextPosition.x] = -1;
            const newPath = findPath(newPaths);

            if (newPath && countStepsPrice(newPath) === price) {
                foundAlternative++;
                allPaths.push(newPath);
                await displayMap(map, newPath);
            }
        }

    }

    return allPaths;
}

async function run(file: string) {
    const input = fs.readFileSync(path.join(__dirname, file)).toString();

    const lines = input.split('\n').map(line => line.split(''));

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

    const bestPath = findPath(paths)!;
    await displayMap(lines, bestPath);
    const price = countStepsPrice(bestPath);

    console.log('Price: ', price);

    let otherPaths = await findOtherSamePricePaths(bestPath, paths, countStepsPrice(bestPath), lines);

    let fullPath = uniqBy([...bestPath, ...otherPaths.flat()], (path) => `${path.x}-${path.y}`);

    await displayMap(lines, fullPath);

    console.log('Tiles: ', fullPath.length -1, {
        otherPaths: otherPaths.length
    });
}

// run('input-test.txt').catch(console.error);
run('input.txt').catch(console.error);