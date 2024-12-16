import fs from "fs";
import path from "path";
import {cloneDeep, keyBy} from "lodash";

type Position = {
    x: number;
    y: number;
}


function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

let lastShow: Date
async function findLowestPricePath(lines: string[][], map: Position[], position: Position, start: Position, end: Position, paths: Position[] = [], visitedPosition: Record<string, boolean> = {}) {
    const pathByPosition = keyBy(map, (path: Position) => `${path.x}-${path.y}`);

    const upPosition = pathByPosition[`${position.x}-${position.y - 1}`];
    const downPosition = pathByPosition[`${position.x}-${position.y + 1}`];
    const leftPosition = pathByPosition[`${position.x - 1}-${position.y}`];
    const rightPosition = pathByPosition[`${position.x + 1}-${position.y}`];

    if (position.x === end.x && position.y === end.y) {
        console.log('end', countStepsPrice([...paths, position]))
        return {
            paths: [...paths, position],
            price: countStepsPrice([...paths, position])
        };
    }

    if (visitedPosition[`${position.x}-${position.y}`]) {
        return {
            paths: paths,
            price: Infinity
        };
    }

    visitedPosition[`${position.x}-${position.y}`] = true;
    paths.push(position);

    if (!lastShow || (new Date().getTime() - lastShow.getTime()) > 1000) {
        lastShow = new Date();
        await displayMap(lines, paths);
    }

    let price = Infinity;
    let goodPath: Position[];
    if (upPosition) {
        const newPath = await findLowestPricePath(lines, map, {x: position.x, y: position.y - 1}, start, end, cloneDeep(paths), cloneDeep(visitedPosition));
        if (newPath.price <= price) {
            price = newPath.price;
            goodPath = newPath.paths;
        }
    }

    if (downPosition) {
        const newPath = await findLowestPricePath(lines, map, {x: position.x, y: position.y + 1}, start, end, cloneDeep(paths), cloneDeep(visitedPosition));
        if (newPath.price < price) {
            price = newPath.price;
            goodPath = newPath.paths;
        }
    }

    if (leftPosition) {
        const newPath = await findLowestPricePath(lines, map, {x: position.x - 1, y: position.y}, start, end, cloneDeep(paths), cloneDeep(visitedPosition));
        if (newPath.price < price) {
            price = newPath.price;
            goodPath = newPath.paths;
        }
    }

    if (rightPosition) {
        const newPath = await findLowestPricePath(lines, map, {x: position.x + 1, y: position.y}, start, end, cloneDeep(paths), cloneDeep(visitedPosition));
        if (newPath.price < price) {
            price = newPath.price;
            goodPath = newPath.paths;
        }
    }

    if (goodPath!) {
        return {
            paths: goodPath,
            price: price
        }
    }

    return {
        paths: [],
        price: Infinity
    };

}

async function run(file: string) {
    const input = fs.readFileSync(path.join(__dirname, file)).toString();

    const lines = input.split('\n').map(line => line.split(''));

    let startPosition: Position = {x: 0, y: 0};
    let endPosition: Position = {x: 0, y: 0};
    let map: Position[] = [];

    for (let y = 0; y < lines.length; y++) {
        const line = lines[y];
        for (let x = 0; x < line.length; x++) {
            const char = line[x];

            if (char === '.') {
                map.push({x, y});
            } else if (char === 'S') {
                startPosition = {x, y};
                map.push({x, y});
            } else if (char === 'E') {
                endPosition = {x, y};
                map.push({x, y});
            }
        }
    }

    const pathPositions = await findLowestPricePath(lines, map, {x: startPosition.x - 1, y: startPosition.y}, startPosition, endPosition);


    const price = countStepsPrice(pathPositions.paths);

    console.log(price - 2);


}

// run('input-test.txt').catch(console.error);
run('input.txt').catch(console.error);