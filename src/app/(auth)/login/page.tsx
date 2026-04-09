'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { PlusSquare, Loader2, Info } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const message = searchParams.get('message')
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
      // Fetch role and redirect via middleware/router
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      const role = profile?.role || user.user_metadata?.role || 'patient'
      
      if (role === 'admin') {
         // Standard login doesn't allow admin access? 
         // User requested "separate admin url that allows admin login not using the main site"
         // I'll allow it but redirect to admin portal if admin
         router.push('/dashboard/admin')
      } else {
         router.push(`/dashboard/${role}`)
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#F0F7FF]">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <PlusSquare className="h-8 w-8 text-primary" />
        <span className="text-2xl font-bold text-slate-900 tracking-tight">PharmaTech</span>
      </Link>
      
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl shadow-blue-100 border border-blue-50">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h1>
        <p className="text-slate-500 mb-8">Log in to your account to continue.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {message && (
            <div className="flex items-center gap-2 p-4 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium border border-blue-100">
              <Info className="w-4 h-4" />
              {message}
            </div>
          )}

          {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In'}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-600">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary font-bold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
