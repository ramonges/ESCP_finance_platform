'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import DashboardNav from '@/components/DashboardNav'
import { Profile } from '@/types'
import { ArrowRight, Loader2, Handshake, PiggyBank, FileText, Mic } from 'lucide-react'

const preparationBlocks = [
  { id: 'ma', title: 'M&A', icon: Handshake, color: '#2563eb', description: 'Mergers & Acquisitions preparation' },
  { id: 'pe', title: 'Private Equity', icon: PiggyBank, color: '#10b981', description: 'Private Equity interview prep' },
  { id: 'advisory', title: 'Advisory', icon: FileText, color: '#8b5cf6', description: 'Advisory & restructuring' },
]

export default function CorporateFinancePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function initialize() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) setProfile(profileData)
      setLoading(false)
    }
    initialize()
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
      <DashboardNav profile={profile} onOpenStats={() => {}} blockType={null} />

      <main className="pt-16 sm:pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/choose-career" className="inline-flex items-center gap-2 text-[#9ca3af] hover:text-white mb-8 text-sm">
            ← Back to career choice
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Corporate Finance</h1>
          <p className="text-[#9ca3af] mb-12">Prepare for Investment Banking, M&A, Private Equity & Advisory interviews</p>

          {/* Preparation Section */}
          <section className="mb-16">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Preparation</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {preparationBlocks.map((block) => {
                const Icon = block.icon
                return (
                  <div
                    key={block.id}
                    className="bg-[#111827] border border-[#1f2937] rounded-xl p-6 hover:border-[#374151] transition-all cursor-not-allowed opacity-80"
                    title="Coming soon"
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${block.color}20` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: block.color }} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{block.title}</h3>
                    <p className="text-[#9ca3af] text-sm">{block.description}</p>
                    <p className="text-[#6b7280] text-xs mt-2">Coming soon</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Mock Interviews Section */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Mock Interviews</h2>
            <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6 sm:p-8 hover:border-[#374151] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#2563eb]/20 flex items-center justify-center flex-shrink-0">
                  <Mic className="w-7 h-7 text-[#2563eb]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">Mock Interviews</h3>
                  <p className="text-[#9ca3af] text-sm">
                    Practice full interview simulations for Corporate Finance roles
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-[#6b7280] flex-shrink-0" />
              </div>
              <p className="text-[#6b7280] text-xs mt-4">Coming soon</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
