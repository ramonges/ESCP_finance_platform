'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Briefcase, TrendingUp, ChevronRight, GraduationCap, Target } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/choose-career')
      }
    }
    checkAuth()
  }, [router, supabase])

  return (
    <div className="min-h-screen gradient-bg">
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0a0f1a]/80 border-b border-[#1f2937]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="logo text-base sm:text-xl">
            ESCP Finance +
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/login" className="btn-secondary text-xs sm:text-sm py-1.5 sm:py-2 px-3 sm:px-5">
              Log In
            </Link>
            <Link href="/signup" className="btn-primary text-xs sm:text-sm py-1.5 sm:py-2 px-3 sm:px-5">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#111827] border border-[#1f2937] mb-6 sm:mb-8 fade-in">
            <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 text-[#2563eb]" />
            <span className="text-xs sm:text-sm text-[#9ca3af]">Exclusive to ESCP Students</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 fade-in stagger-1">
            <span className="gradient-text">Interview Prep</span>
            <br />
            <span className="text-[#e8eaed]">Corporate Finance & Financial Markets</span>
          </h1>
          
          <p className="text-base sm:text-xl text-[#9ca3af] max-w-3xl mx-auto mb-8 sm:mb-10 fade-in stagger-2 leading-relaxed px-2">
            The official platform for ESCP students to prepare for interviews in Corporate Finance 
            and Financial Markets. Practice with real questions, master key concepts, and land your dream role.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 fade-in stagger-3">
            <Link href="/signup" className="btn-primary flex items-center gap-2 text-base sm:text-lg w-full sm:w-auto justify-center">
              Get Started
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="btn-secondary flex items-center gap-2 text-base sm:text-lg w-full sm:w-auto justify-center">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 px-4 sm:px-6 border-t border-[#1f2937]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6">Two Career Paths</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6 text-left">
              <Briefcase className="w-10 h-10 text-[#2563eb] mb-4" />
              <h3 className="text-lg font-semibold mb-2">Corporate Finance</h3>
              <p className="text-[#9ca3af] text-sm mb-4">
                Investment Banking, M&A, Private Equity, Advisory
              </p>
              <p className="text-[#6b7280] text-xs">
                Preparation blocks and mock interviews for corporate finance roles
              </p>
            </div>
            <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6 text-left">
              <TrendingUp className="w-10 h-10 text-[#10b981] mb-4" />
              <h3 className="text-lg font-semibold mb-2">Financial Markets</h3>
              <p className="text-[#9ca3af] text-sm mb-4">
                Sales, Trader, Quant
              </p>
              <p className="text-[#6b7280] text-xs">
                Practice blocks for trading, sales, quant, assets & strategies
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 px-4 sm:px-6 border-t border-[#1f2937]">
        <div className="max-w-4xl mx-auto text-center">
          <Target className="w-8 h-8 text-[#2563eb] mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Built for ESCP</h2>
          <p className="text-[#9ca3af] text-base sm:text-lg leading-relaxed">
            Every question comes from real interview experiences of ESCP students and alumni 
            across top investment banks, hedge funds, and advisory firms.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20 px-4 sm:px-6 border-t border-[#1f2937]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Ready to Ace Your Interview?
          </h2>
          <p className="text-[#9ca3af] text-base sm:text-lg mb-6 sm:mb-8">
            Join your ESCP peers preparing for their dream roles.
          </p>
          <Link href="/signup" className="btn-primary inline-flex items-center gap-2 text-base sm:text-lg">
            Get Started Now
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-[#1f2937]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="logo">
            ESCP Finance +
          </Link>
          <p className="text-[#6b7280] text-sm">
            © {new Date().getFullYear()} ESCP Finance +. For ESCP students only.
          </p>
        </div>
      </footer>
    </div>
  )
}
