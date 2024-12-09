import fs from "fs";
import path from "path";

async function run(file: string) {
    const input = fs.readFileSync(path.join(__dirname, file)).toString();

    const line = input.split('').map(Number);
    const reversedLine = line.slice().reverse();

    const maxId = line.length / 2;

    let id = 0;
    let lastNumberId = maxId;

    let total = 0;
    let index = 0;
    let reverseIndex = line.length - 1;
    let calculIndex = 0;

    let queueNumber: { id: number, count: number } | null = null;

    while (id < lastNumberId) {
        const number = line[index];
        const spaces = line[index + 1];

        for (let i = 0; i < number; i++) {
            total += id * calculIndex;
            calculIndex++;
            process.stdout.write(`${id}`);
        }

        for (let i = 0; i < spaces; i++) {
            if (!queueNumber || queueNumber.count <= 0) {
                const number = reversedLine[reverseIndex];
                queueNumber = { id: lastNumberId, count: number };
                reverseIndex += 2;
                lastNumberId--;
            }

            total += queueNumber.id * calculIndex;
            calculIndex++;
            queueNumber.count--;
            process.stdout.write(`${queueNumber.id}`);
        }

        index += 2;
        id++;
    }

    process.stdout.write(`\n`);


}

run('input-test.txt').catch(console.error);
// run('input.txt').catch(console.error);