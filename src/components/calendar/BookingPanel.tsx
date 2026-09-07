'use client'

import React from 'react'
import { Booking, Property } from '@/lib/mockData'
import { format } from 'date-fns'
import { X, User, DollarSign, Sparkles } from 'lucide-react'
import { calculateBookingRevenue, formatCurrency } from '@/lib/revenue'

interface BookingPanelProps {
  booking: Booking
  property: Property
  onClose: () => void
}

export default function BookingPanel({ booking, property, onClose }: BookingPanelProps) {
  const revenue = calculateBookingRevenue(booking.payoutCents, booking.platformSource, booking.cleaningFeeCents)

  return (
    <div className="absolute right-0 top-0 bottom-0 w-80 bg-white border-l border-slate-200 shadow-2xl z-30 flex flex-col animate-in slide-in-from-right-8">
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <h4 className="font-semibold text-slate-900">Booking Details</h4>
        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-md text-slate-500">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        {/* Guest Info */}
        <div>
          <div className="flex items-center text-sm font-medium text-slate-500 mb-2 uppercase tracking-wider">
            <User className="w-4 h-4 mr-2" /> Guest
          </div>
          <p className="text-lg font-medium text-slate-900">{booking.guestName}</p>
          <p className="text-sm text-slate-600 mt-1">
            {format(booking.checkIn, 'MMM d')} – {format(booking.checkOut, 'MMM d, yyyy')}
          </p>
          <span className="inline-block mt-2 px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md capitalize">
            Source: {booking.platformSource}
          </span>
        </div>

        {/* Payout Breakdown */}
        <div>
          <div className="flex items-center text-sm font-medium text-slate-500 mb-2 uppercase tracking-wider">
            <DollarSign className="w-4 h-4 mr-2" /> Payout
          </div>
          <div className="bg-slate-50 rounded-lg p-3 space-y-2 text-sm font-mono text-slate-600">
            <div className="flex justify-between">
              <span>Gross</span>
              <span>{formatCurrency(revenue.grossBookingTotal)}</span>
            </div>
            <div className="flex justify-between text-rose-600">
              <span>Platform Fee</span>
              <span>-{formatCurrency(revenue.platformFee)}</span>
            </div>
            <div className="flex justify-between text-rose-600">
              <span>Cleaning Fee</span>
              <span>-{formatCurrency(revenue.cleaningFee)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between font-semibold text-slate-900 text-base">
              <span>Net Payout</span>
              <span>{formatCurrency(revenue.netPayout)}</span>
            </div>
          </div>
        </div>

        {/* Cleaning Status */}
        <div>
          <div className="flex items-center text-sm font-medium text-slate-500 mb-2 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 mr-2" /> Cleaning
          </div>
          <div className={`px-3 py-2 rounded-lg border ${
            booking.cleaningStatus === 'complete' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
            booking.cleaningStatus === 'in_progress' ? 'bg-amber-50 border-amber-200 text-amber-700' :
            'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <p className="text-sm font-medium capitalize">Status: {booking.cleaningStatus.replace('_', ' ')}</p>
            {booking.cleaningStatus !== 'complete' && (
              <button className="mt-2 text-xs font-medium bg-white border border-current px-2 py-1 rounded shadow-sm hover:opacity-80 transition-opacity">
                Manage Task &rarr;
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
