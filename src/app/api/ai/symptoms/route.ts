import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!)

export async function POST(req: Request) {
  try {
    const { symptoms } = await req.json()

    if (!symptoms) {
      return NextResponse.json({ error: 'Symptoms are required' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `
      Act as a high-precision medical analysis AI for MediTrack. 
      Analyze the following patient symptoms and return a structured JSON response.
      
      Patient Symptoms: "${symptoms}"
      
      Rules:
      1. Be objective but empathetic.
      2. Urgency_Level must be a number from 1 (Low) to 10 (Critical).
      3. Recommended_Specialty must be a single string matching standard medical categories (e.g., Cardiologist, Dermatologist, General Practitioner, Pediatrician, Neurologist, Psychiatrist).
      4. If symptoms are life-threatening (e.g., chest pain, difficulty breathing), Urgency_Level must be 9 or 10.
      
      The response MUST be a valid JSON object with EXACTLY these keys:
      {
        "Possible_Conditions": ["string", "string"],
        "Urgency_Level": number,
        "Recommended_Specialty": "string",
        "Safety_Advice": "string"
      }
      
      JSON ONLY. No other text.
    `

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    const cleanedJson = responseText.replace(/```json|```/g, '').trim()
    const parsedData = JSON.parse(cleanedJson)

    return NextResponse.json(parsedData)
  } catch (error) {
    console.error('AI Analysis Error:', error)
    return NextResponse.json({ error: 'Failed to analyze symptoms' }, { status: 500 })
  }
}
