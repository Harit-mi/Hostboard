'use client'

import React from 'react'
import { mockProperties, mockBookings } from '@/lib/mockData'
import { format, isSameDay } from 'date-fns'
import { CheckSquare, Square, AlertTriangle, UserPlus, MoreVertical } from 'lucide-react'

export default function TurnoverList() {
  // A turnover is triggered by a checkout.
  // We identify a same-day turnover if there's a check-in on the same date for the same property.
  
  return (
    <div className="space-y-8">
      {mockProperties.map(property => {
        const propertyBookings = mockBookings.filter(b => b.propertyId === property.id)
        const checkOuts = propertyBookings.map(b => format(b.checkOut, 'yyyy-MM-dd'))
        const checkIns = propertyBookings.map(b => format(b.checkIn, 'yyyy-MM-dd'))
        const sameDayTurnovers = checkOuts.filter(date => checkIns.includes(date))

        // Find all checkouts for this property to schedule cleanings
        const cleanings = propertyBookings.map(booking => {
          const checkoutDateStr = format(booking.checkOut, 'yyyy-MM-dd')
          const isSameDayTurnover = sameDayTurnovers.includes(checkoutDateStr)
          const nextCheckInBooking = propertyBookings.find(b => format(b.checkIn, 'yyyy-MM-dd') === checkoutDateStr)

          return {
            booking,
            isSameDayTurnover,
            nextGuest: nextCheckInBooking?.guestName,
            deadline: isSameDayTurnover ? '3:00 PM' : 'Flexible'
          }
        }).sort((a, b) => a.booking.checkOut.getTime() - b.booking.checkOut.getTime())

        if (cleanings.length === 0) return null

        return (
          <div key={property.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-semibold text-slate-900">{property.name}</h2>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{cleanings.length} upcoming</span>
            </div>
            
            <div className="divide-y divide-slate-100">
              {cleanings.map(({ booking, isSameDayTurnover, nextGuest, deadline }) => (
                <div key={booking.id} className={`p-5 flex flex-col sm:flex-row sm:items-start gap-4 transition-colors hover:bg-slate-50/50 ${isSameDayTurnover ? 'bg-rose-50/30' : ''}`}>
                  {/* Date & Urgency */}
                  <div className="w-32 shrink-0">
                    <div className="text-lg font-semibold text-slate-900">{format(booking.checkOut, 'MMM d')}</div>
                    <div className="text-sm text-slate-500">{format(booking.checkOut, 'EEEE')}</div>
                    {isSameDayTurnover && (
                      <div className="mt-2 inline-flex items-center text-xs font-medium text-rose-700 bg-rose-100 px-2 py-1 rounded shadow-sm border border-rose-200">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Same-Day
                      </div>
                    )}
                  </div>

                  {/* Task Details */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
                      <div>
                        <span className="font-medium text-slate-900">Out:</span> {booking.guestName}
                      </div>
                      {isSameDayTurnover && nextGuest && (
                        <div>
                          <span className="font-medium text-slate-900">In ({deadline}):</span> {nextGuest}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center text-slate-600 hover:text-slate-900 cursor-pointer transition-colors">
                        <CheckSquare className="w-4 h-4 mr-2 text-emerald-500" /> Changed all linens
                      </div>
                      <div className="flex items-center text-slate-600 hover:text-slate-900 cursor-pointer transition-colors">
                        <CheckSquare className="w-4 h-4 mr-2 text-emerald-500" /> Restocked toiletries
                      </div>
                      <div className="flex items-center text-slate-600 hover:text-slate-900 cursor-pointer transition-colors">
                        <Square className="w-4 h-4 mr-2 text-slate-400" /> Inspected for damage
                      </div>
                      <div className="flex items-center text-slate-600 hover:text-slate-900 cursor-pointer transition-colors">
                        <Square className="w-4 h-4 mr-2 text-slate-400" /> Emptied trash
                      </div>
                    </div>
                  </div>

                  {/* Assignment & Actions */}
                  <div className="w-full sm:w-48 flex items-center justify-between sm:flex-col sm:items-end gap-3 shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
                    <div className="flex flex-col items-end">
                      <div className={`text-xs font-medium uppercase tracking-wider mb-1 ${
                        booking.cleaningStatus === 'complete' ? 'text-emerald-600' :
                        booking.cleaningStatus === 'in_progress' ? 'text-amber-600' :
                        'text-slate-500'
                      }`}>
                        {booking.cleaningStatus.replace('_', ' ')}
                      </div>
                    </div>
                    
                    {booking.cleaningStatus === 'scheduled' ? (
                      <button className="flex items-center text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors border border-indigo-200">
                        <UserPlus className="w-4 h-4 mr-2" /> Assign Cleaner
                      </button>
                    ) : (
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-xs font-medium text-slate-600">
                          JS
                        </div>
                        <button className="p-1 ml-2 text-slate-400 hover:text-slate-600 rounded">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
