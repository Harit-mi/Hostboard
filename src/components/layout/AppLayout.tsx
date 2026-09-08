'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, Sparkles, LineChart, Home, Users, Settings } from 'lucide-react'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    { name: 'Calendar', href: '/', icon: CalendarDays },
    { name: 'Turnovers', href: '/turnovers', icon: Sparkles },
    { name: 'Revenue', href: '/revenue', icon: LineChart },
  ]

  const secondaryNav = [
    { name: 'Properties', href: '#', icon: Home },
    { name: 'Team', href: '#', icon: Users },
    { name: 'Settings', href: '#', icon: Settings },
  ]

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 shadow-sm z-20 relative">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-sm shadow-indigo-200">
              <Home className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">HostBoard</h1>
          </div>
          
          <div className="p-4 space-y-1">
            <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Operations</div>
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100 border border-indigo-100/50' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              )
            })}
          </div>

          <div className="p-4 space-y-1 mt-4">
            <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Configuration</div>
            {secondaryNav.map((item) => (
              <a key={item.name} href={item.href}
                className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors opacity-70 hover:opacity-100"
              >
                <item.icon className="w-4 h-4 mr-3 text-slate-400" />
                {item.name}
              </a>
            ))}
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-200">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-semibold shadow-sm text-sm">
              JD
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-900">Jane Doe</p>
              <p className="text-xs text-slate-500">Premium Host</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-slate-50/50">
        {children}
      </main>
    </div>
  )
}
