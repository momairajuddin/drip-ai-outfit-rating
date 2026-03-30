import { db, usersTable, scansTable, curatedOutfitsTable } from "@workspace/db";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding DRIP. database...");

  const passwordHash = await bcrypt.hash("demo123", 10);
  const [demoUser] = await db
    .insert(usersTable)
    .values({
      email: "demo@drip.app",
      username: "dripmaster",
      passwordHash,
      isPremium: true,
      totalScans: 8,
      highestScore: 9.1,
      avgScore: 7.8,
    })
    .onConflictDoNothing()
    .returning();

  if (!demoUser) {
    console.log("Demo user already exists, skipping...");
    return;
  }

  const userId = demoUser.id;

  const demoScans = [
    {
      userId,
      imagePath: "/uploads/demo-1.jpg",
      overallScore: 9.1,
      fitScore: 9, fitDetail: "Precision tailoring that creates a flawless silhouette.",
      colorScore: 9, colorDetail: "Masterful tonal palette with subtle texture variation.",
      coherenceScore: 10, coherenceDetail: "Complete vision — every piece communicates the same aesthetic.",
      trendScore: 9, trendDetail: "Defines trends rather than follows them.",
      signatureScore: 9, signatureDetail: "Instantly recognizable personal style.",
      styleArchetype: "Old Money Elegance",
      archetypeDescription: "Timeless sophistication that signals taste over trend.",
      vibeTags: ["timeless", "elegant", "refined"],
      bestElement: "The fabric quality is visible even in a photo.",
      weakestElement: "A pocket square could add a final layer of depth.",
      occasionMatch: { casual_hangout: 6, date_night: 10, work_office: 9, formal_event: 9, streetwear_flex: 2 },
      upgrades: [{ swap: "No pocket detail", with: "Silk pocket square", predicted_score_increase: 0.2, search_query: "silk pocket square minimal", price_range: "$20-$60" }],
      similarQueries: ["old money style 2026", "quiet luxury menswear"],
      colorPalette: ["#2F2F2F", "#D4C5A9", "#8B7355"],
      season: "fall/winter",
      celebrityMatch: { name: "Timothée Chalamet", match_percentage: 85, description: "Classic tailoring meets modern youth" },
      genderDetected: "male",
      fullAnalysis: {},
    },
    {
      userId,
      imagePath: "/uploads/demo-2.jpg",
      overallScore: 8.4,
      fitScore: 9, fitDetail: "Oversized top with slim bottoms — perfect proportional play.",
      colorScore: 8, colorDetail: "Monochromatic tonal dressing done right.",
      coherenceScore: 8, coherenceDetail: "Every piece contributes to a unified vision.",
      trendScore: 8, trendDetail: "Oversized-on-slim is having a major moment.",
      signatureScore: 8, signatureDetail: "The proportional play is distinctive enough to be memorable.",
      styleArchetype: "Modern Minimalist",
      archetypeDescription: "Clean lines, considered proportions, fashion as architecture.",
      vibeTags: ["architectural", "clean", "contemporary"],
      bestElement: "Proportional contrast creates visual interest without pattern.",
      weakestElement: "One accessory could add personality without breaking the code.",
      occasionMatch: { casual_hangout: 9, date_night: 8, work_office: 7, formal_event: 4, streetwear_flex: 6 },
      upgrades: [{ swap: "No bag", with: "Structured tote in contrasting material", predicted_score_increase: 0.4, search_query: "minimal structured tote bag", price_range: "$60-$150" }],
      similarQueries: ["modern minimalist outfit editorial", "oversized fit styling 2026"],
      colorPalette: ["#1A1A1A", "#333333", "#F5F5F0"],
      season: "all-season",
      celebrityMatch: { name: "Zendaya", match_percentage: 68, description: "Bold silhouette play and confidence" },
      genderDetected: "female",
      fullAnalysis: {},
    },
    {
      userId,
      imagePath: "/uploads/demo-3.jpg",
      overallScore: 7.8,
      fitScore: 8, fitDetail: "Clean, well-proportioned fit with good shoulder alignment.",
      colorScore: 7, colorDetail: "Neutral palette could use a pop of intentional contrast.",
      coherenceScore: 8, coherenceDetail: "Casual sophistication with an urban edge.",
      trendScore: 8, trendDetail: "Right on track with the quiet luxury movement.",
      signatureScore: 7, signatureDetail: "Solid but not yet distinctive — add a statement piece.",
      styleArchetype: "Quiet Luxury",
      archetypeDescription: "Understated elegance with premium basics.",
      vibeTags: ["refined", "understated", "polished"],
      bestElement: "Layering creates visual depth without bulk.",
      weakestElement: "Footwear feels like an afterthought.",
      occasionMatch: { casual_hangout: 8, date_night: 7, work_office: 9, formal_event: 5, streetwear_flex: 4 },
      upgrades: [{ swap: "Current footwear", with: "Suede loafers or clean white leather sneakers", predicted_score_increase: 0.5, search_query: "suede loafers men minimal", price_range: "$80-$180" }],
      similarQueries: ["quiet luxury outfit 2026", "old money aesthetic casual"],
      colorPalette: ["#2C3E50", "#ECF0F1", "#7F8C8D"],
      season: "fall/winter",
      celebrityMatch: { name: "Jacob Elordi", match_percentage: 72, description: "Effortless tall-frame styling" },
      genderDetected: "male",
      fullAnalysis: {},
    },
    {
      userId,
      imagePath: "/uploads/demo-4.jpg",
      overallScore: 8.8,
      fitScore: 9, fitDetail: "Impeccable tailoring — every piece sits exactly where it should.",
      colorScore: 9, colorDetail: "Sophisticated color story with intentional contrast.",
      coherenceScore: 9, coherenceDetail: "Complete fashion statement from head to toe.",
      trendScore: 8, trendDetail: "Timeless with contemporary touches.",
      signatureScore: 9, signatureDetail: "Unmistakably personal — this outfit has a voice.",
      styleArchetype: "Editorial Chic",
      archetypeDescription: "Fashion-forward styling that belongs in a magazine.",
      vibeTags: ["editorial", "bold", "sophisticated"],
      bestElement: "The statement piece anchors the entire outfit.",
      weakestElement: "The bag could be more intentional.",
      occasionMatch: { casual_hangout: 6, date_night: 9, work_office: 7, formal_event: 8, streetwear_flex: 5 },
      upgrades: [{ swap: "Current bag", with: "Architectural clutch or structured mini bag", predicted_score_increase: 0.3, search_query: "architectural clutch bag designer", price_range: "$100-$300" }],
      similarQueries: ["editorial chic street style 2026", "fashion week outfit inspiration"],
      colorPalette: ["#000000", "#8B0000", "#F5F5DC"],
      season: "fall/winter",
      celebrityMatch: { name: "Hailey Bieber", match_percentage: 81, description: "High fashion feels effortless and wearable" },
      genderDetected: "female",
      fullAnalysis: {},
    },
    {
      userId,
      imagePath: "/uploads/demo-5.jpg",
      overallScore: 7.2,
      fitScore: 7, fitDetail: "Intentionally oversized — reads as a style choice.",
      colorScore: 8, colorDetail: "Strong color blocking with confident choices.",
      coherenceScore: 7, coherenceDetail: "Streetwear DNA is clear but mixing too many loud elements.",
      trendScore: 8, trendDetail: "Y2K revival and gorpcore overlap — culturally relevant.",
      signatureScore: 7, signatureDetail: "Has personality but needs editing.",
      styleArchetype: "Streetwear Forward",
      archetypeDescription: "Urban culture-influenced fashion with graphic elements.",
      vibeTags: ["bold", "urban", "expressive"],
      bestElement: "The sneaker game is strong — clearly a considered choice.",
      weakestElement: "Too many competing focal points. Pick two.",
      occasionMatch: { casual_hangout: 9, date_night: 5, work_office: 2, formal_event: 1, streetwear_flex: 10 },
      upgrades: [{ swap: "Busy graphic tee", with: "Clean heavyweight blank tee in rich color", predicted_score_increase: 0.6, search_query: "heavyweight blank tee oversized", price_range: "$30-$70" }],
      similarQueries: ["streetwear outfit 2026", "urban fashion editorial"],
      colorPalette: ["#1E90FF", "#000000", "#FF4500"],
      season: "spring/summer",
      celebrityMatch: { name: "A$AP Rocky", match_percentage: 65, description: "Streetwear confidence and visual risks" },
      genderDetected: "male",
      fullAnalysis: {},
    },
    {
      userId,
      imagePath: "/uploads/demo-6.jpg",
      overallScore: 6.5,
      fitScore: 7, fitDetail: "Mid-section could use tailoring — slightly boxy.",
      colorScore: 6, colorDetail: "Colors lack intentional harmony — assembled not styled.",
      coherenceScore: 7, coherenceDetail: "Mixing athletic and casual creates identity crisis.",
      trendScore: 7, trendDetail: "Athleisure needs more polish to feel current.",
      signatureScore: 6, signatureDetail: "Could be anyone's outfit — needs a personal touch.",
      styleArchetype: "Athleisure Casual",
      archetypeDescription: "Comfort-first dressing with sporty influences.",
      vibeTags: ["sporty", "casual", "comfortable"],
      bestElement: "The sneaker choice shows awareness — clean and current.",
      weakestElement: "Top half is too safe — swap for structured polo or knit.",
      occasionMatch: { casual_hangout: 9, date_night: 4, work_office: 3, formal_event: 1, streetwear_flex: 7 },
      upgrades: [{ swap: "Basic tee", with: "Textured knit polo or structured henley", predicted_score_increase: 0.8, search_query: "textured knit polo men", price_range: "$40-$90" }],
      similarQueries: ["elevated athleisure men 2026", "sporty casual outfit upgrade"],
      colorPalette: ["#4A4A4A", "#808080", "#FFFFFF"],
      season: "spring/summer",
      celebrityMatch: { name: "Chris Hemsworth", match_percentage: 58, description: "Athletic build casual styling" },
      genderDetected: "male",
      fullAnalysis: {},
    },
    {
      userId,
      imagePath: "/uploads/demo-7.jpg",
      overallScore: 6.2,
      fitScore: 6, fitDetail: "Proportions feel off — the silhouette needs adjustment.",
      colorScore: 6, colorDetail: "Too many neutrals without any anchor color.",
      coherenceScore: 7, coherenceDetail: "The idea is there but execution needs refinement.",
      trendScore: 6, trendDetail: "Feels slightly dated — needs a 2026 update.",
      signatureScore: 6, signatureDetail: "Plays it safe — nothing wrong but nothing memorable.",
      styleArchetype: "Basic Casual",
      archetypeDescription: "Default dressing — functional but uninspired.",
      vibeTags: ["safe", "neutral", "basic"],
      bestElement: "Color palette is inoffensive and easy to build on.",
      weakestElement: "Everything is mid — needs one intentional upgrade to anchor the look.",
      occasionMatch: { casual_hangout: 8, date_night: 3, work_office: 5, formal_event: 2, streetwear_flex: 3 },
      upgrades: [{ swap: "Everything basic", with: "Start with one quality piece — a good jacket or boots", predicted_score_increase: 1.0, search_query: "men essential jacket 2026", price_range: "$80-$200" }],
      similarQueries: ["men basic outfit upgrade", "casual wardrobe essentials 2026"],
      colorPalette: ["#696969", "#A9A9A9", "#D3D3D3"],
      season: "all-season",
      celebrityMatch: { name: "Paul Mescal", match_percentage: 52, description: "Understated everyday dressing" },
      genderDetected: "male",
      fullAnalysis: {},
    },
    {
      userId,
      imagePath: "/uploads/demo-8.jpg",
      overallScore: 8.0,
      fitScore: 8, fitDetail: "Well-fitted with intentional flow — the drape is deliberate.",
      colorScore: 8, colorDetail: "Earth tones with warm undertones create a cohesive palette.",
      coherenceScore: 8, coherenceDetail: "Bohemian elements mixed with structured pieces — artful balance.",
      trendScore: 8, trendDetail: "Boho-chic revival is in full swing for 2026.",
      signatureScore: 7, signatureDetail: "Has character — the accessories tell a story.",
      styleArchetype: "Bohemian Chic",
      archetypeDescription: "Free-spirited elegance with artisanal details and natural textures.",
      vibeTags: ["earthy", "free-spirited", "textured"],
      bestElement: "The layered accessories create visual storytelling.",
      weakestElement: "Could benefit from one more structured element to anchor the flow.",
      occasionMatch: { casual_hangout: 9, date_night: 8, work_office: 4, formal_event: 3, streetwear_flex: 5 },
      upgrades: [{ swap: "Unstructured bag", with: "Woven leather crossbody", predicted_score_increase: 0.4, search_query: "woven leather crossbody boho", price_range: "$60-$150" }],
      similarQueries: ["bohemian chic outfit 2026", "boho-chic editorial fashion"],
      colorPalette: ["#8B7355", "#D2B48C", "#556B2F"],
      season: "spring/summer",
      celebrityMatch: { name: "Florence Pugh", match_percentage: 74, description: "Effortless boho with strong personal identity" },
      genderDetected: "female",
      fullAnalysis: {},
    },
  ];

  for (const scan of demoScans) {
    await db.insert(scansTable).values(scan);
  }

  const curatedOutfits = [
    { imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", styleArchetype: "Quiet Luxury", gender: "male", season: "fall/winter", tags: ["casual", "refined", "understated"], sourceCredit: "Unsplash" },
    { imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400", styleArchetype: "Modern Minimalist", gender: "female", season: "all-season", tags: ["minimal", "clean", "contemporary"], sourceCredit: "Unsplash" },
    { imageUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400", styleArchetype: "Streetwear Forward", gender: "male", season: "spring/summer", tags: ["streetwear", "bold", "urban"], sourceCredit: "Unsplash" },
    { imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400", styleArchetype: "Editorial Chic", gender: "female", season: "fall/winter", tags: ["editorial", "fashion-forward", "bold"], sourceCredit: "Unsplash" },
    { imageUrl: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400", styleArchetype: "Old Money Elegance", gender: "male", season: "fall/winter", tags: ["elegant", "timeless", "classic"], sourceCredit: "Unsplash" },
    { imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400", styleArchetype: "Bohemian Chic", gender: "female", season: "spring/summer", tags: ["boho", "free-spirited", "earthy"], sourceCredit: "Unsplash" },
    { imageUrl: "https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=400", styleArchetype: "Athleisure Casual", gender: "male", season: "spring/summer", tags: ["sporty", "casual", "comfortable"], sourceCredit: "Unsplash" },
    { imageUrl: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400", styleArchetype: "Quiet Luxury", gender: "female", season: "fall/winter", tags: ["quiet luxury", "understated", "premium"], sourceCredit: "Unsplash" },
    { imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", styleArchetype: "Modern Minimalist", gender: "male", season: "all-season", tags: ["minimal", "clean", "basic"], sourceCredit: "Unsplash" },
    { imageUrl: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400", styleArchetype: "Editorial Chic", gender: "female", season: "spring/summer", tags: ["editorial", "sophisticated", "fashion"], sourceCredit: "Unsplash" },
    { imageUrl: "https://images.unsplash.com/photo-1550246140-29f40b909e5a?w=400", styleArchetype: "Streetwear Forward", gender: "male", season: "all-season", tags: ["streetwear", "expressive", "hype"], sourceCredit: "Unsplash" },
    { imageUrl: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=400", styleArchetype: "Old Money Elegance", gender: "female", season: "fall/winter", tags: ["elegant", "timeless", "refined"], sourceCredit: "Unsplash" },
    { imageUrl: "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=400", styleArchetype: "Quiet Luxury", gender: "male", season: "spring/summer", tags: ["refined", "polished", "smart casual"], sourceCredit: "Unsplash" },
    { imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400", styleArchetype: "Bohemian Chic", gender: "female", season: "spring/summer", tags: ["boho", "artistic", "layered"], sourceCredit: "Unsplash" },
    { imageUrl: "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=400", styleArchetype: "Old Money Elegance", gender: "male", season: "all-season", tags: ["classic", "tailored", "sophisticated"], sourceCredit: "Unsplash" },
  ];

  for (const outfit of curatedOutfits) {
    await db.insert(curatedOutfitsTable).values(outfit);
  }

  console.log(`Seeded: ${demoScans.length} demo scans, ${curatedOutfits.length} curated outfits`);
  console.log("Done!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
