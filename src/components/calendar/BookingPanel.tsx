import React from 'react'
import { Booking, Property } from '@/lib/mockData'
import { format } from 'date-fns'
import { X, Calendar, User, CreditCard, ExternalLink, ArrowRight } from 'lucide-react'
import { calculateBookingRevenue, formatCurrency } from '@/lib/revenue'

interface BookingPanelProps {
  booking: Booking
  property: Property
  onClose: () => void
}

export default function BookingPanel({ booking, property, onClose }: BookingPanelProps) {
  const revenue = calculateBookingRevenue(booking.payoutCents, booking.platformSource, booking.cleaningFeeCents)

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-40 smooth-transition" 
        onClick={onClose}
      />
      <div className="absolute top-0 right-0 bottom-0 w-[400px] glass-panel z-50 flex flex-col shadow-[-8px_0_32px_rgba(0,0,0,0.05)] border-l border-white animate-in slide-in-from-right duration-500 ease-out">
        {/* Header */}
        <div className="px-6 py-5 border-b border-black/5 flex items-center justify-between bg-white/40">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 tracking-tight">Booking Details</h2>
            <p className="text-xs text-zinc-500 font-medium mt-0.5">{property.name}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100/80 rounded-full smooth-transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Guest Info */}
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-zinc-900 text-lg">{booking.guestName}</h3>
                <p className="text-xs text-zinc-500 flex items-center mt-0.5">
                  <span className="capitalize">{booking.platformSource}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-white/60 p-4 rounded-2xl border border-black/5 shadow-sm">
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="text-xs text-zinc-500 font-medium mb-1">Check-in</p>
                <p className="font-semibold text-zinc-900">{format(new Date(booking.checkIn), 'MMM d, yyyy')}</p>
                <p className="text-xs text-zinc-500 mt-0.5">3:00 PM</p>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-300" />
              <div className="text-right">
                <p className="text-xs text-zinc-500 font-medium mb-1">Check-out</p>
                <p className="font-semibold text-zinc-900">{format(new Date(booking.checkOut), 'MMM d, yyyy')}</p>
                <p className="text-xs text-zinc-500 mt-0.5">11:00 AM</p>
              </div>
            </div>
          </div>

          {/* Financials */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">Financials</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">Gross Payout</span>
                <span className="font-medium text-zinc-900">{formatCurrency(revenue.grossPayoutCents)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">Platform Fee</span>
                <span className="font-medium text-zinc-900">-{formatCurrency(revenue.platformFeeCents)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">Cleaning Fee</span>
                <span className="font-medium text-zinc-900">-{formatCurrency(revenue.cleaningFeeCents)}</span>
              </div>
              <div className="pt-3 border-t border-black/5 flex justify-between">
                <span className="text-sm font-medium text-zinc-900">Net Revenue</span>
                <span className="font-semibold text-zinc-900">{formatCurrency(revenue.netRevenueCents)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-black/5 bg-white/40">
          <button className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full text-sm font-medium smooth-transition hover:shadow-lg hover:shadow-zinc-900/20 active:scale-[0.98]">
            Message Guest
          </button>
        </div>
      </div>
    </>
  )
}
