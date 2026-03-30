import { Router, type IRouter } from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { db, usersTable, scansTable, similarOutfitsTable, curatedOutfitsTable } from "@workspace/db";
import { eq, desc, asc, sql, and, count } from "drizzle-orm";
import { authMiddleware } from "../middlewares/auth";
import { analyzeOutfit } from "../lib/ai-analyzer";

const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/heic"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid image format. Accepted: jpg, png, webp, heic"));
    }
  },
});

const router: IRouter = Router();

function formatScanResult(scan: typeof scansTable.$inferSelect) {
  return {
    id: scan.id,
    userId: scan.userId,
    imagePath: `/api/uploads/${path.basename(scan.imagePath)}`,
    overallScore: scan.overallScore,
    scores: {
      fit: { score: scan.fitScore ?? 0, detail: scan.fitDetail ?? "" },
      color: { score: scan.colorScore ?? 0, detail: scan.colorDetail ?? "" },
      styleCoherence: { score: scan.coherenceScore ?? 0, detail: scan.coherenceDetail ?? "" },
      trendAlignment: { score: scan.trendScore ?? 0, detail: scan.trendDetail ?? "" },
      signatureFactor: { score: scan.signatureScore ?? 0, detail: scan.signatureDetail ?? "" },
    },
    styleArchetype: scan.styleArchetype ?? "",
    archetypeDescription: scan.archetypeDescription ?? "",
    vibeTags: (scan.vibeTags as string[]) ?? [],
    bestElement: scan.bestElement ?? "",
    weakestElement: scan.weakestElement ?? "",
    occasionMatch: {
      casualHangout: (scan.occasionMatch as Record<string, number>)?.casual_hangout ?? 0,
      dateNight: (scan.occasionMatch as Record<string, number>)?.date_night ?? 0,
      workOffice: (scan.occasionMatch as Record<string, number>)?.work_office ?? 0,
      formalEvent: (scan.occasionMatch as Record<string, number>)?.formal_event ?? 0,
      streetwearFlex: (scan.occasionMatch as Record<string, number>)?.streetwear_flex ?? 0,
    },
    upgrades: ((scan.upgrades as Array<Record<string, unknown>>) ?? []).map((u) => ({
      swap: (u.swap as string) ?? "",
      with: (u.with as string) ?? "",
      predictedScoreIncrease: (u.predicted_score_increase as number) ?? (u.predictedScoreIncrease as number) ?? 0,
      searchQuery: (u.search_query as string) ?? (u.searchQuery as string) ?? "",
      priceRange: (u.price_range as string) ?? (u.priceRange as string) ?? "",
    })),
    similarQueries: (scan.similarQueries as string[]) ?? [],
    colorPalette: (scan.colorPalette as string[]) ?? [],
    season: scan.season ?? "",
    celebrityMatch: {
      name: (scan.celebrityMatch as Record<string, unknown>)?.name as string ?? "",
      matchPercentage: (scan.celebrityMatch as Record<string, unknown>)?.match_percentage as number ?? (scan.celebrityMatch as Record<string, unknown>)?.matchPercentage as number ?? 0,
      description: (scan.celebrityMatch as Record<string, unknown>)?.description as string ?? "",
    },
    genderDetected: scan.genderDetected ?? "",
    createdAt: scan.createdAt.toISOString(),
  };
}

