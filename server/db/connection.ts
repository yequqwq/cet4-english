import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

const sqlite = new Database(process.env.DB_PATH || './cet4.db');
export const db = drizzle(sqlite, { schema });

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS writing_submissions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    topic TEXT, content TEXT NOT NULL,
    score INTEGER, vocabulary_score INTEGER, grammar_score INTEGER,
    structure_score INTEGER, coherence_score INTEGER, length_score INTEGER,
    suggestions_json TEXT, created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
  CREATE TABLE IF NOT EXISTS translation_submissions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    original_text TEXT NOT NULL, user_translation TEXT NOT NULL,
    score INTEGER, accuracy_score INTEGER, fluency_score INTEGER,
    vocabulary_score INTEGER, suggestions_json TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
  CREATE TABLE IF NOT EXISTS study_records (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL, action TEXT NOT NULL,
    words_count INTEGER DEFAULT 0, minutes INTEGER DEFAULT 0, score INTEGER,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
  CREATE TABLE IF NOT EXISTS wrong_words (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL, word TEXT NOT NULL, meaning TEXT,
    error_count INTEGER DEFAULT 1, last_error_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);
