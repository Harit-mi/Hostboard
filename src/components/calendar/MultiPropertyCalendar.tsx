'use client'

import React, { useState } from 'react'
import { eachDayOfInterval, format } from 'date-fns'
import { mockProperties, mockBookings, Booking } from '@/lib/mockData'
import PropertyLane from './PropertyLane'
import BookingPanel from './BookingPanel'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'

export default function MultiPropertyCalendar() {
  const [startDate, setStartDate] = useState(new Date('2023-10-07'))
  const [selectedBooking, setSelectedBooking] = useState<{ booking: Booking, propertyId: string } | null>(null)
  
  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 13)
  const days = eachDayOfInterval({ start: startDate, end: endDate })

  return (
    <div className="w-full h-full flex flex-col font-sans p-6 overflow-hidden max-w-[1600px] mx-auto relative">
      
      {/* Sleek Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 shrink-0 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-900 tracking-tight">Calendar</h1>
          <p className="text-sm text-zinc-500 mt-1">Timeline overview across all properties</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-white border border-black/5 rounded-full text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:shadow-sm smooth-transition flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2 opacity-50" />
            Today
          </button>
          <div className="flex bg-white border border-black/5 rounded-full shadow-sm p-1">
            <button className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 smooth-transition">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-4 py-1.5 text-sm font-medium text-zinc-900 flex items-center min-w-[130px] justify-center">
              {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
            </div>
            <button className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 smooth-transition">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Board Container */}
      <div className="flex-1 min-h-0 bg-white/50 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_32px_-12px_rgba(0,0,0,0.05)] border border-white overflow-hidden flex flex-col relative ring-1 ring-black/5">
        <div className="overflow-x-auto flex-1 flex flex-col hide-scrollbar relative">
          
          {/* Calendar Header / Date Axis */}
          <div className="flex border-b border-black/5 bg-white/80 sticky top-0 z-20 min-w-max backdrop-blur-md">
            <div className="w-[280px] shrink-0 border-r border-black/5 p-5 flex items-center sticky left-0 bg-white/80 z-30 backdrop-blur-md">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Property</span>
            </div>
            <div className="flex-1 flex">
              {days.map((day, i) => {
                const isToday = i === 0
                return (
                  <div key={day.toISOString()} className="w-[80px] shrink-0 border-r border-black/5 last:border-r-0 p-3 flex flex-col items-center justify-center">
                    <div className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest mb-1.5">{format(day, 'EEE')}</div>
                    <div className={`text-sm font-semibold w-8 h-8 flex items-center justify-center rounded-full smooth-transition ${isToday ? 'bg-zinc-900 text-white shadow-md' : 'text-zinc-900'}`}>
                      {format(day, 'd')}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Property Lanes */}
          <div className="flex-1 overflow-y-auto min-w-max pb-12">
            {mockProperties.map(property => (
              <PropertyLane 
                key={property.id}
                property={property}
                bookings={mockBookings.filter(b => b.propertyId === property.id)}
                startDate={startDate}
                endDate={endDate}
                onSelectBooking={(booking) => setSelectedBooking({ booking, propertyId: property.id })}
              />
            ))}
          </div>
        </div>

        {/* Slide-over Booking Panel */}
        {selectedBooking && (
          <BookingPanel 
            booking={selectedBooking.booking} 
            property={mockProperties.find(p => p.id === selectedBooking.propertyId)!}
            onClose={() => setSelectedBooking(null)} 
          />
        )}
      </div>
    </div>
  )
}
