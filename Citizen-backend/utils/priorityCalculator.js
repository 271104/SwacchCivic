// utils/priorityCalculator.js

/**
 * Calculate priority score for a complaint based on AI analysis and other factors
 * @param {Object} aiAnalysis - AI analysis results
 * @param {string} complaintType - Type of complaint
 * @param {string} location - Location of complaint
 * @returns {number} Priority score (0-100)
 */
function calculatePriorityScore(aiAnalysis, complaintType, location = '') {
    let score = aiAnalysis.severity || 50; // Base score from AI severity

    // 1. Boost based on AI priority level
    const priorityBoost = {
        'low': 0,
        'medium': 10,
        'high': 25,
        'critical': 40
    };
    score += priorityBoost[aiAnalysis.priorityLevel] || 0;

    // 2. Boost for hazardous/critical issues
    const hazardousKeywords = [
        'hazardous', 'toxic', 'medical_waste', 'chemical',
        'burst', 'collapse', 'major_damage', 'flooding',
        'electrical_hazard', 'gas_leak'
    ];

    const hasHazard = aiAnalysis.detectedIssues?.some(issue =>
        hazardousKeywords.some(keyword => issue.toLowerCase().includes(keyword))
    );

    if (hasHazard) {
        score += 20;
    }

    // 3. Boost for health concerns
    const healthKeywords = [
        'mosquito', 'disease', 'contamination', 'infection',
        'rodent', 'pest', 'sewage'
    ];

    const hasHealthRisk = (
        aiAnalysis.healthConcerns?.length > 0 ||
        aiAnalysis.detectedIssues?.some(issue =>
            healthKeywords.some(keyword => issue.toLowerCase().includes(keyword))
        )
    );

    if (hasHealthRisk) {
        score += 15;
    }

    // 4. Boost for sensitive/high-traffic locations
    const sensitiveLocations = [
        'school', 'college', 'university', 'hospital', 'clinic',
        'market', 'main road', 'highway', 'station', 'temple',
        'mosque', 'church', 'public', 'playground', 'park'
    ];

    const isSensitive = sensitiveLocations.some(loc =>
        location?.toLowerCase().includes(loc)
    );

    if (isSensitive) {
        score += 15;
    }

    // 5. Type-specific adjustments
    const typeMultipliers = {
        'Water Leakage': 1.1,  // Water wastage is critical
        'Road Damage': 1.05,   // Safety hazard
        'Drainage': 1.1,       // Health risk
        'Garbage': 1.0,
        'Street Light': 0.95   // Less urgent typically
    };

    score *= (typeMultipliers[complaintType] || 1.0);

    // 6. Confidence adjustment (reduce score if AI is uncertain)
    if (aiAnalysis.confidence && aiAnalysis.confidence < 50) {
        score *= 0.9; // Reduce by 10% if low confidence
    }

    // Cap at 100 and floor at 0
    return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Determine priority level from score
 * @param {number} score - Priority score (0-100)
 * @returns {string} Priority level
 */
function getPriorityLevel(score) {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
}

/**
 * Get estimated resolution time based on priority score
 * @param {number} priorityScore - Priority score (0-100)
 * @returns {string} Estimated resolution time
 */
function getEstimatedResolution(priorityScore) {
    if (priorityScore >= 80) return '24 hours';
    if (priorityScore >= 60) return '2-3 days';
    if (priorityScore >= 40) return '5-7 days';
    return '1-2 weeks';
}

/**
 * Get priority color for UI
 * @param {string} level - Priority level
 * @returns {string} Color code
 */
function getPriorityColor(level) {
    const colors = {
        'critical': '#dc3545',
        'high': '#fd7e14',
        'medium': '#ffc107',
        'low': '#28a745'
    };
    return colors[level] || '#6c757d';
}

module.exports = {
    calculatePriorityScore,
    getPriorityLevel,
    getEstimatedResolution,
    getPriorityColor
};
