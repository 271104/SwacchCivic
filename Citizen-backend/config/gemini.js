// config/gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the model
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"  // Fast and cost-effective
});

module.exports = { model, genAI };
