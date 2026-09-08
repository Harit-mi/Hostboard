'use client'

import React from 'react'
import { Booking, Property } from '@/lib/mockData'
import { format } from 'date-fns'
import { X, User, Calendar, ExternalLink, MapPin, DollarSign, Sparkles } from 'lucide-react'
import { calculateBookingRevenue, formatCurrency } from '@/lib/revenue'

interface BookingPanelProps {
  booking: Booking
  property: Property
  onClose: () => void
}

export default function BookingPanel({ booking, property, onClose }: BookingPanelProps) {
  const revenue = calculateBookingRevenue(booking.payoutCents, booking.platformSource, booking.cleaningFeeCents)
  const isAirbnb = booking.platformSource === 'airbnb'

  return (
    <>
      <div className="fixed inset-0 bg-zinc-900/20 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      
      <div className="fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200 border-l border-zinc-200">
        <div className="flex items-center justify-between p-6 border-b border-zinc-100">
          <h2 className="text-lg font-bold text-zinc-900">Booking Details</h2>
          <button onClick={onClose} className="p-2 -mr-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-zinc-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900">{booking.guestName}</h3>
                <div className="flex items-center text-sm font-medium mt-1">
                  <span className={`px-2 py-0.5 rounded-md capitalize ${isAirbnb ? 'bg-[#FF5A5F]/10 text-[#FF5A5F]' : 'bg-[#003580]/10 text-[#003580]'}`}>
                    {booking.platformSource}
                  </span>
                  <span className="mx-2 text-zinc-300">•</span>
                  <span className="text-zinc-500">Confirmed</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">The Stay</h4>
            <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100 space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-zinc-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{property.name}</p>
                </div>
              </div>
              <div className="h-px bg-zinc-200" />
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-zinc-400 mr-3 mt-0.5" />
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] font-semibold text-zinc-500 uppercase">Check-in</p>
                    <p className="text-sm font-medium text-zinc-900 mt-0.5">{format(new Date(booking.checkIn), 'MMM d, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-zinc-500 uppercase">Check-out</p>
                    <p className="text-sm font-medium text-zinc-900 mt-0.5">{format(new Date(booking.checkOut), 'MMM d, yyyy')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center"><DollarSign className="w-4 h-4 mr-1"/>Payout Breakdown</h4>
            <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
              <div className="p-4 space-y-3 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Gross Booking</span>
                  <span className="font-medium text-zinc-900">{formatCurrency(revenue.grossBookingTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Platform Fee</span>
                  <span className="font-medium text-rose-600">-{formatCurrency(revenue.platformFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Cleaning Fee</span>
                  <span className="font-medium text-rose-600">-{formatCurrency(revenue.cleaningFee)}</span>
                </div>
              </div>
              <div className="bg-zinc-50 p-4 border-t border-zinc-200 flex justify-between items-center">
                <span className="text-sm font-bold text-zinc-900">Net Payout</span>
                <span className="text-lg font-bold text-emerald-600">{formatCurrency(revenue.netPayout)}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center"><Sparkles className="w-4 h-4 mr-1"/>Cleaning Status</h4>
            <div className={`px-4 py-3 rounded-xl border text-sm font-semibold flex items-center justify-between ${
              booking.cleaningStatus === 'complete' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
              booking.cleaningStatus === 'in_progress' ? 'bg-amber-50 border-amber-200 text-amber-700' :
              'bg-zinc-50 border-zinc-200 text-zinc-700'
            }`}>
              <span className="capitalize">{booking.cleaningStatus.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
