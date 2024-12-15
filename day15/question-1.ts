import fs from "fs";
import path from "path";
import {keyBy} from "lodash";

type Position = {
    x: number;
    y: number;
}

let robotPosition: Position = { x: 0, y: 0 };
let wallPositions: Record<string, Position> = {};
let boxPositions: Record<string, Position> = {};
let instructions: string = '';

let mapWidth = 0;
let mapHeight = 0;

function getNextPosition(position: Position, direction: string) {
    if (direction === '^') {
        return { x: position.x, y: position.y - 1 };
    } else if (direction === 'v') {
        return { x: position.x, y: position.y + 1 };
    } else if (direction === '<') {
        return { x: position.x - 1, y: position.y };
    } else if (direction === '>') {
        return { x: position.x + 1, y: position.y };
    }

    throw new Error('Invalid direction');
}

function moveBox(position: Position, direction: string) {
    const nextPosition = getNextPosition(position, direction);
    const wallByPosition = keyBy(wallPositions, ({ x, y }) => `${x}|${y}`);
    const boxByPosition = keyBy(boxPositions, ({ x, y }) => `${x}|${y}`);

    if (wallByPosition[`${nextPosition.x}|${nextPosition.y}`]) {
        return false;
    }

    let move = true
    if (boxByPosition[`${nextPosition.x}|${nextPosition.y}`]) {
        move = moveBox(boxByPosition[`${nextPosition.x}|${nextPosition.y}`], direction);
    }

    if (!move) {
        return false;
    }

    boxPositions[getPositionKey(nextPosition)] = nextPosition;
    delete boxPositions[getPositionKey(position)];

    return true;
}

function moveRobot(direction: string) {
    const nextPosition = getNextPosition(robotPosition, direction);

    if (wallPositions[getPositionKey(nextPosition)]) {
        return;
    }

    if (boxPositions[getPositionKey(nextPosition)]) {
        if (!moveBox(boxPositions[getPositionKey(nextPosition)], direction)) {
            return;
        }
    }

    robotPosition = nextPosition;
}

function getPositionKey(position: Position) {
    return `${position.x}|${position.y}`;
}

function displayMap() {
    const map = Array.from({ length: mapHeight }, () => Array.from({ length: mapWidth }, () => '.'));

    for (const wall of Object.values(wallPositions)) {
        map[wall.y][wall.x] = '#';
    }

    for (const box of Object.values(boxPositions)) {
        map[box.y][box.x] = 'O';
    }

    map[robotPosition.y][robotPosition.x] = '@';

    console.log(map.map(row => row.join('')).join('\n'));
}

async function run(file: string) {
    const input = fs.readFileSync(path.join(__dirname, file)).toString();

    const lines = input.split('\n');


    for (let y = 0; y < lines.length; y++) {
        const line = lines[y];
        if (!mapWidth) {
            mapWidth = line.length;
        }
        if (line.startsWith('#') && line.endsWith('#')) {
            mapHeight++;
            for (let x = 0; x < line.length; x++) {
                const char = line[x];
                if (char === '#') {
                    wallPositions[getPositionKey({ x, y })] = { x, y };
                } else if (char === 'O') {
                    boxPositions[getPositionKey({ x, y })] = { x, y };
                } else if (char === '@') {
                    robotPosition = { x, y };
                }
            }
        } else if (line.length) {
            instructions += line;
        }
    }

    for (let i = 0; i < instructions.length; i++) {
        const instruction = instructions[i];
        moveRobot(instruction);
        // displayMap();
    }


    let total = 0
    for (const box of Object.values(boxPositions)) {
        total += 100 * box.y + box.x;
    }

    console.log(total);


    // console.log(robotPosition, wallPositions, boxPositions, instructions);
}

// run('input-test.txt').catch(console.error);
run('input.txt').catch(console.error);