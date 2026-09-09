'use client'

import React from 'react'
import { Booking, Property } from '@/lib/mockData'
import { differenceInCalendarDays, startOfDay, isSameDay } from 'date-fns'
import { CheckCircle2, AlertCircle } from 'lucide-react'

interface PropertyLaneProps {
  property: Property
  bookings: Booking[]
  startDate: Date
  endDate: Date
  onSelectBooking: (booking: Booking) => void
}

export default function PropertyLane({ property, bookings, startDate, endDate, onSelectBooking }: PropertyLaneProps) {
  const totalDays = differenceInCalendarDays(endDate, startDate) + 1

  return (
    <div className="flex bg-transparent group hover:bg-black/[0.02] smooth-transition border-b border-black/5 last:border-b-0 min-w-max">
      {/* Property Info (Sticky Left) */}
      <div className="w-[280px] shrink-0 border-r border-black/5 p-5 sticky left-0 bg-white/40 group-hover:bg-white/60 z-10 smooth-transition backdrop-blur-md">
        <h3 className="font-medium text-zinc-900 tracking-tight">{property.name}</h3>
        <div className="mt-2 flex items-center text-[11px] font-medium tracking-wide">
          {property.syncStatus === 'synced' ? (
            <span className="flex items-center text-zinc-500">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              Synced {property.lastSynced}
            </span>
          ) : (
            <span className="flex items-center text-rose-500">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
              Sync failed
            </span>
          )}
        </div>
      </div>

      {/* Timeline Area */}
      <div className="flex-1 flex relative">
        {/* Background Grid Cells */}
        {Array.from({ length: totalDays }).map((_, i) => {
          const currentDate = new Date(startDate)
          currentDate.setDate(startDate.getDate() + i)
          
          const endsToday = bookings.some(b => isSameDay(new Date(b.checkOut), currentDate))
          const startsToday = bookings.some(b => isSameDay(new Date(b.checkIn), currentDate))
          const isTurnover = endsToday && startsToday

          return (
            <div key={i} className="w-[80px] shrink-0 border-r border-black/[0.03] last:border-r-0 relative">
              {isTurnover && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-rose-500/0 via-rose-500/20 to-rose-500/0 flex flex-col items-center z-10 pointer-events-none">
                  <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-3 shadow-[0_0_8px_rgba(244,63,94,0.4)]" title="Same-day turnover" />
                </div>
              )}
            </div>
          )
        })}

        {/* Bookings */}
        {bookings.map((booking) => {
          const checkIn = startOfDay(new Date(booking.checkIn))
          const checkOut = startOfDay(new Date(booking.checkOut))
          
          const offsetDays = differenceInCalendarDays(checkIn, startDate)
          const durationDays = differenceInCalendarDays(checkOut, checkIn)
          
          const leftPercent = Math.max(0, (offsetDays / totalDays) * 100)
          let widthPercent = (durationDays / totalDays) * 100
          
          if (offsetDays < 0) {
            widthPercent += (offsetDays / totalDays) * 100
          }
          if (leftPercent + widthPercent > 100) {
            widthPercent = 100 - leftPercent
          }

          if (widthPercent <= 0) return null

          const isAirbnb = booking.platform === 'airbnb'
          const bgClass = isAirbnb 
            ? 'bg-[#FF5A5F] text-white shadow-sm shadow-[#FF5A5F]/20' 
            : 'bg-[#003580] text-white shadow-sm shadow-[#003580]/20'

          return (
            <div
              key={booking.id}
              onClick={() => onSelectBooking(booking)}
              className={`absolute top-3 bottom-3 rounded-full flex items-center px-4 cursor-pointer smooth-transition z-20 ${bgClass} hover:scale-[1.02] active:scale-[0.98] hover:shadow-md origin-left`}
              style={{
                left: `calc(${leftPercent}% + 6px)`,
                width: `calc(${widthPercent}% - 12px)`,
              }}
            >
              <div className="truncate text-xs font-medium tracking-wide w-full">
                {booking.guestName}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
