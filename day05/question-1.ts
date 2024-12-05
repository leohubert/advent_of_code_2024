import fs from "fs";
import path from "path";
import {groupBy} from "lodash";

function isCorrectLine(line: number[], rules: number[][]): boolean {
    const ruleKeyByFirst = groupBy(rules, 0)
    const ruleKeyBySecond = groupBy(rules, 1)

    for (let i = 0; i < line.length; i++) {
        const currentNumber = line[i]
        const beforeNumberLine = line.slice(0, i)
        const afterNumberLine = line.slice(i + 1)


        if (ruleKeyByFirst[currentNumber]) {
            for (const rule of ruleKeyByFirst[currentNumber]) {
                // console.log('checking first', {
                //     currentNumber,
                //     rule: rule,
                // })
                if (beforeNumberLine.includes(rule[1])) {
                    return false
                }
            }
        }

        if (ruleKeyBySecond[currentNumber]) {
            for (const rule of ruleKeyBySecond[currentNumber]) {
                // console.log('checking first', {
                //     currentNumber,
                //     rule: rule,
                // })
                if (afterNumberLine.includes(rule[1])) {
                    return false
                }
            }
        }
    }

    return true
}


async function run(file: string) {
    const input = fs.readFileSync(path.join(__dirname, file)).toString();

    const lines = input.split('\n\n');

    const rules = lines[0].split('\n').map(line => line.split('|').map(Number))
    const pages = lines[1].split('\n').map(line => line.split(',').map(Number))

    let total = 0
    for (const page of pages) {
        if (isCorrectLine(page, rules)) {
            const middleLine = page.at(page.length / 2)!
            total += middleLine
        }
    }

    console.log('total', total)



}

// run('input-test.txt').catch(console.error);
run('input.txt').catch(console.error);