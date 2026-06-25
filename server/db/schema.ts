import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email'),
  passwordHash: text('password_hash').notNull(),
  createdAt: text('created_at').default("datetime('now')"),
});

export const writingSubmissions = sqliteTable('writing_submissions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  topic: text('topic'),
  content: text('content').notNull(),
  score: integer('score'),
  vocabularyScore: integer('vocabulary_score'),
  grammarScore: integer('grammar_score'),
  structureScore: integer('structure_score'),
  coherenceScore: integer('coherence_score'),
  lengthScore: integer('length_score'),
  suggestionsJson: text('suggestions_json'),
  createdAt: text('created_at').default("datetime('now')"),
});

export const translationSubmissions = sqliteTable('translation_submissions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  originalText: text('original_text').notNull(),
  userTranslation: text('user_translation').notNull(),
  score: integer('score'),
  accuracyScore: integer('accuracy_score'),
  fluencyScore: integer('fluency_score'),
  vocabularyScore: integer('vocabulary_score'),
  suggestionsJson: text('suggestions_json'),
  createdAt: text('created_at').default("datetime('now')"),
});

export const studyRecords = sqliteTable('study_records', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  action: text('action').notNull(),
  wordsCount: integer('words_count').default(0),
  minutes: integer('minutes').default(0),
  score: integer('score'),
  createdAt: text('created_at').default("datetime('now')"),
});

export const wrongWords = sqliteTable('wrong_words', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  word: text('word').notNull(),
  meaning: text('meaning'),
  errorCount: integer('error_count').default(1),
  lastErrorAt: text('last_error_at').default("datetime('now')"),
});
