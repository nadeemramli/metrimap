// Stamps `// @ts-nocheck` onto every generated Prisma/Zod schema file.
//
// Why: `prisma-zod-generator` emits runtime-valid Zod schemas whose *types*
// don't pass strict `tsc` (they reference Prisma namespace members that the
// installed @prisma/client doesn't expose, plus some missing enum modules).
// These files are auto-generated and imported by the app, so `exclude` in
// tsconfig won't silence them (imported .ts files are still type-checked).
// Stamping `@ts-nocheck` is the only robust way to keep them out of the
// type-check while leaving them fully functional at runtime.
//
// This runs automatically after `prisma generate` (see package.json
// `prisma:generate`) so the stamp survives every regeneration.

import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const GENERATED_DIR = 'src/lib/prisma/generated';
const STAMP = '// @ts-nocheck';

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (entry.endsWith('.ts')) out.push(full);
  }
  return out;
}

let stamped = 0;
let zodFixed = 0;
for (const file of walk(GENERATED_DIR)) {
  let content = readFileSync(file, 'utf8');
  let changed = false;

  // Zod v3 compatibility: prisma-zod-generator (>=1.4) emits the Zod v4 ISO
  // helper `z.iso.datetime()`, but this project runs Zod 3 where `z.iso` is
  // undefined — so importing these schemas throws
  // `Cannot read properties of undefined (reading 'datetime')` at runtime.
  // Rewrite to the Zod 3 equivalent. (Remove once the project moves to Zod 4.)
  if (content.includes('z.iso.datetime()')) {
    content = content.replaceAll('z.iso.datetime()', 'z.string().datetime()');
    zodFixed += 1;
    changed = true;
  }

  if (!content.startsWith(STAMP)) {
    content = `${STAMP}\n${content}`;
    stamped += 1;
    changed = true;
  }

  if (changed) writeFileSync(file, content);
}

console.log(
  `stamp-generated-nocheck: stamped ${stamped} file(s), zod3-fixed ${zodFixed} file(s) in ${GENERATED_DIR}`
);
