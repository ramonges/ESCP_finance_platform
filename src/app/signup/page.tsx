'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, User, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

const ESCP_EMAIL_DOMAIN = '@edu.escp.eu'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const errorParam = urlParams.get('error')
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
      window.history.replaceState({}, '', '/signup')
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

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const emailLower = email.trim().toLowerCase()
    if (!emailLower.endsWith(ESCP_EMAIL_DOMAIN)) {
      setError(`Only ESCP students can create an account. Please use your @edu.escp.eu email address.`)
      setLoading(false)
      return
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: emailLower,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/choose-career`,
        },
      })

      if (signUpError) throw signUpError

      if (data.user && !data.session) {
        setSuccess(true)
      } else if (data.session) {
        router.push('/choose-career')
        router.refresh()
      }
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

  if (success) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="block text-center mb-8">
            <span className="logo text-2xl">ESCP Finance +</span>
          </Link>

          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Check your email</h1>
            <p className="text-[#9ca3af] mb-6">
              We&apos;ve sent a confirmation link to <span className="text-[#2563eb]">{email}</span>. 
              Click the link to activate your account.
            </p>
            <Link href="/login" className="btn-secondary inline-block">
              Back to Login
            </Link>
          </div>
        </div>
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
          <h1 className="text-2xl font-bold text-center mb-2">Create Account</h1>
          <p className="text-[#9ca3af] text-center mb-8">ESCP students only — use your @edu.escp.eu email</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280] pointer-events-none z-10" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="pr-4"
                  style={{ paddingLeft: '3.5rem' }}
                  required
                />
              </div>
            </div>

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
                  minLength={6}
                  required
                />
              </div>
              <p className="text-xs text-[#6b7280] mt-1">Minimum 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-[#9ca3af] mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-[#2563eb] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
