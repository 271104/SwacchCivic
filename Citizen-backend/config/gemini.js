// config/gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Validate API key
if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY is not set in environment variables!');
    console.error('   AI features will not work. Please set GEMINI_API_KEY in your environment.');
}

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy-key');

// Get the model - using gemini-1.5-flash for vision tasks (image analysis)
// Note: gemini-pro does NOT support images, only text
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"  // Supports both text and images
});

console.log('✅ Gemini AI initialized with gemini-1.5-flash:', process.env.GEMINI_API_KEY ? 'API key present' : 'API key missing');

module.exports = { model, genAI };
