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
  ]

  return (
    <div className="flex h-screen w-screen bg-[#FAFAFA] overflow-hidden font-sans text-zinc-900 selection:bg-zinc-200">
      {/* Sleek Sidebar */}
      <nav className="w-[260px] bg-white border-r border-zinc-200 flex flex-col justify-between shrink-0 z-20 hidden md:flex">
        <div>
          {/* Brand */}
          <div className="h-16 flex items-center px-6 border-b border-zinc-100">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center mr-3 shadow-md shadow-zinc-900/20">
              <Home className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-bold text-zinc-900 tracking-tight">HostBoard</h1>
          </div>
          
          {/* Main Navigation */}
          <div className="p-4 space-y-1 mt-2">
            <div className="px-3 mb-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">Overview</div>
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 group ${
                    isActive 
                      ? 'bg-zinc-100/80 text-zinc-900' 
                      : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                  }`}
                >
                  <item.icon className={`w-[18px] h-[18px] mr-3 transition-colors ${isActive ? 'text-zinc-900' : 'text-zinc-400 group-hover:text-zinc-600'}`} strokeWidth={isActive ? 2.5 : 2} />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Bottom Profile */}
        <div className="p-4 border-t border-zinc-100">
          <div className="flex items-center p-2 rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer group">
            <img src="https://i.pravatar.cc/150?img=47" alt="User" className="w-9 h-9 rounded-full ring-2 ring-white shadow-sm" />
            <div className="ml-3">
              <p className="text-sm font-semibold text-zinc-900 group-hover:text-black">Jane Doe</p>
              <p className="text-[11px] font-medium text-zinc-500">Premium Host</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-4 sm:px-8 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-900 rounded-md hover:bg-zinc-100">
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search bookings, guests..." className="pl-9 pr-4 py-1.5 bg-zinc-100/50 border-transparent focus:bg-white focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/10 rounded-md text-sm w-64 transition-all outline-none" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-[#FAFAFA]">
          {children}
        </main>
      </div>
    </div>
  )
}
