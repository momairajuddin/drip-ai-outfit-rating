import { pgTable, text, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const curatedOutfitsTable = pgTable("curated_outfits", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  styleArchetype: text("style_archetype").notNull(),
  gender: text("gender"),
  season: text("season"),
  tags: jsonb("tags").$type<string[]>(),
  sourceCredit: text("source_credit"),
});

export const insertCuratedOutfitSchema = createInsertSchema(curatedOutfitsTable).omit({ id: true });
export type InsertCuratedOutfit = z.infer<typeof insertCuratedOutfitSchema>;
export type CuratedOutfit = typeof curatedOutfitsTable.$inferSelect;
