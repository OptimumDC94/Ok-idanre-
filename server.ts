import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '20mb' }));

// Shared Gemini client utility on the server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Poster & Campaign Image / Content generation API
app.post('/api/gemini/create-poster', async (req, res) => {
  try {
    const { prompt, theme, lga, existingImage, style } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please check your AI Studio secrets.',
      });
    }

    // Generate creative campaign flyer concept, headline, Yoruba wisdom proverb, and visual layout specs
    const systemPrompt = `You are the Creative Director and Youth Mobilizer for 'Ok Idanre', an empowering youth civic platform for Idanre and Ifedore in Ondo State, Nigeria.
Given the user's campaign request, generate an inspiring youth community poster concept with:
1. A punchy headline in English.
2. A meaningful Yoruba proverb or slogan suitable for Idanre/Ifedore youth (with accurate English translation).
3. 3 key bullet points or calls-to-action for the youth.
4. Recommended color palette (primary, accent, background hex colors inspired by Ondo's lush green hills, cocoa heritage, and energetic youth).
5. A detailed visual prompt that can be used to generate or illustrate the poster art.

Respond with strict JSON adhering to this structure:
{
  "headline": string,
  "yorubaProverb": string,
  "yorubaTranslation": string,
  "subheadline": string,
  "bulletPoints": string[],
  "callToAction": string,
  "colorPalette": {
    "primary": string,
    "accent": string,
    "bg": string
  },
  "visualPrompt": string
}`;

    const textResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Create a poster concept for:
Theme: ${theme || 'Youth Empowerment & Community Action'}
Location: ${lga || 'Idanre & Ifedore, Ondo State'}
Style: ${style || 'Bold Modern African Editorial'}
Details: ${prompt || 'Mobilize youth for community leadership, clean hills, and economic prosperity'}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    let posterPlan: any = {};
    try {
      posterPlan = JSON.parse(textResponse.text || '{}');
    } catch {
      posterPlan = {
        headline: 'Arise, Idanre & Ifedore Youth!',
        yorubaProverb: 'Agbajo owo la fi n soya',
        yorubaTranslation: 'Together in unity our collective strength achieves greatness',
        subheadline: 'Connecting Youth, Building Community, Creating Change',
        bulletPoints: ['Active civic leadership', 'Youth agricultural innovation', 'Preserving our natural heritage'],
        callToAction: 'Join the Movement on Ok Idanre',
        colorPalette: {
          primary: '#047857',
          accent: '#f59e0b',
          bg: '#064e3b',
        },
        visualPrompt: 'Vibrant youth collaborating with Oke Idanre in the background',
      };
    }

    return res.json({
      success: true,
      poster: posterPlan,
      generatedImage: null,
    });
  } catch (error: any) {
    console.error('Error generating poster:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate poster' });
  }
});

