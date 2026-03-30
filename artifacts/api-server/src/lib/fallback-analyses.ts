export interface FallbackAnalysis {
  overall_score: number;
  scores: {
    fit: { score: number; detail: string };
    color: { score: number; detail: string };
    style_coherence: { score: number; detail: string };
    trend_alignment: { score: number; detail: string };
    signature_factor: { score: number; detail: string };
  };
  style_archetype: string;
  style_archetype_description: string;
  vibe_tags: string[];
  best_element: string;
  weakest_element: string;
  occasion_match: {
    casual_hangout: number;
    date_night: number;
    work_office: number;
    formal_event: number;
    streetwear_flex: number;
  };
  upgrades: Array<{
    swap: string;
    with: string;
    predicted_score_increase: number;
    search_query: string;
    price_range: string;
  }>;
  similar_style_search_queries: string[];
  color_palette_detected: string[];
  season_alignment: string;
  celebrity_style_match: {
    name: string;
    match_percentage: number;
    description: string;
  };
  gender_detected: string;
}

export const fallbackAnalyses: FallbackAnalysis[] = [
  {
    overall_score: 7.8,
    scores: {
      fit: { score: 8, detail: "Clean, well-proportioned fit with good shoulder alignment. The silhouette flatters without being too tight or too loose." },
      color: { score: 7, detail: "Neutral palette works well together but could use a pop of intentional contrast — everything blends a bit too safely." },
      style_coherence: { score: 8, detail: "The pieces tell a consistent story — casual sophistication with an urban edge. Nothing feels out of place." },
      trend_alignment: { score: 8, detail: "Right on track with the quiet luxury movement. Understated pieces that signal awareness without trying too hard." },
      signature_factor: { score: 7, detail: "Solid but not yet distinctive — add one statement piece (watch, unique bag, or unconventional layering) to own it." },
    },
    style_archetype: "Quiet Luxury",
    style_archetype_description: "Understated elegance with premium basics — the kind of outfit that whispers wealth rather than shouting it.",
    vibe_tags: ["refined", "understated", "polished"],
    best_element: "The layering creates visual depth without bulk — each piece adds to the silhouette rather than competing with it.",
    weakest_element: "Footwear feels like an afterthought — a more intentional shoe choice would tie the whole look together.",
    occasion_match: { casual_hangout: 8, date_night: 7, work_office: 9, formal_event: 5, streetwear_flex: 4 },
    upgrades: [
      { swap: "Current footwear", with: "Suede loafers or clean white leather sneakers", predicted_score_increase: 0.5, search_query: "suede loafers men minimal", price_range: "$80-$180" },
      { swap: "No accessories", with: "Minimal silver watch or leather bracelet", predicted_score_increase: 0.4, search_query: "minimal silver watch", price_range: "$60-$200" },
    ],
    similar_style_search_queries: ["quiet luxury outfit 2026", "old money aesthetic casual", "understated menswear editorial"],
    color_palette_detected: ["#2C3E50", "#ECF0F1", "#7F8C8D"],
    season_alignment: "fall/winter",
    celebrity_style_match: { name: "Jacob Elordi", match_percentage: 72, description: "Shares the effortless tall-frame styling with relaxed tailoring" },
    gender_detected: "male",
  },
  {
    overall_score: 8.2,
    scores: {
      fit: { score: 9, detail: "Excellent proportions — the oversized top balanced with slimmer bottoms creates a modern, intentional silhouette." },
      color: { score: 8, detail: "Tonal dressing done right. The monochromatic approach feels editorial and intentional." },
      style_coherence: { score: 8, detail: "Every piece contributes to a unified vision — this outfit has a clear point of view." },
      trend_alignment: { score: 8, detail: "Oversized-on-slim is having a major moment, and this nails the proportional balance." },
      signature_factor: { score: 8, detail: "The proportional play is distinctive enough to be memorable — this person understands their body and dresses for it." },
    },
    style_archetype: "Modern Minimalist",
    style_archetype_description: "Clean lines, considered proportions, and a restrained palette — fashion as architecture.",
    vibe_tags: ["architectural", "clean", "contemporary"],
    best_element: "The proportional contrast between oversized and fitted creates visual interest without needing pattern or color.",
    weakest_element: "Could push the accessory game slightly — one carefully chosen piece would add personality without breaking the minimal code.",
    occasion_match: { casual_hangout: 9, date_night: 8, work_office: 7, formal_event: 4, streetwear_flex: 6 },
    upgrades: [
      { swap: "Plain bag/no bag", with: "Structured tote in contrasting material", predicted_score_increase: 0.4, search_query: "minimal structured tote bag", price_range: "$60-$150" },
      { swap: "Basic belt or none", with: "Woven leather belt in a tonal shade", predicted_score_increase: 0.3, search_query: "woven leather belt minimal", price_range: "$40-$100" },
    ],
    similar_style_search_queries: ["modern minimalist outfit editorial", "oversized fit styling 2026", "monochromatic outfit inspiration"],
    color_palette_detected: ["#1A1A1A", "#333333", "#F5F5F0"],
    season_alignment: "all-season",
    celebrity_style_match: { name: "Zendaya", match_percentage: 68, description: "Shares the bold silhouette play and confidence in architectural fashion" },
    gender_detected: "female",
  },
  {
    overall_score: 6.8,
    scores: {
      fit: { score: 7, detail: "Decent fit overall but the mid-section could use some tailoring — slightly boxy where it should be defined." },
      color: { score: 6, detail: "The colors work individually but lack intentional harmony — feels assembled rather than styled." },
      style_coherence: { score: 7, detail: "Close to cohesive but mixing athletic and casual elements creates a slight identity crisis." },
      trend_alignment: { score: 7, detail: "Athleisure is still relevant but needs more polish to feel current rather than default." },
      signature_factor: { score: 6, detail: "This could be anyone's outfit — needs a personal touch to become YOUR outfit." },
    },
    style_archetype: "Athleisure Casual",
    style_archetype_description: "Comfort-first dressing with sporty influences — the challenge is elevating it beyond 'just got off the couch.'",
    vibe_tags: ["sporty", "casual", "comfortable"],
    best_element: "The sneaker choice shows awareness — clean and current, they ground the look with intention.",
    weakest_element: "The top half feels too safe and generic — swap a basic tee for a structured polo or textured knit to elevate instantly.",
    occasion_match: { casual_hangout: 9, date_night: 4, work_office: 3, formal_event: 1, streetwear_flex: 7 },
    upgrades: [
      { swap: "Basic graphic/plain tee", with: "Textured knit polo or structured henley", predicted_score_increase: 0.8, search_query: "textured knit polo men", price_range: "$40-$90" },
      { swap: "Standard joggers", with: "Tapered cargo pants or tech trousers", predicted_score_increase: 0.6, search_query: "tapered tech trousers men", price_range: "$50-$120" },
      { swap: "No layering", with: "Lightweight zip-up jacket in complementary tone", predicted_score_increase: 0.5, search_query: "lightweight zip jacket minimal", price_range: "$60-$140" },
    ],
    similar_style_search_queries: ["elevated athleisure men 2026", "sporty casual outfit upgrade", "athleisure to smart casual transition"],
    color_palette_detected: ["#4A4A4A", "#808080", "#FFFFFF"],
    season_alignment: "spring/summer",
    celebrity_style_match: { name: "Chris Hemsworth", match_percentage: 58, description: "Athletic build casual styling with a focus on comfort" },
    gender_detected: "male",
  },
  {
    overall_score: 8.8,
    scores: {
      fit: { score: 9, detail: "Impeccable tailoring — every piece sits exactly where it should. This was clearly fitted, not just bought off the rack." },
      color: { score: 9, detail: "Sophisticated color story with intentional contrast. The palette reads expensive and editorial." },
      style_coherence: { score: 9, detail: "Complete fashion statement from head to toe — every accessory and layer is deliberate and harmonious." },
      trend_alignment: { score: 8, detail: "Timeless with contemporary touches — this transcends trends while still feeling fresh." },
      signature_factor: { score: 9, detail: "Unmistakably personal — this outfit has a voice. You'd remember seeing this person walk by." },
    },
    style_archetype: "Editorial Chic",
    style_archetype_description: "Fashion-forward styling that belongs in a magazine — bold choices executed with precision and taste.",
    vibe_tags: ["editorial", "bold", "sophisticated"],
    best_element: "The statement piece creates an anchor for the entire outfit — everything else orbits around it perfectly.",
    weakest_element: "Minor detail: the bag could be more intentional — it's functional but doesn't elevate the look further.",
    occasion_match: { casual_hangout: 6, date_night: 9, work_office: 7, formal_event: 8, streetwear_flex: 5 },
    upgrades: [
      { swap: "Current bag", with: "Architectural clutch or structured mini bag", predicted_score_increase: 0.3, search_query: "architectural clutch bag designer", price_range: "$100-$300" },
      { swap: "Standard sunglasses", with: "Oversized acetate frames in tortoise or black", predicted_score_increase: 0.2, search_query: "oversized acetate sunglasses", price_range: "$80-$250" },
    ],
    similar_style_search_queries: ["editorial chic street style 2026", "fashion week outfit inspiration", "high fashion everyday styling"],
    color_palette_detected: ["#000000", "#8B0000", "#F5F5DC"],
    season_alignment: "fall/winter",
    celebrity_style_match: { name: "Hailey Bieber", match_percentage: 81, description: "Shares the ability to make high fashion feel effortless and wearable" },
    gender_detected: "female",
  },
  {
    overall_score: 7.2,
    scores: {
      fit: { score: 7, detail: "Intentionally oversized which reads as a style choice, but the proportions could be more considered." },
      color: { score: 8, detail: "Strong color blocking with confident choices — the palette is bold without clashing." },
      style_coherence: { score: 7, detail: "The streetwear DNA is clear but mixing too many loud elements dilutes the impact." },
      trend_alignment: { score: 8, detail: "Tapped into the Y2K revival and gorpcore overlap — culturally relevant and self-aware." },
      signature_factor: { score: 7, detail: "Has personality but needs editing — choose one hero piece and let everything else support it." },
    },
    style_archetype: "Streetwear Forward",
    style_archetype_description: "Urban culture-influenced fashion with graphic elements and bold proportions — the outfit is a statement.",
    vibe_tags: ["bold", "urban", "expressive"],
    best_element: "The sneaker game is strong — clearly a considered choice that anchors the outfit's street credibility.",
    weakest_element: "Too many competing focal points — the hat, graphic tee, and statement shoes all fight for attention. Pick two.",
    occasion_match: { casual_hangout: 9, date_night: 5, work_office: 2, formal_event: 1, streetwear_flex: 10 },
    upgrades: [
      { swap: "Busy graphic tee", with: "Clean heavyweight blank tee in a rich color", predicted_score_increase: 0.6, search_query: "heavyweight blank tee oversized", price_range: "$30-$70" },
      { swap: "Random accessories", with: "One signature chain or ring set", predicted_score_increase: 0.4, search_query: "silver chain necklace streetwear", price_range: "$40-$120" },
    ],
    similar_style_search_queries: ["streetwear outfit 2026", "urban fashion editorial", "sneakerhead outfit inspiration"],
    color_palette_detected: ["#1E90FF", "#000000", "#FF4500"],
    season_alignment: "spring/summer",
    celebrity_style_match: { name: "A$AP Rocky", match_percentage: 65, description: "Shares the streetwear confidence and willingness to take visual risks" },
    gender_detected: "male",
  },
  {
    overall_score: 9.1,
    scores: {
      fit: { score: 9, detail: "Precision tailoring that creates a flawless silhouette — every measurement is intentional and flattering." },
      color: { score: 9, detail: "Masterful tonal palette with subtle texture variation creating depth without noise." },
      style_coherence: { score: 10, detail: "This is a complete vision — from fabric choices to accessories, everything communicates the same aesthetic language." },
      trend_alignment: { score: 9, detail: "Defines trends rather than follows them — the kind of outfit that sets the bar for others." },
      signature_factor: { score: 9, detail: "Instantly recognizable personal style — this is someone who has found their fashion identity and perfected it." },
    },
    style_archetype: "Old Money Elegance",
    style_archetype_description: "Timeless sophistication that signals taste over trend — the kind of effortless elegance that can't be bought, only cultivated.",
    vibe_tags: ["timeless", "elegant", "refined"],
    best_element: "The fabric quality is visible even in a photo — the drape and texture of each piece screams investment dressing.",
    weakest_element: "Almost flawless — the only note is that a pocket square or subtle pattern mix could add a final layer of depth.",
    occasion_match: { casual_hangout: 6, date_night: 10, work_office: 9, formal_event: 9, streetwear_flex: 2 },
    upgrades: [
      { swap: "No pocket detail", with: "Silk pocket square in a complementary tone", predicted_score_increase: 0.2, search_query: "silk pocket square minimal", price_range: "$20-$60" },
      { swap: "Standard watch", with: "Vintage-style dress watch with leather strap", predicted_score_increase: 0.2, search_query: "vintage dress watch leather strap", price_range: "$150-$400" },
    ],
    similar_style_search_queries: ["old money style 2026", "quiet luxury menswear editorial", "timeless elegant outfit inspiration"],
    color_palette_detected: ["#2F2F2F", "#D4C5A9", "#8B7355"],
    season_alignment: "fall/winter",
    celebrity_style_match: { name: "Timothée Chalamet", match_percentage: 85, description: "Shares the ability to make classic tailoring feel youthful and modern" },
    gender_detected: "male",
  },
];

export function getRandomFallback(): FallbackAnalysis {
  return fallbackAnalyses[Math.floor(Math.random() * fallbackAnalyses.length)];
}

export function getDemoFallback(): FallbackAnalysis {
  return fallbackAnalyses[fallbackAnalyses.length - 1];
}
