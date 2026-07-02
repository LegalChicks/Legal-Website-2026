import { Router } from "express";
import { db, salesRecordsTable } from "@workspace/db";
import { eq, and, isNull } from "drizzle-orm";
import { requireAuth } from "../lib/auth";

const router = Router();

router.use(requireAuth);

const ALLOWED_FIELDS = [
  "saleDate",
  "productType",
  "breed",
  "quantity",
  "unit",
  "unitPrice",
  "totalAmount",
  "buyerName",
  "buyerContact",
  "deliveryMethod",
  "deliveryAddress",
  "paymentMethod",
  "paymentStatus",
  "amountPaid",
  "balance",
  "notes",
] as const;

function pickAllowed(body: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const key of ALLOWED_FIELDS) {
    if (key in body) out[key] = body[key];
  }
  return out;
}

// User: list own non-deleted sales
router.get("/sales", async (req, res) => {
  const userId = req.user!.id;
  const records = await db
    .select()
    .from(salesRecordsTable)
    .where(and(eq(salesRecordsTable.userId, userId), isNull(salesRecordsTable.deletedAt)))
    .orderBy(salesRecordsTable.saleDate);
  res.json({ records });
});

// User: create freely — no admin approval needed
router.post("/sales", async (req, res) => {
  const userId = req.user!.id;
  const body = pickAllowed(req.body as Record<string, unknown>) as Partial<
    typeof salesRecordsTable.$inferInsert
  >;

  if (!body.saleDate || !body.productType) {
    res.status(400).json({ error: "saleDate and productType are required" });
    return;
  }

  const [created] = await db
    .insert(salesRecordsTable)
    .values({
      userId,
      saleDate: body.saleDate,
      productType: body.productType,
      breed: body.breed ?? "",
      quantity: body.quantity ?? 0,
      unit: body.unit ?? "pcs",
      unitPrice: body.unitPrice ?? "0",
      totalAmount: body.totalAmount ?? "0",
      buyerName: body.buyerName ?? "",
      buyerContact: body.buyerContact ?? "",
      deliveryMethod: body.deliveryMethod ?? "pickup",
      deliveryAddress: body.deliveryAddress ?? null,
      paymentMethod: body.paymentMethod ?? "cash",
      paymentStatus: body.paymentStatus ?? "paid",
      amountPaid: body.amountPaid ?? "0",
      balance: body.balance ?? "0",
      notes: body.notes ?? null,
    })
    .returning();

  res.status(201).json({ record: created });
});

// User: update own active sale
router.put("/sales/:id", async (req, res) => {
  const userId = req.user!.id;
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const updates = pickAllowed(req.body as Record<string, unknown>) as Partial<
    typeof salesRecordsTable.$inferInsert
  >;
  updates.updatedAt = new Date();

  const [updated] = await db
    .update(salesRecordsTable)
    .set(updates)
    .where(
      and(
        eq(salesRecordsTable.id, id),
        eq(salesRecordsTable.userId, userId),
        isNull(salesRecordsTable.deletedAt),
      ),
    )
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Sales record not found" });
    return;
  }
  res.json({ record: updated });
});

// User: soft-delete own sale — admin retains it
router.delete("/sales/:id", async (req, res) => {
  const userId = req.user!.id;
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [deleted] = await db
    .update(salesRecordsTable)
    .set({ deletedAt: new Date() })
    .where(
      and(
        eq(salesRecordsTable.id, id),
        eq(salesRecordsTable.userId, userId),
        isNull(salesRecordsTable.deletedAt),
      ),
    )
    .returning({ id: salesRecordsTable.id });

  if (!deleted) {
    res.status(404).json({ error: "Sales record not found" });
    return;
  }
  res.json({ ok: true });
});

export default router;
