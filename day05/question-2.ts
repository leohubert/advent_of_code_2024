import fs from "fs";
import path from "path";
import {cloneDeep, groupBy, isEqual} from "lodash";

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

function fixLine(line: number[], rules: number[][]): number[] {
    let correctedLine: number[] = cloneDeep(line)
    const ruleKeyByFirst = groupBy(rules, 0)
    const ruleKeyBySecond = groupBy(rules, 1)

    for (let i = 0; i < line.length; i++) {
        let currentNumber = line[i]

        if (ruleKeyByFirst[currentNumber]) {
            for (const rule of ruleKeyByFirst[currentNumber]) {
                const beforeNumberLine = correctedLine.slice(0, i)
                const afterNumberLine = correctedLine.slice(i + 1)

                if (beforeNumberLine.includes(rule[1])) {
                    const index = beforeNumberLine.indexOf(rule[1])
                    correctedLine.splice(index, 1)
                    correctedLine = [...correctedLine.slice(0, i), rule[1], ...correctedLine.slice(i) ]
                    // console.log('fixing first page', {
                    //     index: index,
                    //     rule: rule,
                    //     line,
                    //     correctedLine
                    // })
                }
            }
        }

        if (ruleKeyBySecond[currentNumber]) {
            for (const rule of ruleKeyBySecond[currentNumber]) {
                const afterNumberLine = correctedLine.slice(i + 1)

                if (afterNumberLine.includes(rule[1])) {
                    const index = afterNumberLine.indexOf(rule[1])
                    correctedLine.splice(index, 1)
                    correctedLine = [...correctedLine.slice(0, i), rule[1], ...correctedLine.slice(i) ]
                    // console.log('fixing second page', {
                    //     index: index,
                    //     rule: rule,
                    //     line,
                    //     correctedLine
                    // })
                }
            }
        }

        // if (ruleKeyBySecond[currentNumber]) {
        //     for (const rule of ruleKeyBySecond[currentNumber]) {
        //
        //         if (afterNumberLine.includes(rule[1])) {
        //             const index = afterNumberLine.indexOf(rule[1])
        //             correctedLine.splice(index, 1)
        //             correctedLine = [...correctedLine.slice(0, i), rule[1], ...correctedLine.slice(i) ]
        //             console.log('fixing second page ', {
        //                 index: index,
        //                 rule: rule,
        //                 line,
        //                 correctedLine
        //             })
        //         }
        //     }
        // }
    }

    // let i = 0
    // correctedLine.sort((a, b) => {
    //     let sort = 0
    //     const beforeNumberLine = line.slice(0, i)
    //     const afterNumberLine = line.slice(i + 1)
    //
    //     if (ruleKeyByFirst[a]) {
    //         for (const rule of ruleKeyByFirst[a]) {
    //             if (beforeNumberLine.includes(rule[1])) {
    //                 sort += 1
    //             }
    //         }
    //     }
    //
    //     if (ruleKeyBySecond[b]) {
    //         for (const rule of ruleKeyBySecond[b]) {
    //             if (afterNumberLine.includes(rule[1])) {
    //                 sort += -1
    //             }
    //         }
    //     }
    //
    //     i++;
    //
    //     return sort
    // })

    if (!isEqual(correctedLine, line)) {
        return fixLine(correctedLine, rules)
    }


    return correctedLine
}


async function run(file: string) {
    const input = fs.readFileSync(path.join(__dirname, file)).toString();

    const lines = input.split('\n\n');

    const rules = lines[0].split('\n').map(line => line.split('|').map(Number))
    const pages = lines[1].split('\n').map(line => line.split(',').map(Number))

    let total = 0
    for (const page of pages) {
        if (!isCorrectLine(page, rules)) {
            const newLine = fixLine(page, rules)
            // console.log('fixed', {
            //     page,
            //     newLine
            // })
            const middleLine = newLine.at(newLine.length / 2)!
            total += middleLine
        }
    }

    console.log('total', total)
}

// run('input-test.txt').catch(console.error);
run('input.txt').catch(console.error);