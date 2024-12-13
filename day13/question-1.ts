import fs from "fs";
import path from "path";
const mathjs = require('mathjs');

type Position = {
    x: number;
    y: number;
}

type Claw = {
    buttonA: Position;
    buttonB: Position;
    price: Position;
}

function parseLine(line: string, type: 'button' | 'prize' = 'button'): Position {
    const separators = {
        button: '+',
        prize: '='
    }

    const [xRaw, yRaw] = line.split(':')[1].split(',');

    const separator = separators[type];
    const x = Number(xRaw.split(separator)[1]);
    const y = Number(yRaw.split(separator)[1]);

    return { x, y };
}

/**
 * Calculate how many press on button A and B are needed to get the prize
 * Each press on button A or B increase the x or y position of the claw by the button's position
 */
function resolveClawMachine(clawMachine: Claw): {
    buttonAPresses: number;
    buttonBPresses: number;
} {
    const { buttonA, buttonB, price } = clawMachine;

    // Create the system of equations
    // buttonAPresses * buttonA.x + buttonBPresses * buttonB.x = price.x
    // buttonAPresses * buttonA.y + buttonBPresses * buttonB.y = price.y

    const A = [
        [buttonA.x, buttonB.x],
        [buttonA.y, buttonB.y]
    ];
    const B = [price.x, price.y];

    // Solve the system of equations
    const solution = mathjs.lusolve(A, B);

    const buttonAPresses = solution[0][0];
    const buttonBPresses = solution[1][0];

    const isAClose = Math.abs(buttonAPresses - Math.round(buttonAPresses)) < 0.0001;
    const isBClose = Math.abs(buttonBPresses - Math.round(buttonBPresses)) < 0.0001;

    return {
        buttonAPresses: isAClose ? Math.round(buttonAPresses) : buttonAPresses,
        buttonBPresses: isBClose ? Math.round(buttonBPresses) : buttonBPresses
    };
}

function isFloat(n: number){
    return Number(n) === n && n % 1 !== 0;
}

async function run(file: string) {
    const input = fs.readFileSync(path.join(__dirname, file)).toString();

    const lines = input.split('\n');
    let clawMachines: Claw[] = [];

    for (let i = 0; i < lines.length; i+=4) {
        const buttonA = parseLine(lines[i]);
        const buttonB = parseLine(lines[i+1]);
        const price = parseLine(lines[i+2], 'prize');

        clawMachines.push({ buttonA, buttonB, price });
    }


    let total = 0
    for (const clawMachine of clawMachines) {
        const res = resolveClawMachine(clawMachine);
        if (isFloat(res.buttonAPresses) || isFloat(res.buttonBPresses)) {
            continue;
        }
        if (res.buttonAPresses > 100 || res.buttonBPresses > 100) {
            continue;
        }

        total += res.buttonAPresses * 3 + res.buttonBPresses;
        // console.log(res);
    }

    console.log(total);
}

run('input-test.txt').catch(console.error);
run('input.txt').catch(console.error);