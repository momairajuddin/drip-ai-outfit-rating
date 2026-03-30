import { pgTable, text, serial, integer, real, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const scansTable = pgTable("scans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id).notNull(),
  imagePath: text("image_path").notNull(),
  overallScore: real("overall_score").notNull(),
  fitScore: real("fit_score"),
  fitDetail: text("fit_detail"),
  colorScore: real("color_score"),
  colorDetail: text("color_detail"),
  coherenceScore: real("coherence_score"),
  coherenceDetail: text("coherence_detail"),
  trendScore: real("trend_score"),
  trendDetail: text("trend_detail"),
  signatureScore: real("signature_score"),
  signatureDetail: text("signature_detail"),
  styleArchetype: text("style_archetype"),
  archetypeDescription: text("archetype_description"),
  vibeTags: jsonb("vibe_tags").$type<string[]>(),
  bestElement: text("best_element"),
  weakestElement: text("weakest_element"),
  occasionMatch: jsonb("occasion_match").$type<Record<string, number>>(),
  upgrades: jsonb("upgrades").$type<Array<{
    swap: string;
    with: string;
    predictedScoreIncrease: number;
    searchQuery: string;
    priceRange: string;
  }>>(),
  similarQueries: jsonb("similar_queries").$type<string[]>(),
  colorPalette: jsonb("color_palette").$type<string[]>(),
  season: text("season"),
  celebrityMatch: jsonb("celebrity_match").$type<{
    name: string;
    matchPercentage: number;
    description: string;
  }>(),
  genderDetected: text("gender_detected"),
  fullAnalysis: jsonb("full_analysis"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertScanSchema = createInsertSchema(scansTable).omit({ id: true, createdAt: true });
export type InsertScan = z.infer<typeof insertScanSchema>;
export type Scan = typeof scansTable.$inferSelect;
