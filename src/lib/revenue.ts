/**
 * Pure functions for revenue and payout calculations.
 *
 * It is critical that these calculations live here and not inline in components.
 * This ensures hosts have a trustworthy monthly revenue number.
 */

export interface RevenueBreakdown {
  grossBookingTotal: number
  platformFee: number
  cleaningFee: number
  netPayout: number
}

export type PlatformType = 'airbnb' | 'vrbo' | 'bookingcom' | 'direct'

/**
 * Calculates the revenue breakdown for a single booking based on the platform.
 * Note: Platform fees are typically dynamic based on host agreements, but we use
 * standard baseline approximations for MVP if exact fees aren't provided by the feed.
 *
 * In a real iCal feed, we often only get the gross payout or nothing (if it's basic iCal).
 * If the booking record has exact payout numbers, we use them. Otherwise, we can estimate.
 */
export function calculateBookingRevenue(
  payoutCents: number,
  platformSource: PlatformType,
  cleaningFeeCents: number
): RevenueBreakdown {
  // Typical host-only fee structure on Airbnb is ~3% for standard, but can be 15% for hospitality.
  // We'll assume a standard 3% for airbnb and vrbo, and 15% for booking.com for this MVP example.
  let platformFeePercentage = 0.03
  if (platformSource === 'bookingcom') {
    platformFeePercentage = 0.15
  } else if (platformSource === 'direct') {
    platformFeePercentage = 0.0 // Assuming no direct platform fee (stripe fees might apply though)
  }

  // If the payoutCents is the *gross* amount the guest paid (often what iCal gives if at all)
  const platformFee = Math.round(payoutCents * platformFeePercentage)
  const netPayout = payoutCents - platformFee - cleaningFeeCents

  return {
    grossBookingTotal: payoutCents,
    platformFee,
    cleaningFee: cleaningFeeCents,
    netPayout,
  }
}

/**
 * Aggregates a list of booking revenue breakdowns into a monthly total.
 */
export function aggregateMonthlyRevenue(
  breakdowns: RevenueBreakdown[]
): RevenueBreakdown {
  return breakdowns.reduce(
    (acc, curr) => ({
      grossBookingTotal: acc.grossBookingTotal + curr.grossBookingTotal,
      platformFee: acc.platformFee + curr.platformFee,
      cleaningFee: acc.cleaningFee + curr.cleaningFee,
      netPayout: acc.netPayout + curr.netPayout,
    }),
    { grossBookingTotal: 0, platformFee: 0, cleaningFee: 0, netPayout: 0 }
  )
}

/**
 * Helper to convert cents to formatted currency string (e.g. $1,234.56)
 */
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}
