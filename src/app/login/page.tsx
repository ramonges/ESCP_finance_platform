'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react'

const ESCP_EMAIL_DOMAIN = '@edu.escp.eu'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const errorParam = urlParams.get('error')
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
      window.history.replaceState({}, '', '/login')
    }

    async function checkSession() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          router.push('/choose-career')
          router.refresh()
        }
      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
        setCheckingSession(false)
      }
    }

    checkSession()
  }, [router, supabase])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const emailLower = email.trim().toLowerCase()
    if (!emailLower.endsWith(ESCP_EMAIL_DOMAIN)) {
      setError(`Only ESCP students can access this platform. Please use your @edu.escp.eu email address.`)
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: emailLower,
        password,
      })

      if (error) throw error

      router.push('/choose-career')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#2563eb]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center mb-8">
          <span className="logo text-2xl">ESCP Finance +</span>
        </Link>

        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
          <p className="text-[#9ca3af] text-center mb-8">Sign in with your ESCP student email</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280] pointer-events-none z-10" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@edu.escp.eu"
                  className="pr-4"
                  style={{ paddingLeft: '3.5rem' }}
                  required
                />
              </div>
              <p className="text-xs text-[#6b7280] mt-1">Only @edu.escp.eu addresses</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280] pointer-events-none z-10" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pr-4"
                  style={{ paddingLeft: '3.5rem' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-[#9ca3af] mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[#2563eb] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