router.post("/scan", authMiddleware, upload.single("image"), async (req, res): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: "Image is required" });
    return;
  }

  const userId = req.user!.userId;
  const demoMode = req.headers["x-demo-mode"] === "true";

  if (!demoMode) {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (user && !user.isPremium) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const [scanCount] = await db
        .select({ count: count() })
        .from(scansTable)
        .where(
          and(
            eq(scansTable.userId, userId),
            sql`${scansTable.createdAt} >= ${today.toISOString()}`
          )
        );

      if (scanCount && scanCount.count >= 3) {
        res.status(429).json({ error: "Daily scan limit reached. Upgrade to DRIP. PRO for unlimited scans." });
        return;
      }
    }
  }

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
  const filepath = path.join(UPLOADS_DIR, filename);

  if (demoMode && (!req.file.buffer || req.file.buffer.length === 0)) {
    const placeholderBuffer = Buffer.alloc(100, 0);
    fs.writeFileSync(filepath, placeholderBuffer);
  } else {
    await sharp(req.file.buffer)
      .resize(1200, 1600, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toFile(filepath);
  }

  try {
    const analysis = await analyzeOutfit(filepath, demoMode);

    const [scan] = await db
      .insert(scansTable)
      .values({
        userId,
        imagePath: filepath,
        overallScore: analysis.overall_score,
        fitScore: analysis.scores.fit.score,
        fitDetail: analysis.scores.fit.detail,
        colorScore: analysis.scores.color.score,
        colorDetail: analysis.scores.color.detail,
        coherenceScore: analysis.scores.style_coherence.score,
        coherenceDetail: analysis.scores.style_coherence.detail,
        trendScore: analysis.scores.trend_alignment.score,
        trendDetail: analysis.scores.trend_alignment.detail,
        signatureScore: analysis.scores.signature_factor.score,
        signatureDetail: analysis.scores.signature_factor.detail,
        styleArchetype: analysis.style_archetype,
        archetypeDescription: analysis.style_archetype_description,
        vibeTags: analysis.vibe_tags,
        bestElement: analysis.best_element,
        weakestElement: analysis.weakest_element,
        occasionMatch: analysis.occasion_match,
        upgrades: analysis.upgrades,
        similarQueries: analysis.similar_style_search_queries,
        colorPalette: analysis.color_palette_detected,
        season: analysis.season_alignment,
        celebrityMatch: analysis.celebrity_style_match,
        genderDetected: analysis.gender_detected,
        fullAnalysis: analysis,
      })
      .returning();

    const curatedMatches = await db
      .select()
      .from(curatedOutfitsTable)
      .where(eq(curatedOutfitsTable.styleArchetype, analysis.style_archetype))
      .limit(6);

    if (curatedMatches.length > 0) {
      await db.insert(similarOutfitsTable).values(
        curatedMatches.map((c) => ({
          scanId: scan.id,
          imageUrl: c.imageUrl,
          sourceUrl: c.sourceCredit,
          title: c.styleArchetype,
          styleTag: c.styleArchetype,
        }))
      );
    }

    const newTotal = await db
      .select({ count: count() })
      .from(scansTable)
      .where(eq(scansTable.userId, userId));

    const allScores = await db
      .select({ score: scansTable.overallScore })
      .from(scansTable)
      .where(eq(scansTable.userId, userId));

    const avgScore = allScores.reduce((sum, s) => sum + s.score, 0) / allScores.length;
    const highestScore = Math.max(...allScores.map((s) => s.score));

    await db
      .update(usersTable)
      .set({
        totalScans: newTotal[0].count,
        avgScore: Math.round(avgScore * 10) / 10,
        highestScore: Math.round(highestScore * 10) / 10,
      })
      .where(eq(usersTable.id, userId));

    res.status(201).json(formatScanResult(scan));
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.includes("No outfit detected") || err.message?.includes("no_outfit_detected")) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw error;
  }
});

router.get("/scan/history", authMiddleware, async (req, res): Promise<void> => {
  const userId = req.user!.userId;
  const page = parseInt(String(req.query.page ?? "1"), 10);
  const limit = Math.min(parseInt(String(req.query.limit ?? "10"), 10), 50);
  const sortParam = String(req.query.sort ?? "date_desc");
  const offset = (page - 1) * limit;

  let orderBy;
  switch (sortParam) {
    case "date_asc":
      orderBy = asc(scansTable.createdAt);
      break;
    case "score_desc":
      orderBy = desc(scansTable.overallScore);
      break;
    case "score_asc":
      orderBy = asc(scansTable.overallScore);
      break;
    default:
      orderBy = desc(scansTable.createdAt);
  }

  const [totalResult] = await db
    .select({ count: count() })
    .from(scansTable)
    .where(eq(scansTable.userId, userId));

  const scans = await db
    .select({
      id: scansTable.id,
      imagePath: scansTable.imagePath,
      overallScore: scansTable.overallScore,
      styleArchetype: scansTable.styleArchetype,
      createdAt: scansTable.createdAt,
    })
    .from(scansTable)
    .where(eq(scansTable.userId, userId))
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  const allScores = await db
    .select({ score: scansTable.overallScore, createdAt: scansTable.createdAt })
    .from(scansTable)
    .where(eq(scansTable.userId, userId))
    .orderBy(desc(scansTable.overallScore));

  const total = totalResult.count;
  const avgScore = allScores.length > 0
    ? Math.round((allScores.reduce((sum, s) => sum + s.score, 0) / allScores.length) * 10) / 10
    : 0;
  const highestScore = allScores.length > 0 ? allScores[0].score : 0;
  const highestScoreDate = allScores.length > 0 ? allScores[0].createdAt.toISOString() : null;

  res.json({
    scans: scans.map((s) => ({
      id: s.id,
      imagePath: `/api/uploads/${path.basename(s.imagePath)}`,
      overallScore: s.overallScore,
      styleArchetype: s.styleArchetype ?? "",
      createdAt: s.createdAt.toISOString(),
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
    stats: {
      totalScans: total,
      avgScore,
      highestScore,
      highestScoreDate,
    },
  });
});

router.get("/scan/:id", authMiddleware, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid scan ID" });
    return;
  }

  const [scan] = await db
    .select()
    .from(scansTable)
    .where(eq(scansTable.id, id));

  if (!scan) {
    res.status(404).json({ error: "Scan not found" });
    return;
  }

  if (scan.userId !== req.user!.userId) {
    res.status(404).json({ error: "Scan not found" });
    return;
  }

  res.json(formatScanResult(scan));
});

export default router;
