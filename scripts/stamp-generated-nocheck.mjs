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
for (const file of walk(GENERATED_DIR)) {
  const content = readFileSync(file, 'utf8');
  if (content.startsWith(STAMP)) continue;
  writeFileSync(file, `${STAMP}\n${content}`);
  stamped += 1;
}

console.log(`stamp-generated-nocheck: stamped ${stamped} file(s) in ${GENERATED_DIR}`);
