import TurnoverList from '@/components/turnovers/TurnoverList'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TurnoversPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      <header className="p-6 border-b border-slate-200 bg-white flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div>
          <div className="flex items-center mb-1">
            <Link href="/" className="text-slate-400 hover:text-slate-600 mr-4 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Turnovers & Cleaning</h1>
          </div>
          <p className="text-sm text-slate-500 ml-9">Manage schedules and assign cleaners.</p>
        </div>
      </header>

      <div className="p-6 max-w-5xl mx-auto">
        <TurnoverList />
      </div>
    </main>
  )
}