// Community Discussion Brainstorming API
app.post('/api/gemini/assist-discussion', async (req, res) => {
  try {
    const { topic, category, lga } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Provide 3 constructive, youth-actionable discussion points and 1 solution proposal regarding:
Topic: ${topic}
Category: ${category}
Local Government Area: ${lga || 'Idanre & Ifedore, Ondo State, Nigeria'}

Keep the tone pragmatic, civic-minded, encouraging youth collaboration and local community empowerment.`,
      config: {
        systemInstruction: 'You are an experienced community development advisor for Ondo State youth.',
      },
    });

    res.json({
      success: true,
      advice: response.text,
    });
  } catch (error: any) {
    console.error('Error in assist-discussion:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate suggestions' });
  }
});

// AI Community Guide & Voice Assistant API
app.post('/api/gemini/ai-advisor', async (req, res) => {
  try {
    const { question, history } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    const systemInstruction = `You are "Idanre AI Voice & Community Guide", an enthusiastic, warm, and highly knowledgeable AI assistant dedicated to the youth of Idanre and Ifedore local government areas in Ondo State, Nigeria. 
You help young artisans, tech talents, farmers, students, and entrepreneurs with:
- Cocoa farming & modern agricultural value addition in Ifedore and Idanre
- Tourism promotion around the 682 stone steps of Oke Idanre, Agbogbo shrine, and cultural festivals
- Skills acquisition, local apprenticeship, and digital freelance opportunities
- Emergency procedures and helplines across Idanre and Ifedore wards
- Community collaboration, grants, and youth empowerment initiatives

Always maintain an encouraging, respectful, community-focused tone, occasionally weaving in warm Yoruba greetings ("E nle o!", "Agbajo owo") and practical, actionable advice.`;

    const chatHistory = Array.isArray(history) ? history.map((h: any) => ({
      role: h.role,
      parts: [{ text: h.text }]
    })) : [];

    const chat = ai.chats.create({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction,
      },
      history: chatHistory.length > 0 ? chatHistory : undefined
    });

    const result = await chat.sendMessage({
      message: question || 'Tell me about youth opportunities in Idanre & Ifedore'
    });

    res.json({
      success: true,
      answer: result.text || 'Thank you for connecting with Ok Idanre AI guide! Together we build a greater community.'
    });
  } catch (error: any) {
    console.error('Error in ai-advisor:', error);
    res.status(500).json({ error: error?.message || 'Failed to get AI advisor response' });
  }
});

// Secondary School Curriculum & WAEC/NECO/JAMB AI Tutor API
app.post('/api/gemini/secondary-tutor', async (req, res) => {
  try {
    const { query, subject, classLevel, examTarget } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    const systemInstruction = `You are an expert Nigerian Secondary School Tutor and Chief Examiner specializing in WAEC SSCE, NECO SSCE, and JAMB UTME curricula.
You serve high school students across secondary schools in Idanre and Ifedore (e.g. Olofin Grammar School, St. Joseph's College, Ilara-Mokin High, Anglican Grammar School).
Provide clear, structured, encouraging, and syllabus-accurate explanations.
Format your answer with:
1. Core Concept & Syllabus Definition
2. Step-by-Step Methodical Solution / Working (include formulas, SI units, or grammar rules)
3. WAEC/NECO Examiner's Tip (common errors, marking scheme tips)
4. Practice Follow-up Challenge Question.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Subject: ${subject || 'General Secondary'}
Class Level: ${classLevel || 'Senior Secondary'}
Target Exam: ${examTarget || 'WAEC / JAMB'}
Student Question: ${query}`,
      config: {
        systemInstruction,
      },
    });

    res.json({
      success: true,
      explanation: response.text,
    });
  } catch (error: any) {
    console.error('Error in secondary-tutor:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate tutor response' });
  }
});

// AI Cultural Historian for Idanre Heritage & Royal Court
app.post('/api/gemini/cultural-historian', async (req, res) => {
  try {
    const { topic } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    const systemInstruction = `You are the Grand Cultural Historian and Elder of Idanre Land in Ondo State. You possess deep knowledge of the ancient city on the hill (Oke Idanre), the traditional rulers (His Imperial Majesty, the Owa of Idanre Land), the high chiefs (Lisa, Jomu, Odunwo, etc.), the 682 ancient stone steps, and Yoruba folklore and proverbs.
Provide rich, respectful, and educative historical explanations that honor the rich heritage of Idanre.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Explain the history, cultural significance, or folklore of: ${topic || 'The 682 stone steps and the ancient Idanre kingdom'}`,
      config: { systemInstruction },
    });

    res.json({ success: true, analysis: response.text });
  } catch (error: any) {
    console.error('Error in cultural-historian:', error);
    res.status(500).json({ error: error?.message || 'Failed to get historian response' });
  }
});

// AI Marketplace Assistant for pricing and product descriptions
app.post('/api/gemini/marketplace-assistant', async (req, res) => {
  try {
    const { productTitle, category, description } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Act as a professional marketplace copywriter and pricing advisor for Idanre traders.
Product Title: ${productTitle}
Category: ${category}
Initial Details: ${description}

Provide:
1. An engaging, professional commercial title and description optimized for local and online buyers.
2. Estimated fair market price range in Nigerian Naira (₦).
3. 3 selling highlights.`,
      config: {
        systemInstruction: 'You are an expert e-commerce and local trade advisor for Idanre farmers, artisans, and tech vendors.',
      },
    });

    res.json({ success: true, advice: response.text });
  } catch (error: any) {
    console.error('Error in marketplace-assistant:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate marketplace advice' });
  }
});

// AI Political Fact Checker & Civic Auditor
app.post('/api/gemini/fact-check', async (req, res) => {
  try {
    const { claim } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Audit this political or civic claim regarding Idanre development, representative promises, or public infrastructure:
Claim: "${claim}"

Provide:
1. Verdict: (Verified True / In Progress / False Claim / Misleading)
2. Detailed Civic Context & Fact Check explanation
3. Recommendation for community members.`,
      config: {
        systemInstruction: 'You are an objective, rigorous civic policy analyst and fact-checker for Ondo State local government projects.',
      },
    });

    res.json({ success: true, audit: response.text });
  } catch (error: any) {
    console.error('Error in fact-check:', error);
    res.status(500).json({ error: error?.message || 'Failed to complete fact check' });
  }
});

import http from 'http';

async function startServer() {
  const server = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Ok Idanre server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
