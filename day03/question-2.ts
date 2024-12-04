import fs from "fs";
import path from "path";

const searchRegex = /mul[(]+[0-9]+,+[0-9]+[)]|do+\(+\)|don't+\(\)/gm;

let process = true

function resolveLine(line: string) {
    const matches = line.matchAll(searchRegex);
    let res = 0
    for (const match of matches) {
        console.log('Match:', match[0]);
        if (match[0].startsWith('mul') && process) {
            const [rule, a, b] = match[0].match(/mul[(]+([0-9]+),+([0-9]+)[)]/) as any;
            console.log('Match:', a, b);
            res += parseInt(a) * parseInt(b);
        } else if (match[0].startsWith('don\'t')) {
            process = false;
        } else if (match[0].startsWith('do')) {
            process = true;
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