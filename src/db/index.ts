import { Database } from "bun:sqlite";

export const db = new Database("sqlite.db");

db.run(`
CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0
);
`);
