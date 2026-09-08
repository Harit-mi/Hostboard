'use client'

import React, { useState } from 'react'
import { eachDayOfInterval, addDays, format, isSameDay } from 'date-fns'
import { mockProperties, mockBookings, Property, Booking } from '@/lib/mockData'
import PropertyLane from './PropertyLane'

export default function MultiPropertyCalendar() {
  const [startDate] = useState(new Date()) // Today
  const endDate = addDays(startDate, 13) // 2-week view
  const days = eachDayOfInterval({ start: startDate, end: endDate })

  return (
    <div className="w-full h-full flex flex-col font-sans p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Calendar Board</h1>
          <p className="text-sm text-slate-500 mt-1">Multi-Property timeline view</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-200">
        <div className="min-w-[1000px] flex flex-col h-full">
          {/* Calendar Header / Date Axis */}
          <div className="flex border-b border-slate-200 bg-slate-50">
            <div className="w-64 shrink-0 border-r border-slate-200 p-4 flex items-center">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Property</span>
            </div>
            <div className="flex-1 flex">
              {days.map((day) => (
                <div key={day.toISOString()} className="flex-1 min-w-[60px] border-r border-slate-200 last:border-r-0 p-2 text-center">
                  <div className="text-xs text-slate-500">{format(day, 'EEE')}</div>
                  <div className={`text-sm font-medium mt-1 ${isSameDay(day, new Date()) ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto' : 'text-slate-900'}`}>
                    {format(day, 'd')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Property Lanes */}
          <div className="divide-y divide-slate-200">
            {mockProperties.map((property) => (
              <PropertyLane
                key={property.id}
                property={property}
                bookings={mockBookings.filter(b => b.propertyId === property.id)}
                days={days}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
