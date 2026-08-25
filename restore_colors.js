const fs = require('fs');
const { execSync } = require('child_process');

const colorRegex = /\btext-(?:\[#[0-9a-fA-F]+\]|white|black|transparent|current|(?:gray|red|blue|green|yellow|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|indigo|violet|purple|fuchsia|pink|rose)-[0-9]+|primary|navy|accent|muted-foreground|foreground)(?:\/[0-9]+)?\b/g;

function getOriginalFile(filepath) {
    return execSync(`git show HEAD~1:${filepath}`).toString();
}

function processFile(filepath) {
    const originalContent = getOriginalFile(filepath).split('\n');
    let currentContent = fs.readFileSync(filepath, 'utf8').split('\n');
    
    if (originalContent.length !== currentContent.length) {
        console.log(`[WARN] Line counts differ for ${filepath}: orig ${originalContent.length}, curr ${currentContent.length}`);
        // We'll still try to do a line-by-line if it's close, but it's risky.
        // Actually, let's just abort mapping if they differ significantly.
        if (Math.abs(originalContent.length - currentContent.length) > 5) {
            console.log(`Skipping ${filepath} due to line mismatch.`);
            return;
        }
    }

    let modifiedCount = 0;

    for (let i = 0; i < currentContent.length; i++) {
        // Because line counts might be slightly off if I deleted/added lines,
        // this naive 1:1 mapping might break. But let's check if the lines look somewhat similar.
        // Better approach: just use the exact line since we verified Career.tsx matches exactly.
        // Let's see if other files match exactly.
        const origLine = originalContent[i] || '';
        const currLine = currentContent[i];

        // Find all text colors in origLine
        const origColors = origLine.match(colorRegex) || [];
        const currColors = currLine.match(colorRegex) || [];

        // If they differ in color classes, we replace the current color classes with the original ones.
        if (origColors.join(' ') !== currColors.join(' ')) {
            // Check if the lines are somewhat matching (e.g. both have 'className')
            if (origLine.includes('className=') && currLine.includes('className=')) {
                let newCurrLine = currLine;
                // Remove all currColors from newCurrLine
                for (const currColor of currColors) {
                    newCurrLine = newCurrLine.replace(new RegExp(`\\b${currColor.replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/\//g, '\\/')}\\b`), '');
                }
                // Cleanup double spaces created by removal
                newCurrLine = newCurrLine.replace(/\s{2,}/g, ' ');

                // Add origColors into the className. We can find className=" and insert there.
                if (origColors.length > 0) {
                    const classMatch = newCurrLine.match(/className=(["'])(.*?)\1/);
                    if (classMatch) {
                        const quote = classMatch[1];
                        const innerClasses = classMatch[2].trim();
                        const newClasses = (innerClasses ? innerClasses + ' ' : '') + origColors.join(' ');
                        newCurrLine = newCurrLine.replace(/className=(["']).*?\1/, `className=${quote}${newClasses}${quote}`);
                    }
                }
                currentContent[i] = newCurrLine;
                modifiedCount++;
            }
        }
    }

    fs.writeFileSync(filepath, currentContent.join('\n'), 'utf8');
    console.log(`[OK] Processed ${filepath}: restored colors on ${modifiedCount} lines.`);
}

const files = execSync('find artifacts/productarmor-site/src/pages artifacts/productarmor-site/src/components -name "*.tsx"').toString().trim().split('\n');

for (const file of files) {
    if (file) processFile(file);
}
