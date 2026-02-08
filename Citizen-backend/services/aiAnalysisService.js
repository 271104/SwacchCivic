// services/aiAnalysisService.js
const { model } = require('../config/gemini');
const fs = require('fs').promises;
const path = require('path');

/**
 * Analyze complaint image using Gemini AI
 * @param {string} imagePath - Path to the uploaded image
 * @param {string} complaintType - Type of complaint (Garbage, Road Damage, etc.)
 * @returns {Promise<Object>} AI analysis results
 */
async function analyzeComplaintImage(imagePath, complaintType) {
    try {
        // Read image file and convert to base64
        const imageData = await fs.readFile(imagePath);
        const base64Image = imageData.toString('base64');

        // Determine MIME type from file extension
        const ext = path.extname(imagePath).toLowerCase();
        const mimeTypes = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.webp': 'image/webp'
        };
        const mimeType = mimeTypes[ext] || 'image/jpeg';

        // Generate prompt based on complaint type
        const prompt = generatePrompt(complaintType);

        // Call Gemini API
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    mimeType: mimeType,
                    data: base64Image
                }
            }
        ]);

        const response = await result.response;
        const text = response.text();

        // Parse and validate response
        const analysis = parseGeminiResponse(text, complaintType);

        return analysis;

    } catch (error) {
        console.error('Gemini AI analysis error:', error);
        // Return default analysis on error (graceful degradation)
        return getDefaultAnalysis(complaintType);
    }
}

/**
 * Generate complaint-specific prompts for Gemini
 */
function generatePrompt(complaintType) {
    const baseInstruction = "You are an expert municipal inspector analyzing civic complaint images. Analyze this image carefully and respond ONLY with valid JSON. No markdown, no code blocks, no explanations - just pure JSON.";

    const prompts = {
        'Garbage': `${baseInstruction}

GARBAGE ANALYSIS INSTRUCTIONS:
Analyze this garbage complaint image with high accuracy:

1. GARBAGE COVERAGE PERCENTAGE (0-100):
   - 0-20%: Minimal scattered litter, few items
   - 21-40%: Noticeable garbage, some accumulation
   - 41-60%: Significant garbage, multiple piles or overflowing bins
   - 61-80%: Heavy accumulation, widespread distribution
   - 81-100%: Severe garbage crisis, area overwhelmed with waste

2. PRIORITY ASSESSMENT:
   - low: <30% coverage, no health hazards, isolated items
   - medium: 30-50% coverage, some accumulation, manageable
   - high: 51-75% coverage, health concerns, significant volume
   - critical: >75% coverage, severe health hazard, urgent action needed

3. DETAILED ANALYSIS:
   - Count visible garbage items/piles
   - Estimate area coverage percentage
   - Identify waste types (plastic, organic, mixed, medical, etc.)
   - Assess health risks (mosquito breeding, rodents, odor)
   - Estimate cleanup effort in person-hours

RESPOND WITH THIS EXACT JSON STRUCTURE:
{
  "severity": <number 0-100>,
  "coveragePercentage": <number 0-100>,
  "priorityLevel": "<low|medium|high|critical>",
  "detectedIssues": ["<issue1>", "<issue2>"],
  "description": "<detailed 2-3 sentence description>",
  "wasteTypes": ["<type1>", "<type2>"],
  "estimatedVolume": "<small|medium|large|very_large>",
  "cleanupEffort": <hours as number>,
  "healthConcerns": ["<concern1>", "<concern2>"],
  "confidence": <number 0-100>
}`,

        'Road Damage': `${baseInstruction}

ROAD DAMAGE ANALYSIS INSTRUCTIONS:
Analyze this road damage image with precision:

1. DAMAGE SEVERITY PERCENTAGE (0-100):
   - 0-20%: Minor cracks, surface wear, cosmetic issues
   - 21-40%: Visible cracks, small potholes (<30cm), moderate wear
   - 41-60%: Multiple potholes (30-60cm), significant cracks, uneven surface
   - 61-80%: Large potholes (>60cm), deep cracks, structural damage
   - 81-100%: Severe damage, road collapse, immediate danger

2. DAMAGE MEASUREMENT:
   - Estimate pothole/crack dimensions (width, depth, length)
   - Count number of damaged areas visible
   - Assess percentage of road surface affected
   - Evaluate structural integrity

3. PRIORITY ASSESSMENT:
   - low: Cosmetic damage, no safety risk, <25% road affected
   - medium: Moderate damage, minor safety concern, 25-50% affected
   - high: Significant damage, safety hazard, 51-75% affected
   - critical: Severe damage, immediate danger, >75% affected

4. TRAFFIC & SAFETY IMPACT:
   - Vehicle damage risk (low/medium/high/critical)
   - Traffic flow disruption
   - Accident potential
   - Pedestrian safety

RESPOND WITH THIS EXACT JSON STRUCTURE:
{
  "severity": <number 0-100>,
  "damagePercentage": <number 0-100>,
  "priorityLevel": "<low|medium|high|critical>",
  "detectedIssues": ["<issue1>", "<issue2>"],
  "description": "<detailed 2-3 sentence description with measurements>",
  "damageType": "<crack|pothole|collapse|surface_wear|multiple>",
  "estimatedSize": {
    "width": "<measurement in cm or meters>",
    "depth": "<shallow|medium|deep>",
    "affectedArea": "<percentage of road>"
  },
  "trafficImpact": "<low|medium|high|critical>",
  "safetyRisk": "<low|medium|high|critical>",
  "vehicleDamageRisk": "<low|medium|high|critical>",
  "repairUrgency": "<routine|soon|urgent|immediate>",
  "confidence": <number 0-100>
}`,

        'Water Leakage': `${baseInstruction}

WATER LEAKAGE ANALYSIS INSTRUCTIONS:
Analyze this water leakage with accuracy:

1. LEAK SEVERITY (0-100):
   - 0-20%: Minor dripping, small wet spot
   - 21-40%: Steady drip, visible water accumulation
   - 41-60%: Continuous flow, puddle formation
   - 61-80%: Strong flow, flooding risk
   - 81-100%: Pipe burst, severe flooding

2. WATER WASTAGE ESTIMATION:
   - Dripping: 10-50 liters/day
   - Steady flow: 100-500 liters/day
   - Strong flow: 1000-5000 liters/day
   - Burst: 5000+ liters/day

RESPOND WITH THIS EXACT JSON STRUCTURE:
{
  "severity": <number 0-100>,
  "priorityLevel": "<low|medium|high|critical>",
  "detectedIssues": ["<issue1>", "<issue2>"],
  "description": "<detailed description>",
  "flowRate": "<dripping|steady|strong|burst>",
  "estimatedWastage": <liters per day>,
  "infrastructureRisk": "<low|medium|high|critical>",
  "floodingRisk": "<low|medium|high|critical>",
  "confidence": <number 0-100>
}`,

        'Street Light': `${baseInstruction}

STREET LIGHT ANALYSIS INSTRUCTIONS:
Analyze this street light issue:

1. SEVERITY (0-100):
   - 0-30%: Single light, low-traffic area
   - 31-50%: Single light, medium-traffic area
   - 51-70%: Multiple lights or high-traffic area
   - 71-100%: Entire street dark, major safety concern

RESPOND WITH THIS EXACT JSON STRUCTURE:
{
  "severity": <number 0-100>,
  "priorityLevel": "<low|medium|high|critical>",
  "detectedIssues": ["<issue1>", "<issue2>"],
  "description": "<detailed description>",
  "outageExtent": "<single|multiple|entire_street>",
  "safetyImpact": "<low|medium|high|critical>",
  "areaType": "<residential|commercial|highway|rural>",
  "confidence": <number 0-100>
}`,

        'Drainage': `${baseInstruction}

DRAINAGE ISSUE ANALYSIS INSTRUCTIONS:
Analyze this drainage problem:

1. BLOCKAGE SEVERITY (0-100):
   - 0-30%: Partial blockage, slow drainage
   - 31-50%: Significant blockage, standing water
   - 51-70%: Severe blockage, overflow risk
   - 71-100%: Complete blockage, active overflow

RESPOND WITH THIS EXACT JSON STRUCTURE:
{
  "severity": <number 0-100>,
  "priorityLevel": "<low|medium|high|critical>",
  "detectedIssues": ["<issue1>", "<issue2>"],
  "description": "<detailed description>",
  "blockageType": "<partial|significant|complete>",
  "overflowRisk": "<low|medium|high|critical>",
  "healthHazards": ["<hazard1>", "<hazard2>"],
  "confidence": <number 0-100>
}`
    };

    return prompts[complaintType] || prompts['Garbage'];
}

