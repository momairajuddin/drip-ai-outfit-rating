import { openai } from "@workspace/integrations-openai-ai-server";
import { logger } from "./logger";
import { getRandomFallback, getDemoFallback, type FallbackAnalysis } from "./fallback-analyses";
import fs from "fs";

const ANALYSIS_PROMPT = `You are DRIP., the world's most sophisticated AI fashion analyst. You combine the eye of a Vogue editor, the precision of a stylist, and the cultural awareness of a trend forecaster.

Analyze this outfit photo and return a comprehensive rating. Be specific, opinionated, and constructive — never generic. Reference actual fashion concepts, color theory, and current trends.

Return ONLY valid JSON — no markdown, no backticks, no explanation outside the JSON:

{
  "overall_score": 8.4,
  "scores": {
    "fit": {
      "score": 9,
      "detail": "Specific observation about how garments fit the body — proportions, tailoring, silhouette"
    },
    "color": {
      "score": 7,
      "detail": "Analysis of color palette, harmony, contrast, skin tone compatibility"
    },
    "style_coherence": {
      "score": 8,
      "detail": "How well the pieces work together as a unified look — does it tell a story?"
    },
    "trend_alignment": {
      "score": 9,
      "detail": "How current/relevant the outfit feels in 2026 fashion landscape"
    },
    "signature_factor": {
      "score": 7,
      "detail": "Does this outfit have personality? Is it memorable or forgettable?"
    }
  },
  "style_archetype": "Old Money Casual",
  "style_archetype_description": "1-2 sentence description of this archetype",
  "vibe_tags": ["effortless", "refined", "understated"],
  "best_element": "The oversized blazer creates a strong shoulder line that anchors the whole look",
  "weakest_element": "The brown shoes clash with the cool-toned palette — a tonal mismatch",
  "occasion_match": {
    "casual_hangout": 9,
    "date_night": 7,
    "work_office": 8,
    "formal_event": 5,
    "streetwear_flex": 6
  },
  "upgrades": [
    {
      "swap": "Replace brown leather shoes",
      "with": "White leather minimal sneakers or black chelsea boots",
      "predicted_score_increase": 0.7,
      "search_query": "white minimal leather sneakers men",
      "price_range": "$80-$150"
    },
    {
      "swap": "Add an accessory",
      "with": "Silver minimal watch or thin chain necklace",
      "predicted_score_increase": 0.4,
      "search_query": "minimal silver watch",
      "price_range": "$40-$120"
    }
  ],
  "similar_style_search_queries": [
    "old money casual men fall outfit",
    "blazer with relaxed trousers editorial",
    "quiet luxury menswear 2026"
  ],
  "color_palette_detected": ["#2C3E50", "#ECF0F1", "#8B4513"],
  "season_alignment": "fall/winter",
  "celebrity_style_match": {
    "name": "Jacob Elordi",
    "match_percentage": 78,
    "description": "Shares the tall, relaxed tailoring sensibility"
  },
  "gender_detected": "male"
}

RULES:
- Be brutally honest but never cruel. Think constructive fashion editor, not mean judge.
- Overall score should be an average weighted toward fit (25%), color (20%), style_coherence (25%), trend_alignment (15%), signature_factor (15%).
- Scores 9-10 should be RARE and genuinely earned. Most outfits are 5-8. Don't inflate.
- If the image is not a person wearing clothes (e.g., a landscape, food, object), return: {"error": "no_outfit_detected", "message": "I need a photo of you wearing an outfit to rate your drip."}
- Always provide at least 2 upgrade suggestions.
- similar_style_search_queries should be specific enough to find similar outfits on Google/Pinterest.
- Detect gender from the outfit to tailor advice appropriately. Use neutral language if ambiguous.`;

export async function analyzeOutfit(
  imagePath: string,
  demoMode: boolean = false
): Promise<FallbackAnalysis> {
  if (demoMode) {
    return getDemoFallback();
  }

  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");
    const mimeType = imagePath.endsWith(".png") ? "image/png" : "image/jpeg";

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await openai.chat.completions.create(
      {
        model: "gpt-5.2",
        max_completion_tokens: 8192,
        messages: [
          {
            role: "system",
            content: ANALYSIS_PROMPT,
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`,
                },
              },
              {
                type: "text",
                text: "Analyze this outfit and rate my drip.",
              },
            ],
          },
        ],
      },
      { signal: controller.signal }
    );

    clearTimeout(timeout);

    const content = response.choices[0]?.message?.content;
    if (!content) {
      logger.warn("Empty AI response, using fallback");
      return getRandomFallback();
    }

    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);

    if (parsed.error === "no_outfit_detected") {
      throw new Error(parsed.message || "No outfit detected in the image");
    }

    return parsed as FallbackAnalysis;
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.includes("No outfit detected") || err.message?.includes("no_outfit_detected")) {
      throw error;
    }
    logger.error({ err: error }, "AI analysis failed, using fallback");
    return getRandomFallback();
  }
}
