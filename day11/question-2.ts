import fs from "fs";
import path from "path";

const maxIterations = 75

let cache: Record<number, Record<number, number>> = {};

function doYourWork(number: number, iteration = 0): number {
    if (iteration == maxIterations) {
        return 1;
    }

    if (number == 0) {
        return doYourWork(1, iteration + 1);
    } else if (number.toString().length % 2 == 0) {
        const half = number.toString().length / 2;
        const firstHalf = Number(number.toString().slice(0, half));
        const secondHalf = Number(number.toString().slice(half));

        let firstHalfResult: number;
        if (cache[firstHalf]?.[iteration + 1]) {
            firstHalfResult = cache[firstHalf]![iteration + 1];
        } else {
            firstHalfResult = doYourWork(firstHalf, iteration + 1);
            cache[firstHalf] = {
                ...cache[firstHalf],
                [iteration + 1]: firstHalfResult
            }
        }

        let secondHalfResult: number;
        if (cache[secondHalf]?.[iteration + 1]) {
            secondHalfResult = cache[secondHalf]![iteration + 1];
        } else {
            secondHalfResult = doYourWork(secondHalf, iteration + 1);
            cache[secondHalf] = {
                ...cache[secondHalf],
                [iteration + 1]: secondHalfResult
            }
        }

        return firstHalfResult + secondHalfResult;
    } else {
        return doYourWork(number * 2024, iteration + 1);
    }
}

async function run(file: string) {
    const input = fs.readFileSync(path.join(__dirname, file)).toString();

    let numbers = input.split(' ').map(Number);

    let totalStones = 0;
    for (const number of numbers) {
        totalStones += doYourWork(number, 0);
    }

    console.log(totalStones);


}

// run('input-test.txt').catch(console.error);
run('input.txt').catch(console.error);