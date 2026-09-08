'use client'

import React, { useState } from 'react'
import { eachDayOfInterval, format } from 'date-fns'
import { properties, bookings, Booking } from '@/lib/mockData'
import PropertyLane from './PropertyLane'
import BookingPanel from './BookingPanel'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'

export default function MultiPropertyCalendar() {
  const [startDate, setStartDate] = useState(new Date('2023-10-07'))
  const [selectedBooking, setSelectedBooking] = useState<{ booking: Booking, propertyId: string } | null>(null)
  
  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 13) // Show 14 days
  const days = eachDayOfInterval({ start: startDate, end: endDate })

  return (
    <div className="w-full h-full flex flex-col font-sans p-6 overflow-hidden max-w-[1600px] mx-auto">
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 shrink-0 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Calendar Board</h1>
          <p className="text-sm text-zinc-500 mt-1">Multi-Property timeline view</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 bg-white border border-zinc-200 rounded-md text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors shadow-sm flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Today
          </button>
          <div className="flex bg-white border border-zinc-200 rounded-md shadow-sm">
            <button className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-colors border-r border-zinc-200">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="px-4 py-1.5 text-sm font-medium text-zinc-900 flex items-center min-w-[140px] justify-center">
              {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
            </div>
            <button className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-colors border-l border-zinc-200">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Board Container */}
      <div className="flex-1 min-h-0 bg-white rounded-xl shadow-[0_2px_20px_-8px_rgba(0,0,0,0.1)] border border-zinc-200 overflow-hidden flex flex-col relative">
        <div className="overflow-x-auto flex-1 flex flex-col hide-scrollbar">
          {/* Calendar Header / Date Axis */}
          <div className="flex border-b border-zinc-200 bg-zinc-50/80 sticky top-0 z-20 min-w-max">
            <div className="w-[280px] shrink-0 border-r border-zinc-200 p-4 flex items-center sticky left-0 bg-zinc-50/80 z-30 backdrop-blur-sm">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Property</span>
            </div>
            <div className="flex-1 flex">
              {days.map((day, i) => {
                const isToday = i === 0 // Mock today for visual
                return (
                  <div key={day.toISOString()} className="w-[80px] shrink-0 border-r border-zinc-200 last:border-r-0 p-2 flex flex-col items-center justify-center">
                    <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-1">{format(day, 'EEE')}</div>
                    <div className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-zinc-900 text-white' : 'text-zinc-900'}`}>
                      {format(day, 'd')}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Property Lanes */}
          <div className="flex-1 overflow-y-auto min-w-max">
            {properties.map(property => (
              <PropertyLane 
                key={property.id}
                property={property}
                bookings={bookings.filter(b => b.propertyId === property.id)}
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
            property={properties.find(p => p.id === selectedBooking.propertyId)!}
            onClose={() => setSelectedBooking(null)} 
          />
        )}
      </div>
    </div>
  )
}
