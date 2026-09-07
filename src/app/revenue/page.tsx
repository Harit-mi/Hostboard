import RevenueDashboard from '@/components/revenue/RevenueDashboard'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function RevenuePage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      <header className="p-6 border-b border-slate-200 bg-white flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div>
          <div className="flex items-center mb-1">
            <Link href="/" className="text-slate-400 hover:text-slate-600 mr-4 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Financials & Payouts</h1>
          </div>
          <p className="text-sm text-slate-500 ml-9">Monthly revenue and fee breakdown per property.</p>
        </div>
      </header>

      <div className="p-6 max-w-6xl mx-auto">
        <RevenueDashboard />
      </div>
    </main>
  )
}
