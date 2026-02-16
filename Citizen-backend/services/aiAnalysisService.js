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

        // THE PROMPT - Two-stage validation like reference project
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
- Garbage Collection (waste accumulation, overflowing bins, litter)
- Water Leakage (pipes, taps, flooding, water wastage)
- Road Damage (potholes, cracks, broken pavement)
- Street Light (non-functioning lights, broken poles, dark streets)
- Drainage (blocked drains, sewage overflow, water logging)

If the image is NOT a valid civic complaint, respond with:
{
  "is_valid_complaint": false,
  "rejection_reason": "clear reason why image is invalid"
}

If the image IS a valid civic complaint, respond with:
{
  "is_valid_complaint": true,
  "category": "Garbage Collection | Water Leakage | Road Damage | Street Light | Drainage | Unknown",
  "severity": 0-100,
  "severity_level": "Low | Medium | High | Critical",
  "description": "brief factual description of the visible issue",
  "detected_issues": ["issue1", "issue2"],
  "confidence": 0-100
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
- Do NOT include markdown or extra text.`;

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
        
        // Return default analysis on other errors
        return {
            detectedComplaintType: 'Garbage Collection',
            severity: 50,
            priorityLevel: 'medium',
            description: 'AI analysis unavailable - complaint will be reviewed manually',
            detectedIssues: ['requires_manual_review'],
            confidence: 0,
            analyzedAt: new Date(),
            aiError: true
        };
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
            throw new Error('No JSON found in response');
        }

        const parsed = JSON.parse(jsonMatch[0]);

        // Check if complaint is invalid
        if (parsed.is_valid_complaint === false) {
            return {
                is_valid_complaint: false,
                rejection_reason: parsed.rejection_reason || 'This image does not appear to be a valid civic complaint.'
            };
        }

        // Normalize the response
        return {
            is_valid_complaint: true,
            category: parsed.category || 'Garbage Collection',
            severity: parseInt(parsed.severity) || 50,
            severity_level: parsed.severity_level || determineSeverityLevel(parsed.severity),
            description: parsed.description || 'Civic complaint detected',
            detected_issues: parsed.detected_issues || []
        };

    } catch (error) {
        console.error('Failed to parse Gemini response:', error);
        console.error('Raw response:', responseText.substring(0, 500));
        
        // Return default valid complaint on parse error
        return {
            is_valid_complaint: true,
            category: 'Garbage Collection',
            severity: 50,
            severity_level: 'medium',
            description: 'Unable to parse AI response - manual review required',
            detected_issues: ['parse_error']
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
