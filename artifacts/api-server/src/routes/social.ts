import { Router, type IRouter } from "express";
import { db, scansTable, usersTable } from "@workspace/db";
import { desc, sql, count, avg, eq, and, gte } from "drizzle-orm";
import path from "path";

const router: IRouter = Router();

router.get("/leaderboard", async (req, res): Promise<void> => {
  const period = String(req.query.period ?? "all_time");
  const limit = Math.min(parseInt(String(req.query.limit ?? "20"), 10), 50);

  let dateFilter;
  if (period === "daily") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dateFilter = gte(scansTable.createdAt, today);
  } else if (period === "weekly") {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    dateFilter = gte(scansTable.createdAt, weekAgo);
  }

  const conditions = dateFilter
    ? and(dateFilter)
    : undefined;

  const entries = await db
    .select({
      id: scansTable.id,
      username: usersTable.username,
      overallScore: scansTable.overallScore,
      styleArchetype: scansTable.styleArchetype,
      imagePath: scansTable.imagePath,
      createdAt: scansTable.createdAt,
    })
    .from(scansTable)
    .innerJoin(usersTable, eq(scansTable.userId, usersTable.id))
    .where(conditions)
    .orderBy(desc(scansTable.overallScore))
    .limit(limit);

  res.json(
    entries.map((e) => ({
      id: e.id,
      username: e.username,
      overallScore: e.overallScore,
      styleArchetype: e.styleArchetype ?? "",
      imagePath: `/api/uploads/${path.basename(e.imagePath)}`,
      createdAt: e.createdAt.toISOString(),
    }))
  );
});

router.get("/stats", async (_req, res): Promise<void> => {
  const [scanCount] = await db.select({ count: count() }).from(scansTable);
  const [userCount] = await db.select({ count: count() }).from(usersTable);
  const [avgResult] = await db.select({ avg: avg(scansTable.overallScore) }).from(scansTable);

  const archetypeResult = await db
    .select({
      archetype: scansTable.styleArchetype,
      count: count(),
    })
    .from(scansTable)
    .groupBy(scansTable.styleArchetype)
    .orderBy(desc(count()))
    .limit(1);

  res.json({
    totalScans: scanCount?.count ?? 0,
    totalUsers: userCount?.count ?? 0,
    avgScore: avgResult?.avg ? Math.round(parseFloat(String(avgResult.avg)) * 10) / 10 : 0,
    topArchetype: archetypeResult[0]?.archetype ?? "N/A",
  });
});

export default router;
