import re
from typing import Dict, Any

# Domain-specific financial sentiment lexicons based on Loughran & McDonald dictionary
FINANCIAL_POSITIVE_WORDS = {
  "surge", "surges", "surged", "surging", "jump", "jumps", "jumped", "growth", "growing",
  "gain", "gains", "gained", "rally", "rallies", "rallied", "profit", "profits", "profitable",
  "beat", "beats", "beating", "outperform", "outperformed", "outperformance", "bullish",
  "record", "high", "highest", "strong", "stronger", "strongest", "strength", "upgrade",
  "upgraded", "upgrades", "dividend", "boost", "boosts", "boosted", "soar", "soars",
  "soared", "expansion", "expanded", "win", "wins", "won", "deal", "contract", "breakthrough",
  "milestone", "innovation", "innovative", "success", "successful", "acquisition", "acquire",
  "confidence", "optimistic", "optimism", "recovery", "rebound", "momentum", "accelerate"
}

FINANCIAL_NEGATIVE_WORDS = {
  "plunge", "plunges", "plunged", "drop", "drops", "dropped", "fall", "falls", "fell",
  "slump", "slumps", "slumped", "loss", "losses", "lost", "losing", "miss", "misses", "missed",
  "decline", "declines", "declined", "declining", "crash", "crashes", "crashed", "bearish",
  "downgrade", "downgraded", "downgrades", "warning", "warns", "warned", "debt", "default",
  "bankrupt", "bankruptcy", "lawsuit", "sued", "investigation", "probe", "antitrust",
  "inflation", "recession", "slowdown", "weak", "weaker", "weakest", "weakness", "deficit",
  "tariff", "tariffs", "fine", "fined", "penalty", "layoff", "layoffs", "cut", "cuts",
  "slashed", "fraud", "scandal", "risk", "risks", "volatile", "volatility", "pessimistic"
}

INTENSIFIERS = {
  "very", "highly", "substantially", "significantly", "sharply", "dramatically", "extremely", "massive"
}

NEGATORS = {
  "not", "no", "never", "hardly", "barely", "scarcely", "without", "despite"
}

def clean_text(text: str) -> list[str]:
    text = text.lower()
    text = re.sub(r'[^a-z\s]', ' ', text)
    return text.split()

def analyze_financial_sentiment(title: str, description: str = "") -> Dict[str, Any]:
    full_text = f"{title} {description}"
    words = clean_text(full_text)

    if not words:
        return {
            "sentiment": "neutral",
            "score": 0.0,
            "confidence": 0.5,
            "positive_terms": [],
            "negative_terms": []
        }

    pos_score = 0.0
    neg_score = 0.0
    pos_terms = []
    neg_terms = []

    for i, word in enumerate(words):
        # Look behind for negation
        is_negated = False
        if i > 0 and words[i-1] in NEGATORS:
            is_negated = True
        elif i > 1 and words[i-2] in NEGATORS:
            is_negated = True

        # Look behind for intensifier
        multiplier = 1.0
        if i > 0 and words[i-1] in INTENSIFIERS:
            multiplier = 1.5

        if word in FINANCIAL_POSITIVE_WORDS:
            if is_negated:
                neg_score += 1.0 * multiplier
                neg_terms.append(f"not {word}")
            else:
                pos_score += 1.0 * multiplier
                pos_terms.append(word)
        elif word in FINANCIAL_NEGATIVE_WORDS:
            if is_negated:
                pos_score += 0.8 * multiplier
                pos_terms.append(f"not {word}")
            else:
                neg_score += 1.0 * multiplier
                neg_terms.append(word)

    total_hits = pos_score + neg_score
    if total_hits == 0:
        return {
            "sentiment": "neutral",
            "score": 0.0,
            "confidence": 0.65,
            "positive_terms": [],
            "negative_terms": []
        }

    # Normalized score from -1.0 to 1.0
    raw_score = (pos_score - neg_score) / (pos_score + neg_score)
    normalized_score = round(raw_score, 3)

    # Confidence based on density of sentiment hits
    confidence = min(round(0.60 + min(total_hits, 5) * 0.06, 2), 0.95)

    if normalized_score > 0.15:
        sentiment = "positive"
    elif normalized_score < -0.15:
        sentiment = "negative"
    else:
        sentiment = "neutral"

    return {
        "sentiment": sentiment,
        "score": normalized_score,
        "confidence": confidence,
        "positive_terms": list(set(pos_terms))[:5],
        "negative_terms": list(set(neg_terms))[:5]
    }
