import fs from "fs";
import path from "path";

async function run(file: string) {
    const input = fs.readFileSync(path.join(__dirname, file)).toString();

    const line = input.split('').map(Number);

    const maxId = line.length / 2;

    let id = 0;
    let lastNumberId = Math.floor(maxId);

    let total = 0;
    let index = 0;
    let reverseIndex = line.length - 1;
    let calculIndex = 0;

    let queueNumber: { id: number, count: number } | null = null;

    const migratedIds = new Set<number>();

    while (index <= line.length) {
        const number = line[index];
        const spaces = line[index + 1];

        if (!migratedIds.has(id)) {
            for (let i = 0; i < number; i++) {
                total += id * calculIndex;
                calculIndex++;
                process.stdout.write(`${id}`);
            }
        } else {
            for (let i = 0; i < number; i++) {
                process.stdout.write('.');
                calculIndex++;
            }
        }

        for (let i = 0; i < spaces; i++) {
            const remainingSpaces = spaces - i;

            let copyReverseIndex = reverseIndex;
            let copyId = lastNumberId;
            while (copyReverseIndex > index && !queueNumber) {
                const number = line[copyReverseIndex];
                if (number <= remainingSpaces && !migratedIds.has(copyId)) {
                    queueNumber = {id: copyId, count: number};
                }
                copyReverseIndex -= 2;
                copyId--;
            }

            if (queueNumber) {
                migratedIds.add(queueNumber.id)
                i += queueNumber.count - 1;

                for (let j = 0; j < queueNumber.count; j++) {
                    total += queueNumber.id * calculIndex;
                    calculIndex++;
                    process.stdout.write(`${queueNumber.id}`);
                }
                queueNumber = null
            } else {
                process.stdout.write('.');
                calculIndex++;
            }
        }

        index += 2;
        id++;
    }

    process.stdout.write(`\n`);
    console.log('00992111777.44.333....5555.6666.....8888..')

    console.log(`Total: ${total}`);


}

// run('input-test.txt').catch(console.error);
run('input.txt').catch(console.error);