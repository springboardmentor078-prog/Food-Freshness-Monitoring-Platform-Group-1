"""
Freshness Scoring Engine.
Implements the weighted scoring model from the project specification:

Freshness Score = Visual Condition (40%) + Storage Conditions (25%)
                + Shelf-Life Prediction (20%) + Product Age (15%)

Also derives:
  - freshness_pct from classifier results + segmentation data
  - freshness_label from score thresholds
  - spoilage_probability from analysis
  - storage/consumption recommendations
"""


def compute_freshness_pct(
    cls_confidence: float,
    is_fresh: bool,
    defect_ratio: float = 0.0
) -> float:
    """
    Derive freshness_pct (0-100) from vision model outputs.

    Formula:
        F_cls = 50 + 50*C  if Fresh, else 50*(1-C)
        F_seg = 100 * (1 - defect_ratio)
        freshness_pct = 0.60 * F_seg + 0.40 * F_cls
    """
    # Classification-based freshness score
    if is_fresh:
        f_cls = 50.0 + (50.0 * cls_confidence)
    else:
        f_cls = 50.0 * (1.0 - cls_confidence)

    # Segmentation-based freshness score
    f_seg = 100.0 * (1.0 - defect_ratio)

    # Weighted blend
    freshness_pct = (0.60 * f_seg) + (0.40 * f_cls)

    return round(max(0.0, min(100.0, freshness_pct)), 1)


def aggregate_freshness_from_crops(crop_results: list) -> dict:
    """
    Aggregate freshness scores from multiple per-fruit classifications.

    Args:
        crop_results: list of dicts with 'confidence', 'is_fresh', 'predicted_class'

    Returns:
        dict with aggregated freshness_pct, is_fresh, dominant_class, spoilage_ratio
    """
    if not crop_results:
        return {
            "freshness_pct": 50.0,
            "is_fresh": True,
            "dominant_class": "Unknown",
            "fresh_count": 0,
            "spoiled_count": 0,
            "spoilage_ratio": 0.0,
        }

    scores = []
    fresh_count = 0
    spoiled_count = 0
    class_counts = {}

    for result in crop_results:
        conf = result.get("confidence", 0.5)
        is_fresh = result.get("is_fresh", True)

        # Per-crop freshness score
        if is_fresh:
            score = 50.0 + (50.0 * conf)
            fresh_count += 1
        else:
            score = 50.0 * (1.0 - conf)
            spoiled_count += 1

        scores.append(score)

        cls = result.get("predicted_class", "Unknown")
        class_counts[cls] = class_counts.get(cls, 0) + 1

    avg_score = sum(scores) / len(scores) if scores else 50.0
    dominant_class = max(class_counts, key=class_counts.get) if class_counts else "Unknown"

    total = fresh_count + spoiled_count
    spoilage_ratio = spoiled_count / total if total > 0 else 0.0

    return {
        "freshness_pct": round(max(0.0, min(100.0, avg_score)), 1),
        "is_fresh": fresh_count >= spoiled_count,
        "dominant_class": dominant_class,
        "fresh_count": fresh_count,
        "spoiled_count": spoiled_count,
        "spoilage_ratio": round(spoilage_ratio, 3),
    }


def get_freshness_label(freshness_score: float) -> str:
    """
    Map freshness score to categorical label.
    Thresholds from the project specification.
    """
    if freshness_score > 85:
        return "Fresh"
    elif freshness_score > 70:
        return "Good"
    elif freshness_score > 50:
        return "Acceptable"
    elif freshness_score > 30:
        return "Near Spoilage"
    else:
        return "Spoiled"


def compute_spoilage_probability(
    cls_confidence: float,
    is_fresh: bool,
    defect_ratio: float = 0.0
) -> float:
    """
    Estimate spoilage probability (0.0 - 1.0).
    Higher defect ratio and lower freshness confidence = higher probability.
    """
    # Base from defect ratio (strong signal)
    defect_signal = defect_ratio

    # Classification confidence signal
    if is_fresh:
        cls_signal = 1.0 - cls_confidence  # Fresh with high confidence = low risk
    else:
        cls_signal = cls_confidence  # Rotten with high confidence = high risk

    # Weighted combination
    spoilage_prob = (0.55 * defect_signal) + (0.45 * cls_signal)

    return round(max(0.0, min(1.0, spoilage_prob)), 3)


def compute_storage_score(
    temperature: float,
    humidity: float,
    storage_type: str
) -> float:
    """
    Score storage conditions (0-100).
    Penalizes deviations from ideal ranges per storage type.
    """
    # Ideal ranges by storage type
    ideal_ranges = {
        "fridge": {"temp": (1, 5), "humidity": (85, 95)},
        "cold_room": {"temp": (-2, 4), "humidity": (80, 95)},
        "counter": {"temp": (18, 24), "humidity": (40, 60)},
        "pantry": {"temp": (15, 22), "humidity": (40, 60)},
    }

    ideal = ideal_ranges.get(storage_type, ideal_ranges["fridge"])
    score = 100.0

    # Temperature penalty
    temp_low, temp_high = ideal["temp"]
    if temperature < temp_low:
        score -= min(30, (temp_low - temperature) * 3)
    elif temperature > temp_high:
        score -= min(40, (temperature - temp_high) * 5)

    # Humidity penalty
    hum_low, hum_high = ideal["humidity"]
    if humidity < hum_low:
        score -= min(20, (hum_low - humidity) * 1.5)
    elif humidity > hum_high:
        score -= min(20, (humidity - hum_high) * 2)

    return round(max(0.0, min(100.0, score)), 1)


