import fs from "fs";
import path from "path";

type Position = {
    x: number;
    y: number;
}

type Robot = {
    position: Position;
    velocities: Position;
}

let mapWidth = 101;
let mapHeight = 103;
let seconds = 10403;

let positions: Record<string, boolean> = {}

function calculateNextPosition(robot: Robot): Position {
    let nextX = robot.position.x + robot.velocities.x;
    let nextY = robot.position.y + robot.velocities.y;

    if (nextX < 0) {
        const diff = Math.abs(nextX);
        nextX = mapWidth - diff;
    }

    if (nextX >= mapWidth) {
        nextX = nextX - mapWidth;
    }

    if (nextY < 0) {
        const diff = Math.abs(nextY);
        nextY = mapHeight - diff;
    }

    if (nextY >= mapHeight) {
        nextY = nextY - mapHeight;
    }

    positions[`${nextX}|${nextY}`] = true;

    return {x: nextX, y: nextY};
}

function parsePosition(positionRaw: string): Position {
    const [x, y] = positionRaw.split('=')[1].split(',').map(Number);
    return {x, y};
}

function displayMap(robots: Robot[], i: number) {
    let map = Array.from({length: mapHeight}, () => Array.from({length: mapWidth}, () => '.'));

    for (const robot of robots) {
        if (map[robot.position.y][robot.position.x] === '.') {
            map[robot.position.y][robot.position.x] = '1';
        } else {
            map[robot.position.y][robot.position.x] = (Number(map[robot.position.y][robot.position.x]) + 1).toString();
        }
    }

    console.clear()
    console.log(map.map(row => row.join('')).join('\n'));
    console.log(`Seconds: ${i}`);
}

let passedPositions: Record<string, boolean> = {};

function getGroupCount(x: number, y: number): number {
    if (x < 0 || x >= mapWidth || y < 0 || y >= mapHeight) {
        return 0;
    }

    if (!positions[`${x}|${y}`]) {
        return 0;
    }

    if (passedPositions[`${x}|${y}`]) {
        return 0;
    }

    passedPositions[`${x}|${y}`] = true;

    let count = 1;

    count += getGroupCount(x + 1, y);
    count += getGroupCount(x - 1, y);
    count += getGroupCount(x, y + 1);
    count += getGroupCount(x, y - 1);

    return count;
}

async function run(file: string) {
    const input = fs.readFileSync(path.join(__dirname, file)).toString();

    const lines = input.split('\n');
    let robots: Robot[] = [];

    for (const line of lines) {
        const [positionRaw, velocityRaw] = line.split(' ');

        robots.push({
            position: parsePosition(positionRaw),
            velocities: parsePosition(velocityRaw)
        })
    }

    let second = 1;
    while (true) {
        positions = {};
        for (const robot of robots) {
            robot.position = calculateNextPosition(robot);
        }

        passedPositions = {};
        for (const robot of robots) {
            const groupCount = getGroupCount(robot.position.x, robot.position.y);

            if (groupCount > 30) {
                displayMap(robots, second);
                return;
            }
        }
        second++;
    }
}

// run('input-test.txt').catch(console.error);
run('input.txt').catch(console.error);