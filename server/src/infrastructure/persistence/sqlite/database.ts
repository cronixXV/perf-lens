import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const configuredPath = process.env.DATABASE_PATH;

if (!configuredPath) {
  throw new Error('DATABASE_PATH is not defined in environment variables');
}

const databasePath = resolve(configuredPath);

mkdirSync(dirname(databasePath), { recursive: true });

export const database = new Database(databasePath);

database.pragma('journal_mode = WAL');

database.exec(`
  CREATE TABLE IF NOT EXISTS analyses (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    created_at TEXT NOT NULL,
    data TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_analyses_url
  ON analyses(url);

  CREATE INDEX IF NOT EXISTS idx_analyses_created_at
  ON analyses(created_at);
`);
