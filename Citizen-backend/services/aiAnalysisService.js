// services/aiAnalysisService.js
const { model } = require('../config/gemini');
const fs = require('fs').promises;
const path = require('path');

/**
 * Analyze complaint image using Gemini AI - Two-stage validation
 * Stage 1: Check if it's a valid civic complaint
 * Stage 2: If valid, analyze category, severity, and details
 */
async function analyzeComplaintImage(imagePath, complaintType = null, description = '', location = '') {
    try {
        console.log('🔍 AI Analysis - Reading image file:', imagePath);
        
        // Read image file and convert to base64
        const imageData = await fs.readFile(imagePath);
        console.log('✅ Image file read successfully, size:', imageData.length, 'bytes');
        
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
        console.log('📄 Image MIME type:', mimeType);

        // Build context from description and location
        const contextInfo = description ? `\n\nUSER'S DESCRIPTION: "${description}"\nLOCATION: "${location}"` : '';

        // THE PROMPT - Two-stage validation with improved categorization
        const prompt = `FIRST, determine whether this image represents a VALID civic complaint.${contextInfo}

INVALID images include:
- Photos of people (faces, selfies, portraits, groups)
- Personal items (phones, bags, food items)
- Indoor scenes (homes, offices, rooms)
- Animals or pets
- Vehicles without visible civic issues
- Random objects unrelated to civic problems
- Blurry, dark, or unclear images

VALID civic complaints include:
- Garbage: waste piles, overflowing bins, litter, plastic bags, food waste, scattered trash
- Road Damage: potholes, cracks in asphalt/concrete, broken pavement, damaged road surface, uneven roads
- Water Leakage: broken pipes, water flowing on streets, flooding, tap leakage, water wastage
- Street Light: non-functioning lights, broken poles, dark streets at night, damaged electrical fixtures
- Drainage: blocked drains, sewage overflow, water logging, clogged gutters, stagnant water

CRITICAL CATEGORIZATION RULES:
1. If you see CRACKS, POTHOLES, or DAMAGED ROAD SURFACE → "Road Damage" (NOT Garbage)
2. If you see WASTE, TRASH, PLASTIC, or GARBAGE PILES → "Garbage" (NOT Road Damage)
3. If you see WATER FLOWING or FLOODING → "Water Leakage" (NOT Drainage)
4. If you see BLOCKED DRAIN or SEWAGE → "Drainage" (NOT Water Leakage)
5. Pay attention to the USER'S DESCRIPTION - it provides important context

If the image is NOT a valid civic complaint, respond with:
{
  "is_valid_complaint": false,
  "rejection_reason": "clear reason why image is invalid"
}

If the image IS a valid civic complaint, respond with:
{
  "is_valid_complaint": true,
  "category": "One of: Garbage, Water Leakage, Road Damage, Street Light, Drainage, Unknown",
  "severity": 75,
  "severity_level": "High",
  "description": "brief factual description of the visible issue",
  "detected_issues": ["issue1", "issue2"],
  "confidence": 85
}

SEVERITY SCALE:
0–25   → Low (minor issue, routine maintenance)
26–50  → Medium (noticeable issue, needs attention)
51–75  → High (significant issue, urgent action needed)
76–100 → Critical (severe issue, immediate action required)

Rules:
- Severity MUST be an integer between 0 and 100.
- Confidence MUST be an integer between 0 and 100.
- Do NOT guess details not visible in the image.
- If uncertain, set category to "Unknown".
- Output ONLY raw JSON.
- Do NOT include markdown or extra text.
- CAREFULLY distinguish between categories - road cracks are NOT garbage!`;

        console.log('🤖 Calling Gemini API for analysis...');
        
        // Call Gemini API
        const result = await model.generateContent([
            { text: prompt },
            {
                inlineData: {
                    mimeType: mimeType,
                    data: base64Image
                }
            }
        ]);

        const response = await result.response;
        const responseText = response.text();
        console.log('✅ Gemini API response received');
        console.log('📝 Raw response:', responseText.substring(0, 200) + '...');

        // Parse the response
        const analysis = parseGeminiResponse(responseText);

        // Check if complaint is valid
        if (!analysis.is_valid_complaint) {
            console.log('❌ Invalid complaint detected:', analysis.rejection_reason);
            throw new Error(`INVALID_COMPLAINT: ${analysis.rejection_reason}`);
        }

        console.log('✅ Valid complaint detected');
        console.log('   Category:', analysis.category);
        console.log('   Severity:', analysis.severity + '%');
        console.log('   Priority:', analysis.severity_level);

        return {
            detectedComplaintType: analysis.category,
            severity: analysis.severity,
            priorityLevel: analysis.severity_level,
            description: analysis.description,
            detectedIssues: analysis.detected_issues || [],
            confidence: 85,
            analyzedAt: new Date(),
            isValidComplaint: true
        };

    } catch (error) {
        console.error('❌ Gemini AI analysis error:', error);
        
        // Check if it's an invalid complaint error
        if (error.message && error.message.startsWith('INVALID_COMPLAINT:')) {
            throw error; // Re-throw to be handled by route
        }
        
        console.error('   Error name:', error.name);
        console.error('   Error message:', error.message);
        
        // CRITICAL: Don't return default values - throw error so complaint is rejected
        // This ensures only properly analyzed images are accepted
        throw new Error(`AI_ANALYSIS_FAILED: ${error.message}`);
    }
}

/**
 * Parse Gemini response - Extract JSON from response
 */
function parseGeminiResponse(responseText) {
    try {
        // Remove markdown code blocks if present
        let cleanText = responseText.trim();
        cleanText = cleanText.replace(/```json\n?/g, '');
        cleanText = cleanText.replace(/```\n?/g, '');
        cleanText = cleanText.trim();

        // Extract JSON object
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error('No JSON found in Gemini response');
            throw new Error('No JSON found in response');
        }

        const parsed = JSON.parse(jsonMatch[0]);
        console.log('✅ Parsed Gemini response:', JSON.stringify(parsed, null, 2));

        // Check if complaint is invalid
        if (parsed.is_valid_complaint === false) {
            return {
                is_valid_complaint: false,
                rejection_reason: parsed.rejection_reason || 'This image does not appear to be a valid civic complaint.'
            };
        }

        // Normalize the response - ensure all required fields exist
        const normalized = {
            is_valid_complaint: true,
            category: parsed.category || 'Garbage',
            severity: parseInt(parsed.severity) || 50,
            severity_level: parsed.severity_level || determineSeverityLevel(parsed.severity),
            description: parsed.description || 'Civic complaint detected',
            detected_issues: Array.isArray(parsed.detected_issues) ? parsed.detected_issues : [],
            confidence: parseInt(parsed.confidence) || 75
        };

        console.log('✅ Normalized response:', JSON.stringify(normalized, null, 2));
        return normalized;

    } catch (error) {
        console.error('❌ Failed to parse Gemini response:', error);
        console.error('   Raw response:', responseText.substring(0, 500));
        
        // Return default valid complaint on parse error
        return {
            is_valid_complaint: true,
            category: 'Garbage',
            severity: 50,
            severity_level: 'medium',
            description: 'Unable to parse AI response - manual review required',
            detected_issues: ['parse_error'],
            confidence: 50
        };
    }
}

/**
 * Determine severity level from numeric severity
 */
function determineSeverityLevel(severity) {
    const sev = parseInt(severity) || 50;
    if (sev >= 76) return 'critical';
    if (sev >= 51) return 'high';
    if (sev >= 26) return 'medium';
    return 'low';
}

module.exports = {
    analyzeComplaintImage
};
