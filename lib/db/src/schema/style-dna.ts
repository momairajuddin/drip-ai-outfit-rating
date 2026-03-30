import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { scansTable } from "./scans";

export const styleDnaTable = pgTable("style_dna", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id).unique().notNull(),
  dominantArchetype: text("dominant_archetype"),
  topColors: jsonb("top_colors").$type<string[]>(),
  avgScores: jsonb("avg_scores").$type<Record<string, number>>(),
  totalOutfitsScanned: integer("total_outfits_scanned").default(0).notNull(),
  bestOutfitId: integer("best_outfit_id").references(() => scansTable.id),
  worstOutfitId: integer("worst_outfit_id").references(() => scansTable.id),
  styleEvolution: jsonb("style_evolution").$type<Array<{
    archetype: string;
    date: string;
    score: number;
  }>>(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertStyleDnaSchema = createInsertSchema(styleDnaTable).omit({ id: true, updatedAt: true });
export type InsertStyleDna = z.infer<typeof insertStyleDnaSchema>;
export type StyleDna = typeof styleDnaTable.$inferSelect;
