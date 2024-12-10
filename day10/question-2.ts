import fs from "fs";
import path from "path";

let positions: Record<string, number> = {};

function  toToTheTop(map: string[][], nb: number,  x: number, y: number): number {
    // if (positions[`${x},${y}`]) {
    //     return 0;
    // }

    if (x < 0 || y < 0 || x >= map[0].length || y >= map.length) {
        return 0;
    }

    if (map[y][x] !== `${nb}`) {
        return 0;
    }

    positions[`${x},${y}`] = 1;

    if (map[y][x] === '9') {
        return 1;
    }

    let res = 0;

    res += toToTheTop(map, nb + 1, x + 1, y);

    res += toToTheTop(map, nb + 1, x - 1, y );

    res += toToTheTop(map, nb + 1, x, y + 1);

    res += toToTheTop(map, nb + 1, x, y - 1);

    return res;
}

async function run(file: string) {
    const input = fs.readFileSync(path.join(__dirname, file)).toString();

    const lines = input.split('\n').map(line => line.split(''));

    let total = 0;
    for (const [y, line] of lines.entries()) {
        for (const [x, char] of line.entries()) {
            if (char === '0') {
                positions = {};
                const res = toToTheTop(lines, 0, x, y);
                if (res > 0) {
                    total += res;
                }
            }
        }
    }

    console.log(total);
}

// run('input-test.txt').catch(console.error);
run('input.txt').catch(console.error);