import fs from "fs";
import path from "path";

const maxIterations = 25

function doYourWork(number: number, interation = 0): number {
    if (interation == maxIterations) {
        return 1;
    }

    if (number == 0) {
        return doYourWork(1, interation + 1);
    } else if (number.toString().length % 2 == 0) {
        const half = number.toString().length / 2;
        const firstHalf = number.toString().slice(0, half);
        const secondHalf = number.toString().slice(half);

        return doYourWork(Number(firstHalf), interation + 1) + doYourWork(Number(secondHalf), interation + 1);
    } else {
        return doYourWork(number * 2024, interation + 1);
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