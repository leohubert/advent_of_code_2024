import fs from "fs";
import path from "path";


/**
 * This function will take a result to found and a list of numbers.
 * It will return an array of equations that will result in the result to found.
 *
 * The function should return all possible equations to find the result with the following operators:
 * - Addition (+)
 * - Multiplication (*)
 *
 */
function findEquations(result: number, numbers: number[]): string[] {
    const equations: string[] = [];

    function helper(currentResult: number, currentEquation: string, index: number) {
        if (index === numbers.length) {
            if (currentResult === result) {
                equations.push(currentEquation);
            }
            return;
        }

        // Try addition
        helper(currentResult + numbers[index], `${currentEquation} + ${numbers[index]}`, index + 1);

        // Try multiplication
        helper(currentResult * numbers[index], `${currentEquation} * ${numbers[index]}`, index + 1);
    }

    for (let i = 0; i < numbers.length; i++) {
        helper(numbers[i], `${numbers[i]}`, i + 1);
    }

    return equations;
}

async function run(file: string) {
    const input = fs.readFileSync(path.join(__dirname, file)).toString();

    type Line = {
        result: number;
        numbers: number[];
    }

    const linesRaw = input.split('\n');
    const lines: Line[] = []

    let result = 0;
    for (const line of linesRaw) {
        const [result, numbersRaw] = line.split(':');

        lines.push({
            result: Number(result),
            numbers: numbersRaw.trim().split(' ').map(Number)
        })
    }

    let total = 0;
    for (const line of lines) {
        const equations = findEquations(line.result, line.numbers);
        if (equations.length > 0) {
            total += line.result;
        }
    }

    console.log(total);
}

// run('input-test.txt').catch(console.error);
run('input.txt').catch(console.error);