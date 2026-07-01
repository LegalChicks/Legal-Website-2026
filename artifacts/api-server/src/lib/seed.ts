import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "./logger";

export async function seedAdmin() {
  try {
    const existing = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.username, "admin"))
      .limit(1);

    if (existing.length > 0) {
      logger.info("Admin account already exists — skipping seed");
      return;
    }

    const passwordHash = await bcrypt.hash("admin", 12);
    await db.insert(usersTable).values({
      username: "admin",
      passwordHash,
      fullName: "Farm Administrator",
      contact: "",
      role: "admin",
    });

    logger.info("Admin account seeded (username: admin, password: admin)");
  } catch (err) {
    logger.error({ err }, "Failed to seed admin account");
  }
}
