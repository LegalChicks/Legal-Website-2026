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

export const salesRecordsTable = pgTable("sales_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  saleDate: text("sale_date").notNull(),
  productType: text("product_type").notNull(), // fertile_eggs | table_eggs | live_chickens
  breed: text("breed").notNull().default(""),
  quantity: integer("quantity").notNull().default(0),
  unit: text("unit").notNull().default("pcs"), // pcs | trays | heads
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull().default("0"),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  buyerName: text("buyer_name").notNull().default(""),
  buyerContact: text("buyer_contact").notNull().default(""),
  deliveryMethod: text("delivery_method").notNull().default("pickup"), // pickup | delivery
  deliveryAddress: text("delivery_address"),
  paymentMethod: text("payment_method").notNull().default("cash"), // cash | gcash | bank_transfer
  paymentStatus: text("payment_status").notNull().default("paid"), // paid | pending | partial
  amountPaid: numeric("amount_paid", { precision: 12, scale: 2 }).notNull().default("0"),
  balance: numeric("balance", { precision: 12, scale: 2 }).notNull().default("0"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const incubationRecordsTable = pgTable("incubation_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  batchName: text("batch_name").notNull(),
  breed: text("breed").notNull().default(""),
  eggsSetCount: integer("eggs_set_count").notNull().default(0),
  setDate: text("set_date").notNull(),
  incubatorType: text("incubator_type").notNull().default(""),
  temperatureC: numeric("temperature_c", { precision: 4, scale: 1 }),
  humidityPercent: numeric("humidity_percent", { precision: 4, scale: 1 }),
  expectedHatchDate: text("expected_hatch_date"),
  day7FertileCount: integer("day7_fertile_count"),
  day7InfertileCount: integer("day7_infertile_count"),
  day14FertileCount: integer("day14_fertile_count"),
  day14InfertileCount: integer("day14_infertile_count"),
  day18FertileCount: integer("day18_fertile_count"),
  day18InfertileCount: integer("day18_infertile_count"),
  actualHatchDate: text("actual_hatch_date"),
  hatchedCount: integer("hatched_count"),
  unhatchedCount: integer("unhatched_count"),
  deadInShellCount: integer("dead_in_shell_count"),
  cullCount: integer("cull_count"),
  status: text("status").notNull().default("incubating"), // incubating | hatched | failed
  notes: text("notes"),
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

export const insertSalesRecordSchema = createInsertSchema(
  salesRecordsTable,
).omit({ id: true, userId: true, createdAt: true, updatedAt: true, deletedAt: true });

export const insertIncubationRecordSchema = createInsertSchema(
  incubationRecordsTable,
).omit({ id: true, userId: true, createdAt: true, updatedAt: true, deletedAt: true });

export type User = typeof usersTable.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type PoultryRecord = typeof poultryRecordsTable.$inferSelect;
export type InsertPoultryRecord = z.infer<typeof insertPoultryRecordSchema>;
export type SalesRecord = typeof salesRecordsTable.$inferSelect;
export type InsertSalesRecord = z.infer<typeof insertSalesRecordSchema>;
export type IncubationRecord = typeof incubationRecordsTable.$inferSelect;
export type InsertIncubationRecord = z.infer<typeof insertIncubationRecordSchema>;
