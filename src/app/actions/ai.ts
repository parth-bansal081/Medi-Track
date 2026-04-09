'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/utils/supabase/server'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!)

export async function generateHealthTips() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data: appointments } = await supabase
    .from('appointments')
    .select(`
      date,
      time_slot,
      status, 
      type
    `)
    .eq('patient_id', user.id)
    .limit(5)

  const context = appointments?.length 
    ? `The patient has these recent/upcoming appointments: ${JSON.stringify(appointments)}.`
    : "The patient has no recent appointments."

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const prompt = `
      Based on the following patient context, generate 3 short, personalized wellness tips for their MediTrack dashboard.
      Context: ${context}
      
      Requirements:
      1. Each tip must be under 20 words.
      2. No medical diagnoses.
      3. Tips should be actionable (e.g., diet, hydration, exercise, mental prep for appointments).
      
      Return as a JSON array of strings ONLY. No other text.
      Example: ["Drink 8 glasses of water today", "Prepare list of questions for upcoming visit", "Take a 10 min walk"]
    `

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    const cleanedJson = responseText.replace(/```json|```/g, '').trim()
    
    return JSON.parse(cleanedJson) as string[]
  } catch (err) {
    console.error('Tips Generator Error:', err)
    return ["Stay hydrated for optimal health.", "Schedule regular checkups with your doctor.", "Check your MediTrack timeline for updates."]
  }
}
