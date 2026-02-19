'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Briefcase, TrendingUp, ArrowRight, Loader2 } from 'lucide-react'

const financialMarketsJobs = [
  { id: 'sales', label: 'Sales' },
  { id: 'trading', label: 'Trader' },
  { id: 'quant', label: 'Quant' },
]

const corporateFinanceJobs = [
  { id: 'ib', label: 'Investment Banker' },
  { id: 'ma', label: 'Mergers & Acquisition' },
  { id: 'pe', label: 'Private Equity' },
  { id: 'advisory', label: 'Advisory' },
]

export default function ChooseCareerPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setLoading(false)
    }
    checkAuth()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#2563eb]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0a0f1a]/80 border-b border-[#1f2937]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/choose-career" className="logo text-base sm:text-xl">
            ESCP Finance +
          </Link>
        </div>
      </nav>

      <main className="pt-24 sm:pt-32 pb-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Choose Your Path
            </h1>
            <p className="text-[#9ca3af] text-base sm:text-lg max-w-2xl mx-auto">
              Select the area you want to prepare for. You can switch anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <Link
              href="/corporate-finance"
              className="bg-[#111827] border border-[#1f2937] rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:border-[#2563eb] transition-all duration-200 card-hover group"
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-[#2563eb]/20">
                <Briefcase className="w-7 h-7 text-[#2563eb]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3">Corporate Finance</h2>
              <p className="text-[#9ca3af] text-sm mb-4">
                Investment Banking, M&A, Private Equity, Advisory
              </p>
              <div className="space-y-2 mb-6">
                {corporateFinanceJobs.map((job) => (
                  <div key={job.id} className="flex items-center gap-2 text-sm text-[#6b7280]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
                    <span>{job.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-[#2563eb] group-hover:gap-3 transition-all">
                <span>Start Preparation</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </Link>

            <Link
              href="/select-block"
              className="bg-[#111827] border border-[#1f2937] rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:border-[#10b981] transition-all duration-200 card-hover group"
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-[#10b981]/20">
                <TrendingUp className="w-7 h-7 text-[#10b981]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3">Financial Markets</h2>
              <p className="text-[#9ca3af] text-sm mb-4">
                Sales, Trader, Quant
              </p>
              <div className="space-y-2 mb-6">
                {financialMarketsJobs.map((job) => (
                  <div key={job.id} className="flex items-center gap-2 text-sm text-[#6b7280]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                    <span>{job.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-[#10b981] group-hover:gap-3 transition-all">
                <span>Start Preparation</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
