'use client'

import React from 'react'
import { mockProperties, mockBookings } from '@/lib/mockData'
import { calculateBookingRevenue, aggregateMonthlyRevenue, formatCurrency } from '@/lib/revenue'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

export default function RevenueDashboard() {
  // Aggregate revenue per property
  const propertiesData = mockProperties.map(property => {
    const propertyBookings = mockBookings.filter(b => b.propertyId === property.id)
    const breakdowns = propertyBookings.map(b => calculateBookingRevenue(b.payoutCents, b.platformSource, b.cleaningFeeCents))
    const aggregated = aggregateMonthlyRevenue(breakdowns)
    
    // Mock previous month data to show MoM trend using a deterministic multiplier instead of Math.random()
    // to avoid React purity violations and re-render flickering.
    const checksum = property.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const deterministicMultiplier = 0.8 + ((checksum % 5) * 0.08) // Pseudo-random based on ID checksum
    const previousNet = aggregated.netPayout * deterministicMultiplier
    const momChange = ((aggregated.netPayout - previousNet) / previousNet) * 100

    return {
      property,
      aggregated,
      momChange
    }
  })

  const totalNet = propertiesData.reduce((sum, p) => sum + p.aggregated.netPayout, 0)

  return (
    <div className="space-y-8">
      {/* Portfolio Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Portfolio Net Payout (This Month)</h2>
        <div className="flex items-end">
          <div className="text-4xl font-semibold text-slate-900 font-mono tracking-tight">{formatCurrency(totalNet)}</div>
          <div className="ml-4 mb-1 flex items-center text-sm font-medium text-emerald-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            12.5% vs Last Month
          </div>
        </div>
      </div>

      {/* Per-Property Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {propertiesData.map(({ property, aggregated, momChange }) => (
          <div key={property.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg text-slate-900">{property.name}</h3>
                <p className="text-sm text-slate-500">{property.address}</p>
              </div>
              <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-md ${momChange >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {momChange >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {Math.abs(momChange).toFixed(1)}% MoM
              </div>
            </div>

            <div className="p-5 flex-1">
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">Revenue Breakdown</div>
              
              <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Gross Bookings</span>
                  <span className="text-slate-900">{formatCurrency(aggregated.grossBookingTotal)}</span>
                </div>
                
                <div className="flex justify-between items-center text-rose-600">
                  <span>Platform Fees</span>
                  <span>-{formatCurrency(aggregated.platformFee)}</span>
                </div>

                <div className="flex justify-between items-center text-rose-600 pb-4 border-b border-slate-100">
                  <span>Cleaning Fees</span>
                  <span>-{formatCurrency(aggregated.cleaningFee)}</span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="font-semibold text-slate-900 font-sans text-base">Net Payout</span>
                  <span className="font-semibold text-xl text-slate-900">{formatCurrency(aggregated.netPayout)}</span>
                </div>
              </div>
            </div>
            
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
              <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                View transactions &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
