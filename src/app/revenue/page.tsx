import RevenueDashboard from '@/components/revenue/RevenueDashboard'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function RevenuePage() {
  return (
    <div className="h-full w-full p-6 font-sans overflow-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Financials & Payouts</h1>
        <p className="text-sm text-slate-500 mt-1">Monthly revenue and fee breakdown per property.</p>
      </div>

      <div className="max-w-6xl mx-auto">
        <RevenueDashboard />
      </div>
    </div>
  )
}
