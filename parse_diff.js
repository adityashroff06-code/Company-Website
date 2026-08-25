const fs = require('fs');
const { execSync } = require('child_process');

const colorRegex = /\btext-(?:\[#[0-9a-fA-F]+\]|white|black|transparent|current|(?:gray|red|blue|green|yellow|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|indigo|violet|purple|fuchsia|pink|rose)-[0-9]+|primary|navy|accent|muted-foreground|foreground)(?:\/[0-9]+)?(?!\w)/g;

const diffOutput = execSync('git diff HEAD~1 -U0 -- artifacts/productarmor-site/src/pages artifacts/productarmor-site/src/components').toString();
const lines = diffOutput.split('\n');

let currentFile = null;
let hunks = [];
let currentHunk = null;

for (const line of lines) {
    if (line.startsWith('+++ b/')) {
        currentFile = line.substring(6);
    } else if (line.startsWith('@@ ')) {
        const match = line.match(/@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/);
        if (match && currentFile) {
            currentHunk = {
                startLine: parseInt(match[1], 10) - 1,
                removals: [],
                additions: []
            };
            hunks.push({ file: currentFile, hunk: currentHunk });
        }
    } else if (line.startsWith('-') && !line.startsWith('--- ')) {
        if (currentHunk) currentHunk.removals.push(line.substring(1));
    } else if (line.startsWith('+') && !line.startsWith('+++ ')) {
        if (currentHunk) currentHunk.additions.push(line.substring(1));
    }
}

const hunksByFile = {};
for (const h of hunks) {
    if (!hunksByFile[h.file]) hunksByFile[h.file] = [];
    hunksByFile[h.file].push(h.hunk);
}

for (const [file, fileHunks] of Object.entries(hunksByFile)) {
    const fileLines = fs.readFileSync(file, 'utf8').split('\n');
    let modified = 0;

    for (const hunk of fileHunks) {
        if (hunk.removals.length === hunk.additions.length) {
            for (let i = 0; i < hunk.removals.length; i++) {
                const remLine = hunk.removals[i];
                const addLine = hunk.additions[i];
                
                const origColors = remLine.match(colorRegex) || [];
                const currColors = addLine.match(colorRegex) || [];
                
                if (origColors.join(' ') !== currColors.join(' ')) {
                    const lineIdx = hunk.startLine + i;
                    let newCurrLine = fileLines[lineIdx];
                    
                    if (newCurrLine.trim() === addLine.trim()) {
                        for (const currColor of currColors) {
                            newCurrLine = newCurrLine.replace(new RegExp(`\\b${currColor.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}(?!\\w)`), '');
                        }
                        newCurrLine = newCurrLine.replace(/\s{2,}/g, ' ');
                        
                        if (origColors.length > 0) {
                            const classMatch = newCurrLine.match(/className=(["'])(.*?)\1/);
                            if (classMatch) {
                                const quote = classMatch[1];
                                const innerClasses = classMatch[2].trim();
                                const newClasses = (innerClasses ? innerClasses + ' ' : '') + origColors.join(' ');
                                newCurrLine = newCurrLine.replace(/className=(["']).*?\1/, `className=${quote}${newClasses}${quote}`);
                            }
                        }
                        fileLines[lineIdx] = newCurrLine;
                        modified++;
                    }
                }
            }
        }
    }

    if (modified > 0) {
        fs.writeFileSync(file, fileLines.join('\n'), 'utf8');
        console.log(`[OK] Restored colors on ${modified} lines in ${file}.`);
    }
}
