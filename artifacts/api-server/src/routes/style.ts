import { Router, type IRouter } from "express";
import { db, scansTable, similarOutfitsTable, styleDnaTable } from "@workspace/db";
import { eq, desc, asc } from "drizzle-orm";
import { authMiddleware } from "../middlewares/auth";
import path from "path";

const router: IRouter = Router();

router.get("/similar/:scanId", authMiddleware, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.scanId) ? req.params.scanId[0] : req.params.scanId;
  const scanId = parseInt(raw, 10);

  if (isNaN(scanId)) {
    res.status(400).json({ error: "Invalid scan ID" });
    return;
  }

  const [scan] = await db.select().from(scansTable).where(eq(scansTable.id, scanId));
  if (!scan || scan.userId !== req.user!.userId) {
    res.status(404).json({ error: "Scan not found" });
    return;
  }

  const outfits = await db
    .select()
    .from(similarOutfitsTable)
    .where(eq(similarOutfitsTable.scanId, scanId));

  res.json(
    outfits.map((o) => ({
      id: o.id,
      imageUrl: o.imageUrl,
      sourceUrl: o.sourceUrl,
      title: o.title,
      styleTag: o.styleTag,
    }))
  );
});

router.get("/recommendations/:scanId", authMiddleware, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.scanId) ? req.params.scanId[0] : req.params.scanId;
  const scanId = parseInt(raw, 10);

  if (isNaN(scanId)) {
    res.status(400).json({ error: "Invalid scan ID" });
    return;
  }

  const [scan] = await db
    .select()
    .from(scansTable)
    .where(eq(scansTable.id, scanId));

  if (!scan || scan.userId !== req.user!.userId) {
    res.status(404).json({ error: "Scan not found" });
    return;
  }

  const upgrades = (scan.upgrades as Array<Record<string, unknown>>) ?? [];
  res.json(
    upgrades.map((u) => ({
      swap: (u.swap as string) ?? "",
      with: (u.with as string) ?? "",
      predictedScoreIncrease: (u.predicted_score_increase as number) ?? (u.predictedScoreIncrease as number) ?? 0,
      searchQuery: (u.search_query as string) ?? (u.searchQuery as string) ?? "",
      priceRange: (u.price_range as string) ?? (u.priceRange as string) ?? "",
    }))
  );
});

router.get("/style-dna", authMiddleware, async (req, res): Promise<void> => {
  const userId = req.user!.userId;

  const scans = await db
    .select()
    .from(scansTable)
    .where(eq(scansTable.userId, userId))
    .orderBy(asc(scansTable.createdAt));

  const totalScans = scans.length;
  const locked = totalScans < 5;
  const scansNeeded = Math.max(0, 5 - totalScans);

  if (locked) {
    res.json({
      locked: true,
      scansNeeded,
      totalOutfitsScanned: totalScans,
      dominantArchetype: null,
      archetypePercentage: null,
      topColors: [],
      avgScores: null,
      bestOutfit: null,
      worstOutfit: null,
      styleEvolution: [],
      scoreTrend: [],
    });
    return;
  }

  const archetypeCounts: Record<string, number> = {};
  const allColors: Record<string, number> = {};
  const scoreAccum = { fit: 0, color: 0, coherence: 0, trend: 0, signature: 0 };

  for (const scan of scans) {
    if (scan.styleArchetype) {
      archetypeCounts[scan.styleArchetype] = (archetypeCounts[scan.styleArchetype] || 0) + 1;
    }
    const palette = scan.colorPalette as string[] | null;
    if (palette) {
      for (const c of palette) {
        allColors[c] = (allColors[c] || 0) + 1;
      }
    }
    scoreAccum.fit += scan.fitScore ?? 0;
    scoreAccum.color += scan.colorScore ?? 0;
    scoreAccum.coherence += scan.coherenceScore ?? 0;
    scoreAccum.trend += scan.trendScore ?? 0;
    scoreAccum.signature += scan.signatureScore ?? 0;
  }

  const dominantArchetype = Object.entries(archetypeCounts).sort((a, b) => b[1] - a[1])[0];
  const topColors = Object.entries(allColors)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([color]) => color);

  const avgScores = {
    fit: Math.round((scoreAccum.fit / totalScans) * 10) / 10,
    color: Math.round((scoreAccum.color / totalScans) * 10) / 10,
    coherence: Math.round((scoreAccum.coherence / totalScans) * 10) / 10,
    trend: Math.round((scoreAccum.trend / totalScans) * 10) / 10,
    signature: Math.round((scoreAccum.signature / totalScans) * 10) / 10,
  };

  const sortedByScore = [...scans].sort((a, b) => b.overallScore - a.overallScore);
  const bestScan = sortedByScore[0];
  const worstScan = sortedByScore[sortedByScore.length - 1];

  const styleEvolution = scans.map((s) => ({
    archetype: s.styleArchetype ?? "Unknown",
    date: s.createdAt.toISOString(),
    score: s.overallScore,
  }));

  const scoreTrend = scans.map((s) => ({
    date: s.createdAt.toISOString(),
    score: s.overallScore,
  }));

  const formatSummary = (s: typeof scansTable.$inferSelect) => ({
    id: s.id,
    imagePath: `/api/uploads/${path.basename(s.imagePath)}`,
    overallScore: s.overallScore,
    styleArchetype: s.styleArchetype ?? "",
    createdAt: s.createdAt.toISOString(),
  });

  await db
    .insert(styleDnaTable)
    .values({
      userId,
      dominantArchetype: dominantArchetype?.[0] ?? null,
      topColors,
      avgScores,
      totalOutfitsScanned: totalScans,
      bestOutfitId: bestScan?.id ?? null,
      worstOutfitId: worstScan?.id ?? null,
      styleEvolution,
    })
    .onConflictDoUpdate({
      target: styleDnaTable.userId,
      set: {
        dominantArchetype: dominantArchetype?.[0] ?? null,
        topColors,
        avgScores,
        totalOutfitsScanned: totalScans,
        bestOutfitId: bestScan?.id ?? null,
        worstOutfitId: worstScan?.id ?? null,
        styleEvolution,
      },
    });

  res.json({
    locked: false,
    scansNeeded: 0,
    totalOutfitsScanned: totalScans,
    dominantArchetype: dominantArchetype?.[0] ?? null,
    archetypePercentage: dominantArchetype
      ? Math.round((dominantArchetype[1] / totalScans) * 100)
      : null,
    topColors,
    avgScores,
    bestOutfit: bestScan ? formatSummary(bestScan) : null,
    worstOutfit: worstScan ? formatSummary(worstScan) : null,
    styleEvolution,
    scoreTrend,
  });
});

