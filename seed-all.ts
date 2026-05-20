/**
 * Master seed script — runs every seed file in the correct order.
 *
 * Run from the BB_Backend directory:
 *   npm run seed:all
 */

import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const files = [
  "seed.ts",              // Base: users, initial courses
  "seed-admin.ts",        // Admin user
  "seed-company.ts",      // Companies
  "seed-problems.ts",     // DSA problems
  "seed-sql-problems.ts", // SQL problems
  "seed-resources.ts",    // Resources (notes, blogs, papers)
  "seed-contest.ts",      // Contests
  "seed-mock.ts",         // Mock tests
  "seed-nodejs.ts",       // Node.js + Express.js course
  "seed-mongodb.ts",      // MongoDB course
  "seed-reactjs.ts",      // React.js course
];

let passed = 0;
let failed = 0;

console.log("🚀  Starting full database seed...\n");
console.log(`   Files to run: ${files.length}\n`);
console.log("─".repeat(50));

for (const file of files) {
  console.log(`\n📄  ${file}`);
  try {
    execSync(`npx ts-node --esm ${path.join(__dirname, file)}`, {
      stdio: "inherit",
      cwd: __dirname,
    });
    passed++;
  } catch {
    console.error(`\n❌  Failed: ${file}`);
    failed++;
    // Continue with remaining files even if one fails
  }
}

console.log("\n" + "─".repeat(50));
console.log(`\n✅  Passed: ${passed}  |  ❌  Failed: ${failed}`);
console.log(`\n🎉  Seed complete!\n`);

if (failed > 0) process.exit(1);
