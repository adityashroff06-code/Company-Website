const colorRegex = /\btext-(?:\[#[0-9a-fA-F]+\]|white|black|transparent|current|(?:gray|red|blue|green|yellow|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|indigo|violet|purple|fuchsia|pink|rose)-[0-9]+|primary|navy|accent|muted-foreground|foreground|body(?:-sm)?)(?:\/[0-9]+)?(?!\w)/g;

const remLine = '<p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#f0b36d]">';
const addLine = '<p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-accent/80">';

const origColors = remLine.match(colorRegex) || [];
const currColors = addLine.match(colorRegex) || [];

console.log('origColors:', origColors);
console.log('currColors:', currColors);
