import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  createdAt: text('created_at').notNull(),
});

export const courses = sqliteTable('courses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  language: text('language').notNull(),
  level: text('level').notNull(),
  imageUrl: text('image_url').notNull(),
  createdAt: text('created_at').notNull(),
});

export const words = sqliteTable('words', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  word: text('word').notNull(),
  translation: text('translation').notNull(),
  pronunciation: text('pronunciation'),
  example: text('example'),
  courseId: integer('course_id').notNull().references(() => courses.id),
  createdAt: text('created_at').notNull(),
});

export const userVocabulary = sqliteTable('user_vocabulary', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  wordId: integer('word_id').notNull().references(() => words.id),
  mastered: integer('mastered', { mode: 'boolean' }).notNull().default(false),
  lastReviewed: text('last_reviewed'),
  reviewCount: integer('review_count').notNull().default(0),
  addedAt: text('added_at').notNull(),
});