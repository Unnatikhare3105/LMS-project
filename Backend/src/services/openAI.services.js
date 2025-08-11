import CustomError from "../utils/customError.js";
import { GoogleGenAI } from "@google/genai";
import config from "../config/config.js";
import { google } from "googleapis";

const ai = new GoogleGenAI({
  apiKey: config.google_gemini_api_key,
});

const genAI_model = "gemini-2.0-flash";

export const getDetailedExplanation = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: genAI_model,
      contents: prompt,
    });
    console.log("response", response.text);
    return response.text;
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
};

export const getVideoLinks = async (topicForLink, maxResults = 10) => {
  const youtube = google.youtube({
    version: "v3",
    auth: config.youtube_api_key,
  });

  if (!topicForLink) {
    console.error("Topic is required for YouTube search.");
    return [];
  }

  try {
    const response = await youtube.search.list({
      part: "id,snippet",
      q: topicForLink,
      maxResults,
      type: "video",
      videoEmbeddable: "true",
    });

    const items = response.data.items;

    const videos = items.map((item) => ({
      title: item.snippet.title,
      videoId: item.id.videoId,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails.medium.url,
    }));

    return videos;
  } catch (error) {
    console.log("YouTube Search Error:", error.message);
    return [];
  }
};

export const generateQuestionsByAI = async (topic, numQuestions) => {
  if (!topic || !numQuestions) {
    throw new CustomError("Invalid input parameters", 400);
  }
  // Prepare prompt for Gemini to generate multiple-choice questions
  const prompt = [
    {
      role: "user",
      parts: [
        {
          text: `Generate ${numQuestions} unique multiple-choice questions on the topic "${topic}". 
Each question should have 4 options (A, B, C, D) and indicate the correct answer. 
Format as a JSON array like:
[
  {
    "question": "...",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "answer": "A"
  },
  ...
]`
        }
      ]
    }
  ];
  try {
    const response = await ai.models.generateContent({
      model: genAI_model,
      contents: prompt,
    });
    // Remove code block markers if present
    let aiResponse = response.text;
    if (typeof aiResponse === 'string') {
      aiResponse = aiResponse.trim();
      if (aiResponse.startsWith('```json')) {
        aiResponse = aiResponse.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (aiResponse.startsWith('```')) {
        aiResponse = aiResponse.replace(/^```/, '').replace(/```$/, '').trim();
      }
    }

    let questionsArray;
    try {
      questionsArray = JSON.parse(aiResponse);
    } catch (parseErr) {
      console.error("Failed to parse AI response as JSON:", parseErr, aiResponse);
      throw new CustomError("Failed to parse AI response as JSON", 500);
    }

    // Each question as { question, options, answer }
    const formattedQuestions = questionsArray.map(q => ({
      question: q.question,
      options: q.options,
      answer: q.answer
    }));
    return { allQuestions: formattedQuestions };
  } catch (error) {
    console.error("Error generating questions:", error);
    throw new CustomError("Failed to generate questions", 500);
  }
};
