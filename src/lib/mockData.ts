import { addDays, subDays } from 'date-fns'
import type { PlatformType } from './revenue'

export type SyncStatus = 'success' | 'failed' | 'pending'
export type CleaningStatus = 'scheduled' | 'in_progress' | 'complete'

export interface Property {
  id: string
  name: string
  address: string
  lastSyncStatus: SyncStatus
  lastSyncedAt: Date | null
  lastSyncError: string | null
}

export interface Booking {
  id: string
  propertyId: string
  guestName: string
  checkIn: Date
  checkOut: Date
  platformSource: PlatformType
  payoutCents: number
  cleaningFeeCents: number
  cleaningStatus: CleaningStatus
}

const today = new Date()

export const mockProperties: Property[] = [
  {
    id: 'prop-1',
    name: 'Downtown Loft',
    address: '123 Main St, Apt 4B',
    lastSyncStatus: 'success',
    lastSyncedAt: subDays(today, 0),
    lastSyncError: null,
  },
  {
    id: 'prop-2',
    name: 'Lakeside Cabin',
    address: '456 Lakeview Dr',
    lastSyncStatus: 'success',
    lastSyncedAt: subDays(today, 0),
    lastSyncError: null,
  },
  {
    id: 'prop-3',
    name: 'Mountain Retreat',
    address: '789 Pine Ridge Rd',
    lastSyncStatus: 'failed',
    lastSyncedAt: subDays(today, 1),
    lastSyncError: 'iCal feed returned 503 Service Unavailable',
  },
]

export const mockBookings: Booking[] = [
  // Prop 1: Has a same-day turnover today!
  {
    id: 'book-1',
    propertyId: 'prop-1',
    guestName: 'Alice Smith',
    checkIn: subDays(today, 3),
    checkOut: today,
    platformSource: 'airbnb',
    payoutCents: 45000,
    cleaningFeeCents: 8000,
    cleaningStatus: 'in_progress',
  },
  {
    id: 'book-2',
    propertyId: 'prop-1',
    guestName: 'Bob Johnson',
    checkIn: today, // Same-day turnover
    checkOut: addDays(today, 4),
    platformSource: 'vrbo',
    payoutCents: 60000,
    cleaningFeeCents: 8000,
    cleaningStatus: 'scheduled',
  },

  // Prop 2: Vacant night coming up
  {
    id: 'book-3',
    propertyId: 'prop-2',
    guestName: 'Carol Davis',
    checkIn: subDays(today, 2),
    checkOut: addDays(today, 2),
    platformSource: 'bookingcom',
    payoutCents: 35000,
    cleaningFeeCents: 10000,
    cleaningStatus: 'scheduled',
  },
  {
    id: 'book-4',
    propertyId: 'prop-2',
    guestName: 'Dave Wilson',
    checkIn: addDays(today, 4), // 2 days vacant between book-3 and book-4
    checkOut: addDays(today, 8),
    platformSource: 'airbnb',
    payoutCents: 80000,
    cleaningFeeCents: 10000,
    cleaningStatus: 'scheduled',
  },

  // Prop 3: Failed sync property
  {
    id: 'book-5',
    propertyId: 'prop-3',
    guestName: 'Eve Brown',
    checkIn: addDays(today, 1),
    checkOut: addDays(today, 5),
    platformSource: 'airbnb',
    payoutCents: 55000,
    cleaningFeeCents: 12000,
    cleaningStatus: 'scheduled',
  },
]
