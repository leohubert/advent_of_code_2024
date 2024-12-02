import fs from "fs";
import path from "path";

const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

const lines = input.split('\n').map(line => line.split(' ').map(Number));

let safeLines = 0
for (const line of lines) {
    let safe = true;

    let isIncreasing = true;
    let isDecreasing = true;
    for (let i = 1; i < line.length; i++) {
        const dist = Math.abs(line[i] - line[i - 1]);
        if (dist === 0 || dist > 3) {
            safe = false;
        }

        if (line[i] > line[i - 1]) {
            isDecreasing = false;
        } else if (line[i] < line[i - 1]) {
            isIncreasing = false;
        }
    }

    if (safe && (isIncreasing || isDecreasing)) {
        safeLines++;
    }

}

console.log(safeLines); 