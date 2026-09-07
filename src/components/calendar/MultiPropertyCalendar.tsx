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
    <div className="w-full h-full bg-slate-50 flex flex-col font-sans">
      <header className="p-6 pb-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">HostBoard</h1>
          <p className="text-sm text-slate-500 mt-1">Multi-Property Calendar</p>
        </div>
        <div className="flex gap-4">
          <a href="/turnovers" className="text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors">
            Turnovers
          </a>
          <a href="/revenue" className="text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors">
            Revenue
          </a>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="min-w-[1000px] border border-slate-200 bg-white rounded-xl shadow-sm overflow-hidden">
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
