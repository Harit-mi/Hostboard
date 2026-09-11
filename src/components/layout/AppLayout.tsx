'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, Sparkles, LineChart, Home, Users, Settings, Bell, Search, Menu } from 'lucide-react'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  const navItems = [
    { name: 'Calendar', href: '/', icon: CalendarDays },
    { name: 'Turnovers', href: '/turnovers', icon: Sparkles },
    { name: 'Revenue', href: '/revenue', icon: LineChart },
    { name: 'Guests', href: '/guests', icon: Users },
  ]

  return (
    <div className="flex h-screen bg-[#FAFAFA] font-sans selection:bg-zinc-900 selection:text-white">
      {/* Sidebar - Sleek Glass */}
      <aside className="w-64 glass-panel border-r border-black/5 hidden md:flex flex-col relative z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center text-white font-bold text-lg shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
            H
          </div>
          <span className="font-semibold text-zinc-900 text-lg tracking-tight">HostBoard</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-full smooth-transition text-sm font-medium ${
                  isActive 
                    ? 'bg-zinc-900 text-white shadow-md shadow-zinc-900/10' 
                    : 'text-zinc-500 hover:bg-zinc-100/80 hover:text-zinc-900'
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-zinc-200' : 'text-zinc-400'}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-black/5 pb-10">
          <button className="flex items-center gap-3 px-3 py-2 w-full text-zinc-500 hover:text-zinc-900 smooth-transition text-sm font-medium rounded-full hover:bg-zinc-100/80">
            <Settings className="w-4 h-4 text-zinc-400" />
            Settings
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header - Glass */}
        <header className="h-16 glass-panel border-b border-black/5 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center md:hidden">
            <button className="p-2 -ml-2 text-zinc-500 hover:text-zinc-900">
              <Menu className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 flex justify-end md:justify-between items-center">
            <div className="hidden md:flex items-center bg-zinc-100/80 rounded-full px-3 py-1.5 border border-transparent focus-within:border-zinc-300 focus-within:bg-white smooth-transition w-72">
              <Search className="w-4 h-4 text-zinc-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search bookings, guests..." 
                className="bg-transparent border-none outline-none text-sm w-full text-zinc-900 placeholder:text-zinc-400"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 text-zinc-400 hover:text-zinc-900 smooth-transition rounded-full hover:bg-zinc-100">
                <Bell className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-200 to-zinc-300 border border-black/10"></div>
            </div>
          </div>
        </header>

        {/* Page Canvas */}
        <main className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden relative">
          {/* Subtle gradient orb for visual flair */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-zinc-200/40 rounded-full blur-3xl -z-10 pointer-events-none opacity-50" />
          {children}
        </main>
      </div>
    </div>
  )
}
