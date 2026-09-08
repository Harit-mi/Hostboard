import { test, expect } from '@playwright/test';

test.describe('HostBoard MVP QA', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('Phase 1: Calendar UI renders correctly with mock data', async ({ page }) => {
    // Check header
    await expect(page.getByRole('heading', { name: 'HostBoard' })).toBeVisible();

    // Check all three properties are rendered
    await expect(page.getByText('Downtown Loft')).toBeVisible();
    await expect(page.getByText('Lakeside Cabin')).toBeVisible();
    await expect(page.getByText('Mountain Retreat')).toBeVisible();

    // Verify loud failure state on Mountain Retreat
    const failedSync = page.locator('text=Sync failed');
    await expect(failedSync).toBeVisible();

    // Verify same-day turnover visual marker exists (the red dot indicator)
    // We expect at least one turnover dot to be visible
    const turnoverMarker = page.locator('div[title="Same-day turnover"]').first();
    await expect(turnoverMarker).toBeVisible();
  });

  test('Phase 1: Inline booking panel opens', async ({ page }) => {
    // Click on a booking bar (e.g. Alice Smith)
    const bookingBar = page.getByText('Alice Smith');
    await bookingBar.click();

    // Verify panel appears
    await expect(page.getByRole('heading', { name: 'Booking Details' })).toBeVisible();
    
    // Verify payout shows up
    await expect(page.getByText('Net Payout')).toBeVisible();
    
    // Close panel
    await page.locator('button').filter({ hasText: '' }).first().click(); // Close button X
  });

  test('Phase 2: Turnovers Scheduling Page', async ({ page }) => {
    await page.goto('http://localhost:3000/turnovers');
    
    // Check header
    await expect(page.getByRole('heading', { name: 'Turnovers & Cleaning' })).toBeVisible();
    
    // Check same-day marker exists
    await expect(page.getByText('Same-Day').first()).toBeVisible();

    // Check "Assign Cleaner" button exists
    await expect(page.getByText('Assign Cleaner').first()).toBeVisible();

    // Check tasks exist
    await expect(page.getByText('Changed all linens').first()).toBeVisible();
  });

  test('Phase 3: Revenue Dashboard', async ({ page }) => {
    await page.goto('http://localhost:3000/revenue');
    
    // Check header
    await expect(page.getByRole('heading', { name: 'Financials & Payouts' })).toBeVisible();

    // Verify mock data totals appear
    await expect(page.getByText('Portfolio Net Payout (This Month)')).toBeVisible();
    
    // Ensure deterministic % trends are visible
    // They should no longer flicker or be completely random per render
    await expect(page.getByText('% MoM').first()).toBeVisible();
    
    // Check breakdown table exists
    await expect(page.getByText('Gross Bookings').first()).toBeVisible();
    await expect(page.getByText('Platform Fees').first()).toBeVisible();
    await expect(page.getByText('Cleaning Fees').first()).toBeVisible();
  });
});
