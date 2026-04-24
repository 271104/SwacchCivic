// scripts/testGeminiAPI.js
const { model } = require('../config/gemini');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function testGeminiAPI() {
  try {
    console.log('🔧 Testing Gemini API...');
    console.log('   API Key:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');
    
    // Find a complaint image to test with
    const uploadsDir = path.join(__dirname, '../uploads/complaints');
    const files = await fs.readdir(uploadsDir);
    const imageFiles = files.filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
    
    if (imageFiles.length === 0) {
      console.error('❌ No image files found in uploads/complaints');
      process.exit(1);
    }
    
    const testImage = path.join(uploadsDir, imageFiles[0]);
    console.log('📸 Testing with image:', testImage);
    
    // Read image
    const imageData = await fs.readFile(testImage);
    const base64Image = imageData.toString('base64');
    console.log('✅ Image loaded, size:', imageData.length, 'bytes');
    
    // Simple test prompt
    const prompt = `Analyze this image and respond with JSON:
{
  "is_valid_complaint": true,
  "category": "Garbage",
  "severity": 75,
  "description": "Test description"
}`;
    
    console.log('🤖 Calling Gemini API...');
    
    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Image
        }
      }
    ]);
    
    const response = await result.response;
    const responseText = response.text();
    
    console.log('✅ Gemini API Response:');
    console.log(responseText);
    
    console.log('\n✅ Gemini API is working correctly!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);
    console.error('   Error details:', error);
    process.exit(1);
  }
}

testGeminiAPI();
