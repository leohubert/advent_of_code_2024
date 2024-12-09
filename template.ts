import fs from "fs";
import path from "path";

async function run(file: string) {
    const input = fs.readFileSync(path.join(__dirname, file)).toString();

    const lines = input.split('\n');
    // TODO: Implement
}

run('input-test.txt').catch(console.error);
// run('input.txt').catch(console.error);