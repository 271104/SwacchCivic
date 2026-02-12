// config/gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the model - using gemini-pro which is stable and available
const model = genAI.getGenerativeModel({
    model: "gemini-pro"  // Stable and widely available model
});

module.exports = { model, genAI };
