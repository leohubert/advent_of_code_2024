import fs from "fs";
import path from "path";

const searchRegex = /mul[(]+[0-9]+,+[0-9]+[)]/g;

function resolveLine(line: string) {
    const matches = line.match(searchRegex);
    let res = 0
    if (matches) {
        for (const match of matches) {
            const [rule, a, b] = match.match(/mul[(]+([0-9]+),+([0-9]+)[)]/) as any;
            console.log('Match:', a, b);
            res += parseInt(a) * parseInt(b);
        }
    }
    return res;
}

async function run(file: string) {
    const input = fs.readFileSync(path.join(__dirname, file)).toString();

    const lines = input.split('\n');
    let total = 0;
    for (const line of lines) {
        total += resolveLine(line);
    }
    console.log(total);
}

// run('input-test.txt').catch(console.error);
run('input.txt').catch(console.error);