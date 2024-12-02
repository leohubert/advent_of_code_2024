import fs from "fs";
import path from "path";

const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

const lines = input.split('\n');

const left: number[] = []
const right: number[] = []

for (let i = 0; i < lines.length; i++) {
    const [leftRow, rightRow] = lines[i].split('   ').map(Number);

    left.push(leftRow);
    right.push(rightRow);

}

function countOccurance(list: number[], nb: number) {
    let count = 0;
    for (let i = 0; i < list.length; i++) {
        if (list[i] === nb) {
            count++;
        }
    }
    return count;
}

let distance = 0;

for (let i = 0; i < left.length; i++) {
    const rightOccurance = countOccurance(right, left[i]);

    distance += left[i] * rightOccurance;
}


console.log(distance); 