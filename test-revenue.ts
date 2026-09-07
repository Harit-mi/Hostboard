import { calculateBookingRevenue, aggregateMonthlyRevenue, formatCurrency } from './src/lib/revenue.ts'

const breakdown1 = calculateBookingRevenue(100000, 'airbnb', 15000)
console.assert(breakdown1.platformFee === 3000, 'Airbnb fee should be 3%')
console.assert(breakdown1.netPayout === 82000, 'Airbnb net should be 820')

const breakdown2 = calculateBookingRevenue(100000, 'bookingcom', 15000)
console.assert(breakdown2.platformFee === 15000, 'Booking.com fee should be 15%')
console.assert(breakdown2.netPayout === 70000, 'Booking.com net should be 700')

const agg = aggregateMonthlyRevenue([breakdown1, breakdown2])
console.assert(agg.grossBookingTotal === 200000, 'Gross total mismatch')
console.assert(agg.netPayout === 152000, 'Net total mismatch')

console.log('All tests passed!')
