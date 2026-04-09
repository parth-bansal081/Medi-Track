'use client'

import { useState } from 'react'
import { 
  Send, 
  Bot, 
  User as UserIcon, 
  AlertTriangle, 
  Activity, 
  Search,
  ArrowRight,
  Loader2,
  Stethoscope
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

interface AIResponse {
  Possible_Conditions: string[]
  Urgency_Level: number
  Recommended_Specialty: string
  Safety_Advice: string
}

export default function SymptomCheckerPage() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AIResponse | null>(null)
  const [matchedDoctors, setMatchedDoctors] = useState<any[]>([])
  const supabase = createClient()

  const analyzeSymptoms = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setLoading(true)
    setResult(null)
    setMatchedDoctors([])

    try {
      const resp = await fetch('/api/ai/symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: input }),
      })

      const data = await resp.json()
      setResult(data)

      // Smart Doctor Matching
      if (data.Recommended_Specialty) {
        const { data: doctors } = await supabase
          .from('profiles')
          .select(`
            id,
            full_name,
            doctors (
              specialty,
              is_approved
            )
          `)
          .eq('role', 'doctor')
          .ilike('doctors.specialty', `%${data.Recommended_Specialty}%`)
          .limit(3)

        setMatchedDoctors(doctors || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10 flex flex-col">
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
        <header className="mb-10 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                    <Bot className="w-8 h-8 text-indigo-600" />
                    AI Health Intelligence
                </h1>
                <p className="text-gray-500 font-medium">Identify potential health issues and match with the right experts.</p>
            </div>
            <Link href="/dashboard/patient" className="text-sm font-bold text-indigo-600 hover:underline">Back to Dashboard</Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 flex-1">
            {/* Chat Interface */}
            <div className="lg:col-span-2 flex flex-col space-y-6">
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
                    <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">Conversational Symptom Analysis</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Active System</span>
                        </div>
                    </div>

                    <div className="flex-1 p-8 overflow-y-auto space-y-6">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 flex-shrink-0">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div className="bg-gray-50 p-5 rounded-2xl rounded-tl-none max-w-[80%]">
                                <p className="text-sm font-medium text-gray-700 leading-relaxed">
                                    Hello! I'm your AI health assistant. Please describe your symptoms in detail (e.g., location, duration, severity) to help me analyze the situation.
                                </p>
                            </div>
                        </div>

                        {result && (
                            <>
                                <div className="flex gap-4 justify-end">
                                    <div className="bg-indigo-600 p-5 rounded-2xl rounded-tr-none max-w-[80%] text-white">
                                        <p className="text-sm font-medium leading-relaxed">{input}</p>
                                    </div>
                                    <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                                        <UserIcon className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 flex-shrink-0">
                                        <Bot className="w-5 h-5" />
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl rounded-tl-none max-w-[90%] space-y-4">
                                        <h4 className="font-bold text-gray-900">Analysis Complete</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Possible Conditions</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {result.Possible_Conditions.map((c, i) => (
                                                        <span key={i} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700">{c}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Safety Advice</p>
                                                <p className="text-sm text-gray-600 leading-relaxed">{result.Safety_Advice}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {loading && (
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 flex-shrink-0">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div className="bg-gray-50 p-5 rounded-2xl rounded-tl-none flex items-center gap-3">
                                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                                    <p className="text-sm font-black text-indigo-600 uppercase tracking-widest">Analyzing Symptoms...</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={analyzeSymptoms} className="p-8 border-t border-gray-50 bg-gray-50/50 flex gap-4">
                        <input 
                            type="text" 
                            disabled={loading}
                            placeholder="Type your symptoms here..."
                            className="flex-1 bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/10 transition-all shadow-sm"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button 
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="bg-indigo-600 text-white p-4 rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>

                <footer className="text-center py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-t border-gray-100 mt-auto">
                    NOT A MEDICAL DIAGNOSIS. FOR INFORMATIONAL PURPOSES ONLY.
                </footer>
            </div>

            {/* AI Insights & Matches */}
            <div className="space-y-10">
                {/* Urgency Meter */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">Urgency Meter</h3>
                    
                    <div className="relative pt-10 px-4">
                        {/* Semi-circle Gauge */}
                        <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden flex">
                            <div className="h-full bg-green-500 flex-1" />
                            <div className="h-full bg-amber-500 flex-1" />
                            <div className="h-full bg-red-500 flex-1" />
                        </div>
                        
                        {/* Needle */}
                        <div 
                            className="absolute top-6 transition-all duration-1000 ease-out"
                            style={{ 
                                left: result ? `${(result.Urgency_Level / 10) * 100}%` : '0%',
                                transform: 'translateX(-50%)'
                            }}
                        >
                            <div className="flex flex-col items-center">
                                <div className="text-sm font-black text-gray-900 mb-2">{(result?.Urgency_Level || 0) * 10}%</div>
                                <div className="w-4 h-4 bg-gray-900 border-4 border-white rounded-full shadow-lg" />
                            </div>
                        </div>

                        <div className="flex justify-between mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <span>Low</span>
                            <span>Moderate</span>
                            <span>Critical</span>
                        </div>
                    </div>
                </div>

                {/* Smart Doctor Matching */}
                {result && (
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 animate-in slide-in-from-bottom duration-500">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Smart Match</h3>
                            <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-md">
                                {result.Recommended_Specialty}
                            </span>
                        </div>

                        <div className="space-y-4">
                            {matchedDoctors.length > 0 ? (
                                matchedDoctors.map((doc, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-white hover:shadow-xl hover:border-indigo-100 border border-transparent transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-300 font-bold">
                                                <Stethoscope className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900 leading-none">{doc.full_name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Available Today</p>
                                            </div>
                                        </div>
                                        <Link href="/search" className="p-2 bg-white rounded-lg text-gray-300 group-hover:text-indigo-600 transition-colors">
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-xs font-bold text-gray-400">No matching specialists found in your area.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                {!result && (
                    <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                            <Activity className="w-8 h-8" />
                        </div>
                        <h4 className="text-lg font-black mb-2 tracking-tight">System Ready</h4>
                        <p className="text-indigo-100 text-sm font-medium leading-relaxed">
                            Start typing your symptoms to activate the urgency meter and expert matching engine.
                        </p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  )
}
