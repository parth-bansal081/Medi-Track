'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { ShieldAlert, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data: { user }, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) {
      setError(loginError.message)
      setLoading(false)
    } else if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      if (profile?.role !== 'admin') {
         setError('Access Denied: You do not have administrator privileges.')
         await supabase.auth.signOut()
         setLoading(false)
      } else {
         router.push('/dashboard/admin')
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-900">
      <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
        {/* Top Accent */}
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-900" />
        
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-900">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Portal</h1>
          <p className="text-slate-500 font-medium">Internal System Access Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Admin Identity</label>
            <input
              type="email"
              required
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:outline-none focus:border-slate-900 transition-all font-medium text-slate-900"
              placeholder="admin@pharmatech.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Secure Key</label>
            <input
              type="password"
              required
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:outline-none focus:border-slate-900 transition-all font-medium text-slate-900"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                <p className="text-red-600 text-sm font-bold flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    {error}
                </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'AUTHENTICATE'}
          </button>
        </form>

        <div className="mt-10 pt-10 border-t border-slate-50 flex justify-center">
            <Link href="/" className="text-slate-400 hover:text-slate-900 flex items-center gap-2 text-sm font-bold transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Return to Public Site
            </Link>
        </div>
      </div>
      
      <p className="mt-8 text-slate-500 text-xs font-mono uppercase tracking-[0.2em]">
        Authorized Personnel Only • PharmaTech v1.0
      </p>
    </div>
  )
}
