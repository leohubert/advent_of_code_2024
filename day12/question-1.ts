import fs from "fs";
import path from "path";

const passedPositions: Record<string, boolean> = {};

function countLetterGroups(map: string[][], letter: string, x: number, y: number): {
    count: number
    perimeter: number
} {

    let count = 0;
    let perimeter = 0;

    if (x < 0 || y < 0 || x >= map[0].length || y >= map.length) {
        return {
            count,
            perimeter,
        }
    }

    if (map[y][x] !== letter) {
        return {
            count,
            perimeter,
        }
    }

    const key = `${x}-${y}`;
    if (passedPositions[key]) {
        return {
            count,
            perimeter: -1,
        }
    }

    passedPositions[key] = true;
    perimeter = 4;
    count++;

    const top = countLetterGroups(map, letter, x, y - 1);
    const right = countLetterGroups(map, letter, x + 1, y);
    const bottom = countLetterGroups(map, letter, x, y + 1);
    const left = countLetterGroups(map, letter, x - 1, y);

    if (top.count > 0) {
        perimeter--;
    }
    if (right.count > 0) {
        perimeter--;
    }
    if (bottom.count > 0) {
        perimeter--;
    }
    if (left.count > 0) {
        perimeter--;
    }

    return {
        count: count + top.count + right.count + bottom.count + left.count,
        perimeter: perimeter + top.perimeter + right.perimeter + bottom.perimeter + left.perimeter,
    }
}

async function run(file: string) {
    const input = fs.readFileSync(path.join(__dirname, file)).toString();

    const map = input.split('\n').map(l => l.split(''));

    let total = 0;
    for (const [y, line] of map.entries()) {
        for (const [x, letter] of line.entries()) {
            const res = countLetterGroups(map, letter, x, y);
            if (res.count > 0) {
                total += res.count * res.perimeter;
                console.log(res, res.count * res.perimeter);
            }
        }
    }
    console.log(total);
}

// run('input-test.txt').catch(console.error);
run('input.txt').catch(console.error);