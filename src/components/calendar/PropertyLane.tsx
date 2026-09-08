'use client'

import React, { useState } from 'react'
import { format, isSameDay, isWithinInterval, startOfDay, endOfDay, differenceInDays } from 'date-fns'
import { Property, Booking } from '@/lib/mockData'
import { AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react'
import BookingPanel from './BookingPanel'

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
    <div className="flex bg-white group hover:bg-zinc-50/50 transition-colors border-b border-zinc-100 last:border-b-0 min-w-max">
      {/* Property Info (Sticky Left) */}
      <div className="w-[280px] shrink-0 border-r border-zinc-200 p-4 sticky left-0 bg-white group-hover:bg-zinc-50/50 z-10">
        <h3 className="font-semibold text-zinc-900">{property.name}</h3>
        <div className="mt-1.5 flex items-center text-[11px] font-medium tracking-wide">
          {property.syncStatus === 'synced' ? (
            <span className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100/50">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Synced {property.lastSynced}
            </span>
          ) : (
            <span className="flex items-center text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100/50">
              <AlertCircle className="w-3 h-3 mr-1" />
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
          
          // Check for same-day turnover
          const endsToday = bookings.some(b => isSameDay(new Date(b.checkOut), currentDate))
          const startsToday = bookings.some(b => isSameDay(new Date(b.checkIn), currentDate))
          const isTurnover = endsToday && startsToday

          return (
            <div key={i} className="w-[80px] shrink-0 border-r border-zinc-100 last:border-r-0 relative">
              {isTurnover && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-rose-500/20 flex flex-col items-center z-10 pointer-events-none">
                  <div className="w-2.5 h-2.5 bg-rose-500 rounded-full mt-2 shadow-sm shadow-rose-200 ring-2 ring-white" title="Same-day turnover" />
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
            ? 'bg-[#FF5A5F] hover:bg-[#E04B50]' 
            : 'bg-[#003580] hover:bg-[#002255]'

          return (
            <div
              key={booking.id}
              onClick={() => onSelectBooking(booking)}
              className={`absolute top-2.5 bottom-2.5 rounded-md shadow-sm flex items-center px-3 cursor-pointer transition-all z-20 ${bgClass} text-white hover:shadow-md ring-1 ring-black/5 hover:-translate-y-[1px]`}
              style={{
                left: `calc(${leftPercent}% + 4px)`,
                width: `calc(${widthPercent}% - 8px)`,
              }}
            >
              <div className="truncate text-xs font-semibold tracking-wide w-full flex items-center justify-between">
                <span>{booking.guestName}</span>
              </div>
            </div>
          )
        })}
      </div>
      )}
    </div>
  )
}
