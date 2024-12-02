import fs from "fs";
import path from "path";

function isSafeLine(line: number[]) {
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
        return true;
    }

    return false;
}

async function run(file: string) {
    console.log('Running on file', file);
    const input = fs.readFileSync(path.join(__dirname, file)).toString();

    const lines = input.split('\n').map(line => line.split(' ').map(Number));

    let safeLines = 0
    for (const line of lines) {
        if (isSafeLine(line)) {
            safeLines++;
            continue;
        }
        for (let i = 0; i < line.length; i++) {
            let newLine = [...line.slice(0, i), ...line.slice(i + 1)];
            if (isSafeLine(newLine)) {
                safeLines++;
                break
            }
        }
    }

    console.log(safeLines);
}

// run('input-test.txt').catch(console.error);
run('input.txt').catch(console.error);