def compute_overall_health_score(
    visual_score: float,
    storage_score: float,
    shelf_life_days: float,
    max_shelf_life_days: float = 14.0,
    days_since_purchase: int = 0
) -> float:
    """
    Overall food health score using the weighted model:
        40% Visual + 25% Storage + 20% Shelf-Life + 15% Age

    Returns: 0-100 score
    """
    # Shelf-life score (normalized)
    if max_shelf_life_days > 0:
        shelf_score = min(100.0, (shelf_life_days / max_shelf_life_days) * 100.0)
    else:
        shelf_score = 0.0

    # Age score (inverse of age)
    if max_shelf_life_days > 0:
        age_score = max(
            0.0,
            100.0 * (1.0 - days_since_purchase / max_shelf_life_days)
        )
    else:
        age_score = 50.0

    # Weighted combination
    overall = (
        0.40 * visual_score +
        0.25 * storage_score +
        0.20 * shelf_score +
        0.15 * age_score
    )

    return round(max(0.0, min(100.0, overall)), 1)


def generate_recommendations(
    freshness_label: str,
    freshness_score: float,
    remaining_days: float,
    temperature: float,
    humidity: float,
    storage_type: str,
    predicted_class: str,
    spoilage_probability: float,
) -> list:
    """
    Generate contextual storage and consumption recommendations.

    Returns:
        list of dicts with 'type' (info/warning/critical), 'title', 'message'
    """
    recs = []

    # ── Freshness-based recommendations ──────────────────────────────
    if freshness_score >= 85:
        recs.append({
            "type": "info",
            "title": "Excellent Condition",
            "message": f"This product is in excellent condition (score: {freshness_score}/100). "
                       "Continue current storage practices."
        })
    elif freshness_score >= 70:
        recs.append({
            "type": "info",
            "title": "Good Condition",
            "message": f"Product quality is good (score: {freshness_score}/100). "
                       "Consider consuming within the next few days."
        })
    elif freshness_score >= 50:
        recs.append({
            "type": "warning",
            "title": "Quality Declining",
            "message": f"Product freshness is declining (score: {freshness_score}/100). "
                       "Prioritize for near-term consumption or markdown for sale."
        })
    elif freshness_score >= 30:
        recs.append({
            "type": "warning",
            "title": "Near Spoilage Warning",
            "message": "Product is approaching spoilage. Consume immediately or "
                       "consider composting/donation to food banks."
        })
    else:
        recs.append({
            "type": "critical",
            "title": "Spoilage Detected",
            "message": "Product shows significant spoilage indicators. "
                       "Not recommended for consumption. Dispose properly."
        })

    # ── Shelf-life based recommendations ─────────────────────────────
    if remaining_days <= 1:
        recs.append({
            "type": "critical",
            "title": "Expiring Today",
            "message": f"Estimated remaining shelf life is only {remaining_days:.1f} days. "
                       "Consume or freeze immediately."
        })
    elif remaining_days <= 3:
        recs.append({
            "type": "warning",
            "title": "Expiring Soon",
            "message": f"About {remaining_days:.1f} days of shelf life remaining. "
                       "Plan to use this product soon."
        })
    elif remaining_days > 7:
        recs.append({
            "type": "info",
            "title": "Good Shelf Life",
            "message": f"Approximately {remaining_days:.1f} days of shelf life remaining. "
                       "No immediate action needed."
        })

    # ── Storage condition recommendations ────────────────────────────
    ideal = {
        "fridge": {"temp": (1, 5), "humidity": (85, 95)},
        "cold_room": {"temp": (-2, 4), "humidity": (80, 95)},
        "counter": {"temp": (18, 24), "humidity": (40, 60)},
        "pantry": {"temp": (15, 22), "humidity": (40, 60)},
    }

    if storage_type in ideal:
        temp_range = ideal[storage_type]["temp"]
        hum_range = ideal[storage_type]["humidity"]

        if temperature > temp_range[1] + 2:
            recs.append({
                "type": "warning",
                "title": "Temperature Too High",
                "message": f"Current temperature ({temperature}°C) is above the ideal "
                           f"range ({temp_range[0]}-{temp_range[1]}°C) for {storage_type} storage. "
                           "Move to a cooler location to extend shelf life."
            })
        elif temperature < temp_range[0] - 2:
            recs.append({
                "type": "warning",
                "title": "Temperature Too Low",
                "message": f"Current temperature ({temperature}°C) is below the ideal "
                           f"range ({temp_range[0]}-{temp_range[1]}°C). "
                           "This may cause freezing damage."
            })

        if humidity < hum_range[0] - 10:
            recs.append({
                "type": "info",
                "title": "Low Humidity",
                "message": f"Humidity ({humidity}%) is below optimal ({hum_range[0]}-{hum_range[1]}%). "
                           "Consider using sealed containers or humidifiers."
            })

    # ── Spoilage probability recommendation ──────────────────────────
    if spoilage_probability > 0.6:
        recs.append({
            "type": "critical",
            "title": "High Spoilage Risk",
            "message": f"Spoilage probability is {spoilage_probability*100:.0f}%. "
                       "Inspect nearby items for cross-contamination."
        })

    # ── General tips based on produce type ───────────────────────────
    cls_lower = predicted_class.lower()
    if any(f in cls_lower for f in ["banana", "apple", "mango"]):
        recs.append({
            "type": "info",
            "title": "Storage Tip",
            "message": "Ethylene-producing fruits should be stored separately "
                       "from ethylene-sensitive produce to prevent premature ripening."
        })

    return recs