/**
 * Parse Gemini response and extract JSON
 */
function parseGeminiResponse(text, complaintType) {
    try {
        // Remove markdown code blocks if present
        let cleanText = text.trim();
        cleanText = cleanText.replace(/```json\n?/g, '');
        cleanText = cleanText.replace(/```\n?/g, '');
        cleanText = cleanText.trim();

        // Try to find JSON object
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);

            // Validate required fields
            if (!parsed.severity || !parsed.priorityLevel) {
                throw new Error('Missing required fields');
            }

            // Ensure severity is in range
            parsed.severity = Math.max(0, Math.min(100, parsed.severity));

            // Add coverage/damage percentage if not present
            if (complaintType === 'Garbage' && !parsed.coveragePercentage) {
                parsed.coveragePercentage = parsed.severity;
            }
            if (complaintType === 'Road Damage' && !parsed.damagePercentage) {
                parsed.damagePercentage = parsed.severity;
            }

            // Ensure valid priority level
            const validPriorities = ['low', 'medium', 'high', 'critical'];
            if (!validPriorities.includes(parsed.priorityLevel)) {
                // Auto-assign based on severity
                if (parsed.severity >= 75) parsed.priorityLevel = 'critical';
                else if (parsed.severity >= 50) parsed.priorityLevel = 'high';
                else if (parsed.severity >= 25) parsed.priorityLevel = 'medium';
                else parsed.priorityLevel = 'low';
            }

            // Ensure confidence is set
            if (!parsed.confidence) {
                parsed.confidence = 75; // Default confidence
            }

            // Add AI description field for compatibility
            if (!parsed.aiDescription && parsed.description) {
                parsed.aiDescription = parsed.description;
            }

            // Add timestamp
            parsed.analyzedAt = new Date();

            console.log('✅ AI Analysis parsed successfully:', {
                severity: parsed.severity,
                priority: parsed.priorityLevel,
                confidence: parsed.confidence,
                coveragePercentage: parsed.coveragePercentage,
                damagePercentage: parsed.damagePercentage
            });

            return parsed;
        }

        throw new Error('No valid JSON found in response');

    } catch (error) {
        console.error('Failed to parse Gemini response:', error);
        console.error('Raw response:', text.substring(0, 500));
        return getDefaultAnalysis(complaintType);
    }
}

/**
 * Get default analysis when AI fails
 */
function getDefaultAnalysis(complaintType) {
    return {
        severity: 50,
        priorityLevel: 'medium',
        detectedIssues: ['requires_manual_review'],
        description: `${complaintType} complaint requires manual review. AI analysis unavailable.`,
        confidence: 0,
        analyzedAt: new Date(),
        aiError: true
    };
}

module.exports = {
    analyzeComplaintImage
};
