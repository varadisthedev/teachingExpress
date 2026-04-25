const express = require("express");
const router = express.Router();
const multer = require("multer"); // for image uploads
const model = require("./gemini");

const upload = multer({ storage: multer.memoryStorage() });

// ─── Text / Data Analysis ─────────────────────────────────
router.post("/analyse", async (req, res) => {
  try {
    const { data, prompt } = req.body;

    const fullPrompt = `
      ${prompt || "Analyse the following data and give insights:"}
      
      ${JSON.stringify(data, null, 2)}
    `;

    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();

    res.json({ success: true, analysis: text });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── Graph / Image Analysis ───────────────────────────────
router.post("/analyse-graph", upload.single("image"), async (req, res) => {
  try {
    const { prompt } = req.body;
    const imageBuffer = req.file.buffer;
    const mimeType = req.file.mimetype; // e.g. "image/png"

    const result = await model.generateContent([
      {
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType,
        },
      },
      prompt ||
        "Analyse this graph and explain the trends, patterns, and key insights.",
    ]);

    const text = result.response.text();
    res.json({ success: true, analysis: text });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
