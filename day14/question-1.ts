import fs from "fs";
import path from "path";
import {groupBy} from "lodash";

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
let seconds = 100;

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

    return {x: nextX, y: nextY};
}

function parsePosition(positionRaw: string): Position {
    const [x, y] = positionRaw.split('=')[1].split(',').map(Number);
    return {x, y};
}

function displayMap(robots: Robot[], mapWidth: number, mapHeight: number) {
    let map = Array.from({length: mapHeight}, () => Array.from({length: mapWidth}, () => '.'));

    for (const robot of robots) {
        if (map[robot.position.y][robot.position.x] === '.') {
            map[robot.position.y][robot.position.x] = '1';
        } else {
            map[robot.position.y][robot.position.x] = (Number(map[robot.position.y][robot.position.x]) + 1).toString();
        }
    }

    console.log('\n')
    console.log(map.map(row => row.join('')).join('\n'));
}

function countRobots(robots: Robot[]): number {
    const middleX = Math.floor(mapWidth / 2);
    const middleY = Math.floor(mapHeight / 2);

    let topLeftCount = 0;
    let topRightCount = 0;
    let bottomLeftCount = 0;
    let bottomRightCount = 0;

    for (const robot of robots) {
        if (robot.position.x === middleX || robot.position.y === middleY) {
            continue;
        }

        if (robot.position.x < middleX && robot.position.y < middleY) {
            topLeftCount++;
        } else if (robot.position.x >= middleX && robot.position.y < middleY) {
            topRightCount++;
        } else if (robot.position.x < middleX && robot.position.y >= middleY) {
            bottomLeftCount++;
        } else {
            bottomRightCount++;
        }

    }

    return topLeftCount * topRightCount * bottomLeftCount * bottomRightCount;
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


    for (let i = 0; i < seconds; i++) {
        displayMap(robots, mapWidth, mapHeight);
        for (const robot of robots) {
            robot.position = calculateNextPosition(robot);
        }
    }


    displayMap(robots, mapWidth, mapHeight);

    const totalRobots = countRobots(robots);

    console.log(robots);
    console.log(totalRobots);
}

// run('input-test.txt').catch(console.error);
run('input.txt').catch(console.error);