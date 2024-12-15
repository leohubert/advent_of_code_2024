import fs from "fs";
import path from "path";
import {cloneDeep, isEqual} from "lodash";
import readline from "readline";

type Position = {
    x: number;
    y: number;
}

let robotPosition: Position = { x: 0, y: 0 };
let wallPositions: Record<string, Position> = {};
let boxPositions: Record<string, Position> = {};
let boxLinks: Record<string, string> = {};
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
    const boxLinkKey = boxLinks[getPositionKey(position)];
    const linkedPosition = boxPositions[boxLinkKey];

    const nextPosition = getNextPosition(position, direction);
    const nextLinkedPosition = getNextPosition(linkedPosition, direction);

    if (wallPositions[`${nextPosition.x}|${nextPosition.y}`] || wallPositions[`${nextLinkedPosition.x}|${nextLinkedPosition.y}`]) {
        return false;
    }

    let savePosition = cloneDeep(boxPositions);
    let saveBoxLinks = cloneDeep(boxLinks);
    let move: boolean = true;
    if (boxPositions[getPositionKey(nextPosition)] && !isEqual(nextPosition, linkedPosition)) {
        move = moveBox(boxPositions[getPositionKey(nextPosition)], direction);
    }
    if (move && boxPositions[getPositionKey(nextLinkedPosition)] && !isEqual(nextLinkedPosition, position)) {
        move = moveBox(boxPositions[getPositionKey(nextLinkedPosition)], direction);
    }

    if (!move) {
        boxPositions = savePosition;
        boxLinks = saveBoxLinks;
        return false;
    }

    delete boxPositions[getPositionKey(position)];
    delete boxPositions[getPositionKey(linkedPosition)];
    delete boxLinks[getPositionKey(position)];
    delete boxLinks[getPositionKey(linkedPosition)];

    boxPositions[getPositionKey(nextPosition)] = nextPosition;
    boxPositions[getPositionKey(nextLinkedPosition)] = nextLinkedPosition;
    boxLinks[getPositionKey(nextPosition)] = getPositionKey(nextLinkedPosition);
    boxLinks[getPositionKey(nextLinkedPosition)] = getPositionKey(nextPosition);

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
        const linkedBox = boxPositions[boxLinks[getPositionKey(box)]];
        if (linkedBox.x > box.x) {
            map[box.y][box.x] = '[';
            map[linkedBox.y][linkedBox.x] = ']';
        } else {
            map[box.y][box.x] = ']';
            map[linkedBox.y][linkedBox.x] = '[';
        }
    }

    map[robotPosition.y][robotPosition.x] = '@';

    console.log(map.map(row => row.join('')).join('\n'));
}

function manualInput() {
    readline.emitKeypressEvents(process.stdin);

    process.stdin.setRawMode(true);

    process.stdin.on('keypress', (str, key) => {
        if (key.ctrl && key.name === 'c') {
            process.exit();
        } else {
            if (key.name === 'up') {
                moveRobot('^');
            } else if (key.name === 'down') {
                moveRobot('v');
            } else if (key.name === 'left') {
                moveRobot('<');
            } else if (key.name === 'right') {
                moveRobot('>');
            }
            displayMap();
        }
    });
}

async function run(file: string) {
    const input = fs.readFileSync(path.join(__dirname, file)).toString();

    const lines = input.split('\n');

    for (let y = 0; y < lines.length; y++) {
        const line = lines[y];
        if (!mapWidth) {
            mapWidth = line.length * 2;
        }
        if (line.startsWith('#') && line.endsWith('#')) {
            mapHeight++;
            for (let x = 0; x < line.length * 2; x += 1) {
                const char = line[x / 2];
                if (char === '#') {
                    wallPositions[getPositionKey({ x, y })] = { x, y };
                    wallPositions[getPositionKey({ x: x + 1, y })] = { x: x + 1, y };
                } else if (char === 'O') {
                    boxPositions[getPositionKey({ x, y })] = { x, y };
                    boxPositions[getPositionKey({ x: x + 1, y })] = { x: x + 1, y };
                    boxLinks[getPositionKey({ x, y })] = getPositionKey({ x: x + 1, y });
                    boxLinks[getPositionKey({ x: x + 1, y })] = getPositionKey({ x, y });
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

    manualInput();

    displayMap()

    let total = 0
    let countedPositions: Record<string, boolean> = {};
    for (const box of Object.values(boxPositions)) {
        if (countedPositions[getPositionKey(box)]) {
            continue;
        }

        const linkedBox = boxPositions[boxLinks[getPositionKey(box)]];

        if (linkedBox.x > box.x) {
            total+= 100 * box.y + box.x;
        } else {
            total+= 100 * linkedBox.y + linkedBox.x;
        }

        countedPositions[getPositionKey(box)] = true;
        countedPositions[getPositionKey(linkedBox)] = true;
    }

    console.log(total);


    // console.log(robotPosition, wallPositions, boxPositions, instructions);
}

run('input-test.txt').catch(console.error);
// run('input.txt').catch(console.error);