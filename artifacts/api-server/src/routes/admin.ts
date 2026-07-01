import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable, poultryRecordsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../lib/auth";

const router = Router();

router.use(requireAdmin);

// --- User management ---

router.get("/admin/users", async (_req, res) => {
  const users = await db
    .select({
      id: usersTable.id,
      username: usersTable.username,
      fullName: usersTable.fullName,
      contact: usersTable.contact,
      role: usersTable.role,
      createdAt: usersTable.createdAt,
    })
    .from(usersTable)
    .orderBy(usersTable.createdAt);
  res.json({ users });
});

router.post("/admin/users", async (req, res) => {
  const { username, password, fullName, contact, role } = req.body as {
    username?: string;
    password?: string;
    fullName?: string;
    contact?: string;
    role?: string;
  };

  if (!username || !password || !fullName) {
    res.status(400).json({ error: "username, password, and fullName are required" });
    return;
  }

  const [existing] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.username, username))
    .limit(1);

  if (existing) {
    res.status(409).json({ error: "Username already taken" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const [created] = await db
    .insert(usersTable)
    .values({
      username,
      passwordHash,
      fullName,
      contact: contact ?? "",
      role: role === "admin" ? "admin" : "member",
    })
    .returning({
      id: usersTable.id,
      username: usersTable.username,
      fullName: usersTable.fullName,
      contact: usersTable.contact,
      role: usersTable.role,
      createdAt: usersTable.createdAt,
    });

  res.status(201).json({ user: created });
});

router.put("/admin/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const { fullName, contact, role, password } = req.body as {
    fullName?: string;
    contact?: string;
    role?: string;
    password?: string;
  };

  const updates: Partial<typeof usersTable.$inferInsert> = {};
  if (fullName !== undefined) updates.fullName = fullName;
  if (contact !== undefined) updates.contact = contact;
  if (role === "admin" || role === "member") updates.role = role;
  if (password) updates.passwordHash = await bcrypt.hash(password, 12);

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }

  const [updated] = await db
    .update(usersTable)
    .set(updates)
    .where(eq(usersTable.id, id))
    .returning({
      id: usersTable.id,
      username: usersTable.username,
      fullName: usersTable.fullName,
      contact: usersTable.contact,
      role: usersTable.role,
      createdAt: usersTable.createdAt,
    });

  if (!updated) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({ user: updated });
});

router.delete("/admin/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [deleted] = await db
    .delete(usersTable)
    .where(eq(usersTable.id, id))
    .returning({ id: usersTable.id });

  if (!deleted) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({ ok: true });
});

// --- All records (admin view) ---
// Returns every record from every user, including soft-deleted ones.
// Joined with the owning user's name so the admin can see who submitted what.
router.get("/admin/records", async (_req, res) => {
  const rows = await db
    .select({
      id: poultryRecordsTable.id,
      userId: poultryRecordsTable.userId,
      memberName: usersTable.fullName,
      memberUsername: usersTable.username,
      batchName: poultryRecordsTable.batchName,
      birdType: poultryRecordsTable.birdType,
      breed: poultryRecordsTable.breed,
      quantity: poultryRecordsTable.quantity,
      ageWeeks: poultryRecordsTable.ageWeeks,
      hatchDate: poultryRecordsTable.hatchDate,
      feedNotes: poultryRecordsTable.feedNotes,
      healthStatus: poultryRecordsTable.healthStatus,
      mortalityCount: poultryRecordsTable.mortalityCount,
      eggProduction: poultryRecordsTable.eggProduction,
      avgWeightKg: poultryRecordsTable.avgWeightKg,
      freeNotes: poultryRecordsTable.freeNotes,
      createdAt: poultryRecordsTable.createdAt,
      updatedAt: poultryRecordsTable.updatedAt,
      deletedAt: poultryRecordsTable.deletedAt,
    })
    .from(poultryRecordsTable)
    .innerJoin(usersTable, eq(poultryRecordsTable.userId, usersTable.id))
    .orderBy(poultryRecordsTable.createdAt);

  res.json({ records: rows });
});

export default router;
