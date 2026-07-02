import { Router } from "express";
import { db, incubationRecordsTable } from "@workspace/db";
import { eq, and, isNull } from "drizzle-orm";
import { requireAuth } from "../lib/auth";

const router = Router();

router.use(requireAuth);

const ALLOWED_FIELDS = [
  "batchName",
  "breed",
  "eggsSetCount",
  "setDate",
  "incubatorType",
  "temperatureC",
  "humidityPercent",
  "expectedHatchDate",
  "day7FertileCount",
  "day7InfertileCount",
  "day14FertileCount",
  "day14InfertileCount",
  "day18FertileCount",
  "day18InfertileCount",
  "actualHatchDate",
  "hatchedCount",
  "unhatchedCount",
  "deadInShellCount",
  "cullCount",
  "status",
  "notes",
] as const;

function pickAllowed(body: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const key of ALLOWED_FIELDS) {
    if (key in body) out[key] = body[key];
  }
  return out;
}

// User: list own non-deleted incubation batches
router.get("/incubation", async (req, res) => {
  const userId = req.user!.id;
  const records = await db
    .select()
    .from(incubationRecordsTable)
    .where(
      and(
        eq(incubationRecordsTable.userId, userId),
        isNull(incubationRecordsTable.deletedAt),
      ),
    )
    .orderBy(incubationRecordsTable.setDate);
  res.json({ records });
});

// User: create freely — no admin approval needed
router.post("/incubation", async (req, res) => {
  const userId = req.user!.id;
  const body = pickAllowed(req.body as Record<string, unknown>) as Partial<
    typeof incubationRecordsTable.$inferInsert
  >;

  if (!body.batchName || !body.setDate) {
    res.status(400).json({ error: "batchName and setDate are required" });
    return;
  }

  const [created] = await db
    .insert(incubationRecordsTable)
    .values({
      userId,
      batchName: body.batchName,
      breed: body.breed ?? "",
      eggsSetCount: body.eggsSetCount ?? 0,
      setDate: body.setDate,
      incubatorType: body.incubatorType ?? "",
      temperatureC: body.temperatureC ?? null,
      humidityPercent: body.humidityPercent ?? null,
      expectedHatchDate: body.expectedHatchDate ?? null,
      day7FertileCount: body.day7FertileCount ?? null,
      day7InfertileCount: body.day7InfertileCount ?? null,
      day14FertileCount: body.day14FertileCount ?? null,
      day14InfertileCount: body.day14InfertileCount ?? null,
      day18FertileCount: body.day18FertileCount ?? null,
      day18InfertileCount: body.day18InfertileCount ?? null,
      actualHatchDate: body.actualHatchDate ?? null,
      hatchedCount: body.hatchedCount ?? null,
      unhatchedCount: body.unhatchedCount ?? null,
      deadInShellCount: body.deadInShellCount ?? null,
      cullCount: body.cullCount ?? null,
      status: body.status ?? "incubating",
      notes: body.notes ?? null,
    })
    .returning();

  res.status(201).json({ record: created });
});

// User: update own active batch
router.put("/incubation/:id", async (req, res) => {
  const userId = req.user!.id;
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const updates = pickAllowed(req.body as Record<string, unknown>) as Partial<
    typeof incubationRecordsTable.$inferInsert
  >;
  updates.updatedAt = new Date();

  const [updated] = await db
    .update(incubationRecordsTable)
    .set(updates)
    .where(
      and(
        eq(incubationRecordsTable.id, id),
        eq(incubationRecordsTable.userId, userId),
        isNull(incubationRecordsTable.deletedAt),
      ),
    )
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Incubation record not found" });
    return;
  }
  res.json({ record: updated });
});

// User: soft-delete own batch — admin retains it
router.delete("/incubation/:id", async (req, res) => {
  const userId = req.user!.id;
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [deleted] = await db
    .update(incubationRecordsTable)
    .set({ deletedAt: new Date() })
    .where(
      and(
        eq(incubationRecordsTable.id, id),
        eq(incubationRecordsTable.userId, userId),
        isNull(incubationRecordsTable.deletedAt),
      ),
    )
    .returning({ id: incubationRecordsTable.id });

  if (!deleted) {
    res.status(404).json({ error: "Incubation record not found" });
    return;
  }
  res.json({ ok: true });
});

export default router;
