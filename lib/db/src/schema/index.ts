import { pgTable, serial, text, integer, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  contact: text("contact").notNull().default(""),
  role: text("role").notNull().default("member"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const poultryRecordsTable = pgTable("poultry_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  batchName: text("batch_name").notNull(),
  birdType: text("bird_type").notNull().default(""),
  breed: text("breed").notNull().default(""),
  quantity: integer("quantity").notNull().default(0),
  ageWeeks: integer("age_weeks"),
  hatchDate: text("hatch_date"),
  feedNotes: text("feed_notes"),
  healthStatus: text("health_status"),
  mortalityCount: integer("mortality_count").notNull().default(0),
  eggProduction: integer("egg_production"),
  avgWeightKg: numeric("avg_weight_kg", { precision: 5, scale: 2 }),
  freeNotes: text("free_notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({
  id: true,
  createdAt: true,
});

export const insertPoultryRecordSchema = createInsertSchema(
  poultryRecordsTable,
).omit({ id: true, userId: true, createdAt: true, updatedAt: true, deletedAt: true });

export type User = typeof usersTable.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type PoultryRecord = typeof poultryRecordsTable.$inferSelect;
export type InsertPoultryRecord = z.infer<typeof insertPoultryRecordSchema>;
