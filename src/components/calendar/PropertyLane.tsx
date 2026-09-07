'use client'

import React, { useState } from 'react'
import { format, isSameDay, isWithinInterval, startOfDay, endOfDay, differenceInDays } from 'date-fns'
import { Property, Booking } from '@/lib/mockData'
import { AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react'
import BookingPanel from './BookingPanel'

interface PropertyLaneProps {
  property: Property
  bookings: Booking[]
  days: Date[]
}

export default function PropertyLane({ property, bookings, days }: PropertyLaneProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  // Find same-day turnovers
  const checkOuts = bookings.map(b => format(b.checkOut, 'yyyy-MM-dd'))
  const checkIns = bookings.map(b => format(b.checkIn, 'yyyy-MM-dd'))
  const sameDayTurnovers = checkOuts.filter(date => checkIns.includes(date))

  return (
    <div className="flex bg-white group hover:bg-slate-50/50 transition-colors">
      {/* Property Info Sidebar */}
      <div className="w-64 shrink-0 border-r border-slate-200 p-4">
        <h3 className="font-medium text-slate-900">{property.name}</h3>
        
        {/* Sync Status Indicator */}
        <div className="mt-2 flex items-center text-xs">
          {property.lastSyncStatus === 'success' ? (
            <span className="flex items-center text-slate-500">
              <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" />
              Synced {property.lastSyncedAt ? format(property.lastSyncedAt, 'h:mm a') : ''}
            </span>
          ) : property.lastSyncStatus === 'failed' ? (
            <span className="flex items-center text-rose-600 font-medium bg-rose-50 px-2 py-1 rounded-md -ml-2">
              <AlertCircle className="w-3 h-3 mr-1" />
              Sync failed
            </span>
          ) : (
            <span className="flex items-center text-slate-500">
              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              Syncing...
            </span>
          )}
        </div>
      </div>

      {/* Days Grid */}
      <div className="flex-1 flex relative">
        {days.map((day, i) => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const isTurnover = sameDayTurnovers.includes(dateStr)
          
          return (
            <div key={dateStr} className="flex-1 min-w-[60px] border-r border-slate-200 last:border-r-0 relative">
              {/* Turnover Indicator */}
              {isTurnover && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-rose-200/50 flex flex-col items-center z-10 pointer-events-none">
                  <div className="w-2 h-2 bg-rose-500 rounded-full mt-1 shadow-sm shadow-rose-200" title="Same-day turnover" />
                </div>
              )}
            </div>
          )
        })}

        {/* Bookings Overlay */}
        {bookings.map(booking => {
          // Calculate positions
          const startIdx = days.findIndex(d => isSameDay(d, booking.checkIn))
          const endIdx = days.findIndex(d => isSameDay(d, booking.checkOut))
          
          // Skip if outside view
          if (endIdx < 0 && startIdx < 0 && !isWithinInterval(days[0], { start: booking.checkIn, end: booking.checkOut })) return null

          const actualStartIdx = Math.max(0, startIdx)
          const actualEndIdx = endIdx === -1 ? days.length : endIdx
          
          const length = actualEndIdx - actualStartIdx
          if (length <= 0) return null

          const isStartVisible = startIdx >= 0
          const isEndVisible = endIdx >= 0

          // Platform colors
          const colors = {
            airbnb: 'bg-rose-500 hover:bg-rose-600 text-white',
            vrbo: 'bg-indigo-600 hover:bg-indigo-700 text-white',
            bookingcom: 'bg-sky-600 hover:bg-sky-700 text-white',
            direct: 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }

          return (
            <div
              key={booking.id}
              onClick={() => setSelectedBooking(booking)}
              className={`absolute top-2 bottom-2 rounded-md shadow-sm flex items-center px-3 cursor-pointer transition-colors z-20 ${colors[booking.platformSource]} ${!isStartVisible ? 'rounded-l-none border-l border-white/20' : ''} ${!isEndVisible ? 'rounded-r-none border-r border-white/20' : ''}`}
              style={{
                left: `calc(${(actualStartIdx / days.length) * 100}% + 4px)`,
                width: `calc(${(length / days.length) * 100}% - 8px)`
              }}
            >
              <div className="truncate text-xs font-medium w-full">
                {booking.guestName}
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Inline Booking Panel */}
      {selectedBooking && (
        <BookingPanel 
          booking={selectedBooking} 
          property={property}
          onClose={() => setSelectedBooking(null)} 
        />
      )}
    </div>
  )
}
