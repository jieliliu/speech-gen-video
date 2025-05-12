const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

// gemini key
const genAI = new GoogleGenerativeAI("AIzaSyDz9Ioda9uFWS0QEdyTZaSmIurL1YA5Jyo");

app.post('/generate-narrative', async (req, res) => {
  const { url } = req.body;

  try {
    const { data: html } = await axios.get(url);
    const plainText = html.replace(/<[^>]+>/g, ' '); // remove HTML tags

    const gptPrompt = `
You are a friendly penguin helping people apply for disabled parking permits.
Below is the information from the official website:

${plainText}

Please generate a short, clear, helpful narrative that includes:
- placard types
- eligibility
- required form
- how to apply.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


    const result = await model.generateContent(gptPrompt);
    const response = await result.response;
    const text = await response.text();

    res.json({ narrative: text });
  } catch (error) {
    console.error('❌ Error:', error.message || error);
    res.status(500).json({ error: 'Failed to generate narrative' });
  }
});

app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});
