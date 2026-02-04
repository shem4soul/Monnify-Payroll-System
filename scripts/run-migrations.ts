import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

// Convert __filename & __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to database.ts
const databasePath = pathToFileURL(
  path.join(__dirname, "../src/config/database.ts"),
).href;

// Dynamically import database
const { query, pool } = await import(databasePath);

async function runMigrations() {
  try {
    const migrationsDir = path.join(__dirname, "../migrations");
    const files = fs.readdirSync(migrationsDir).sort();

    for (const file of files) {
      if (file.endsWith(".sql")) {
        console.log(`Running migration: ${file}`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
        await query(sql);
        console.log(`Completed: ${file}`);
      }
    }

    console.log("All migrations completed successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

await runMigrations();

// import fs from "fs";
// import path from "path";
// import { query, pool } from "../src/config/database";

// async function runMigrations() {
//   const migrationsDir = path.join(__dirname, "../migrations");
//   const files = fs.readdirSync(migrationsDir).sort();

//   for (const file of files) {
//     if (file.endsWith(".sql")) {
//       console.log(`Running migration: ${file}`);
//       const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
//       await pool.query(sql);
//       console.log(`Completed: ${file}`);
//     }
//   }

//   console.log("All migrations completed");
//   await pool.end();
// }

// runMigrations().catch((err) => {
//   console.error("Migration failed:", err);
//   process.exit(1);
// });