router.get("/style-dna/report", authMiddleware, async (req, res): Promise<void> => {
  const userId = req.user!.userId;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const scans = await db
    .select()
    .from(scansTable)
    .where(eq(scansTable.userId, userId))
    .orderBy(asc(scansTable.createdAt));

  const recentScans = scans.filter((s) => s.createdAt >= thirtyDaysAgo);

  if (recentScans.length < 10) {
    res.json({
      available: false,
      totalOutfits: recentScans.length,
      avgScore: 0,
      scoreTrend: "stable" as const,
      mostWornStyle: null,
      bestOutfit: null,
      topColorPalette: [],
      styleInOneWord: null,
    });
    return;
  }

  const avgScore = Math.round(
    (recentScans.reduce((sum, s) => sum + s.overallScore, 0) / recentScans.length) * 10
  ) / 10;

  const firstHalf = recentScans.slice(0, Math.floor(recentScans.length / 2));
  const secondHalf = recentScans.slice(Math.floor(recentScans.length / 2));
  const firstAvg = firstHalf.reduce((s, r) => s + r.overallScore, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((s, r) => s + r.overallScore, 0) / secondHalf.length;
  const scoreTrend = secondAvg > firstAvg + 0.3 ? "up" : secondAvg < firstAvg - 0.3 ? "down" : "stable";

  const archetypeCounts: Record<string, number> = {};
  const allColors: Record<string, number> = {};
  for (const scan of recentScans) {
    if (scan.styleArchetype) {
      archetypeCounts[scan.styleArchetype] = (archetypeCounts[scan.styleArchetype] || 0) + 1;
    }
    const palette = scan.colorPalette as string[] | null;
    if (palette) {
      for (const c of palette) {
        allColors[c] = (allColors[c] || 0) + 1;
      }
    }
  }

  const mostWornStyle = Object.entries(archetypeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const topColorPalette = Object.entries(allColors)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([c]) => c);

  const bestScan = [...recentScans].sort((a, b) => b.overallScore - a.overallScore)[0];

  const styleWords: Record<string, string> = {
    "Quiet Luxury": "Refined",
    "Modern Minimalist": "Intentional",
    "Athleisure Casual": "Active",
    "Editorial Chic": "Bold",
    "Streetwear Forward": "Expressive",
    "Old Money Elegance": "Timeless",
  };
  const styleInOneWord = mostWornStyle ? (styleWords[mostWornStyle] ?? "Stylish") : null;

  res.json({
    available: true,
    totalOutfits: recentScans.length,
    avgScore,
    scoreTrend,
    mostWornStyle,
    bestOutfit: bestScan
      ? {
          id: bestScan.id,
          imagePath: `/api/uploads/${path.basename(bestScan.imagePath)}`,
          overallScore: bestScan.overallScore,
          styleArchetype: bestScan.styleArchetype ?? "",
          createdAt: bestScan.createdAt.toISOString(),
        }
      : null,
    topColorPalette,
    styleInOneWord,
  });
});

export default router;
