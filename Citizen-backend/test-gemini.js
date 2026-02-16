// test-gemini.js - Test Gemini API connection
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
    console.log('🧪 Testing Gemini API Connection...\n');
    
    // Check API key
    console.log('1. Checking API Key:');
    if (!process.env.GEMINI_API_KEY) {
        console.error('   ❌ GEMINI_API_KEY not found in environment');
        return;
    }
    console.log('   ✅ API Key present:', process.env.GEMINI_API_KEY.substring(0, 10) + '...');
    
    // Initialize API
    console.log('\n2. Initializing Gemini API:');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('   ✅ API initialized');
    
    // Test text-only model first
    console.log('\n3. Testing text-only model (gemini-pro):');
    try {
        const textModel = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await textModel.generateContent("Say hello");
        const response = await result.response;
        console.log('   ✅ Text model works:', response.text());
    } catch (error) {
        console.error('   ❌ Text model failed:', error.message);
    }
    
    // Test vision model
    console.log('\n4. Testing vision model (gemini-1.5-flash):');
    try {
        const visionModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // Create a simple test image (1x1 red pixel PNG in base64)
        const testImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';
        
        const result = await visionModel.generateContent([
            "What color is this image?",
            {
                inlineData: {
                    mimeType: "image/png",
                    data: testImage
                }
            }
        ]);
        
        const response = await result.response;
        console.log('   ✅ Vision model works:', response.text());
    } catch (error) {
        console.error('   ❌ Vision model failed:', error.message);
        console.error('   Error details:', error);
    }
    
    console.log('\n✅ Gemini API test complete!');
}

testGemini().catch(console.error);
