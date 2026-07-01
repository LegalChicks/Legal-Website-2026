import { Router } from "express";
import { db, poultryRecordsTable, usersTable } from "@workspace/db";
import { eq, and, isNull } from "drizzle-orm";
import { requireAuth } from "../lib/auth";

const router = Router();

// Public: admin's records only — no auth required
router.get("/records/public", async (_req, res) => {
  const [adminUser] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.username, "admin"))
    .limit(1);

  if (!adminUser) {
    res.json({ records: [] });
    return;
  }

  const records = await db
    .select()
    .from(poultryRecordsTable)
    .where(
      and(
        eq(poultryRecordsTable.userId, adminUser.id),
        isNull(poultryRecordsTable.deletedAt),
      ),
    )
    .orderBy(poultryRecordsTable.createdAt);

  res.json({ records });
});

router.use(requireAuth);

// User: list their own non-deleted records
router.get("/records", async (req, res) => {
  const userId = req.user!.id;
  const records = await db
    .select()
    .from(poultryRecordsTable)
    .where(
      and(
        eq(poultryRecordsTable.userId, userId),
        isNull(poultryRecordsTable.deletedAt),
      ),
    )
    .orderBy(poultryRecordsTable.createdAt);
  res.json({ records });
});

// User: create a record freely — no admin approval needed
router.post("/records", async (req, res) => {
  const userId = req.user!.id;
  const body = req.body as {
    batchName?: string;
    birdType?: string;
    breed?: string;
    quantity?: number;
    ageWeeks?: number | null;
    hatchDate?: string | null;
    feedNotes?: string | null;
    healthStatus?: string | null;
    mortalityCount?: number;
    eggProduction?: number | null;
    avgWeightKg?: string | null;
    freeNotes?: string | null;
  };

  if (!body.batchName) {
    res.status(400).json({ error: "batchName is required" });
    return;
  }

  const [created] = await db
    .insert(poultryRecordsTable)
    .values({
      userId,
      batchName: body.batchName,
      birdType: body.birdType ?? "",
      breed: body.breed ?? "",
      quantity: body.quantity ?? 0,
      ageWeeks: body.ageWeeks ?? null,
      hatchDate: body.hatchDate ?? null,
      feedNotes: body.feedNotes ?? null,
      healthStatus: body.healthStatus ?? null,
      mortalityCount: body.mortalityCount ?? 0,
      eggProduction: body.eggProduction ?? null,
      avgWeightKg: body.avgWeightKg ?? null,
      freeNotes: body.freeNotes ?? null,
    })
    .returning();

  res.status(201).json({ record: created });
});

// User: update their own non-deleted record
router.put("/records/:id", async (req, res) => {
  const userId = req.user!.id;
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const body = req.body as Partial<typeof poultryRecordsTable.$inferInsert>;

  const safeUpdate: Partial<typeof poultryRecordsTable.$inferInsert> = {};
  const allowed = [
    "batchName",
    "birdType",
    "breed",
    "quantity",
    "ageWeeks",
    "hatchDate",
    "feedNotes",
    "healthStatus",
    "mortalityCount",
    "eggProduction",
    "avgWeightKg",
    "freeNotes",
  ] as const;

  for (const key of allowed) {
    if (key in body) {
      (safeUpdate as Record<string, unknown>)[key] = body[key];
    }
  }

  safeUpdate.updatedAt = new Date();

  const [updated] = await db
    .update(poultryRecordsTable)
    .set(safeUpdate)
    .where(
      and(
        eq(poultryRecordsTable.id, id),
        eq(poultryRecordsTable.userId, userId),
        isNull(poultryRecordsTable.deletedAt),
      ),
    )
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Record not found" });
    return;
  }
  res.json({ record: updated });
});

// User: soft-delete their own record (admin retains it invisibly)
router.delete("/records/:id", async (req, res) => {
  const userId = req.user!.id;
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [deleted] = await db
    .update(poultryRecordsTable)
    .set({ deletedAt: new Date() })
    .where(
      and(
        eq(poultryRecordsTable.id, id),
        eq(poultryRecordsTable.userId, userId),
        isNull(poultryRecordsTable.deletedAt),
      ),
    )
    .returning({ id: poultryRecordsTable.id });

  if (!deleted) {
    res.status(404).json({ error: "Record not found" });
    return;
  }
  res.json({ ok: true });
});

export default router;
