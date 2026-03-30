import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { scansTable } from "./scans";

export const similarOutfitsTable = pgTable("similar_outfits", {
  id: serial("id").primaryKey(),
  scanId: integer("scan_id").references(() => scansTable.id).notNull(),
  imageUrl: text("image_url").notNull(),
  sourceUrl: text("source_url"),
  title: text("title"),
  styleTag: text("style_tag"),
});

export const insertSimilarOutfitSchema = createInsertSchema(similarOutfitsTable).omit({ id: true });
export type InsertSimilarOutfit = z.infer<typeof insertSimilarOutfitSchema>;
export type SimilarOutfit = typeof similarOutfitsTable.$inferSelect;
