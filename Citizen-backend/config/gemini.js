// config/gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Validate API key
if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY is not set in environment variables!');
    console.error('   AI features will not work. Please set GEMINI_API_KEY in your environment.');
}

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy-key');

// Get the model - using gemini-2.5-flash (latest stable multimodal model)
// Supports both text and images
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
});

console.log('✅ Gemini AI initialized with gemini-2.5-flash:', process.env.GEMINI_API_KEY ? 'API key present' : 'API key missing');

module.exports = { model, genAI };
