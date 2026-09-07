-- HostBoard Supabase Schema

-- Create custom types for status
CREATE TYPE booking_status AS ENUM ('confirmed', 'cancelled');
CREATE TYPE cleaning_status AS ENUM ('scheduled', 'in_progress', 'complete');
CREATE TYPE sync_status AS ENUM ('success', 'failed', 'pending');
CREATE TYPE platform_type AS ENUM ('airbnb', 'vrbo', 'bookingcom', 'direct');

-- 1. Organizations
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Memberships
CREATE TABLE public.memberships (
    user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) NOT NULL,
    role TEXT NOT NULL DEFAULT 'host', -- 'owner' | 'host' | 'cleaner'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- 3. Properties
CREATE TABLE public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) NOT NULL,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    timezone TEXT NOT NULL DEFAULT 'UTC',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- 4. iCal Feeds
CREATE TABLE public.ical_feeds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) NOT NULL,
    platform platform_type NOT NULL,
    feed_url TEXT NOT NULL,
    last_synced_at TIMESTAMPTZ,
    last_sync_status sync_status DEFAULT 'pending',
    last_sync_error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.ical_feeds ENABLE ROW LEVEL SECURITY;

-- 5. Bookings
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) NOT NULL,
    ical_feed_id UUID REFERENCES public.ical_feeds(id),
    external_uid TEXT, -- To prevent duplicates on sync
    guest_name TEXT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    platform_source platform_type NOT NULL,
    payout_cents INTEGER NOT NULL DEFAULT 0,
    status booking_status NOT NULL DEFAULT 'confirmed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 6. Cleaners
CREATE TABLE public.cleaners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    assigned_property_ids UUID[] DEFAULT '{}',
    rate_cents INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.cleaners ENABLE ROW LEVEL SECURITY;

-- 7. Cleaning Tasks
CREATE TABLE public.cleaning_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) NOT NULL,
    booking_id UUID REFERENCES public.bookings(id),
    scheduled_date DATE NOT NULL,
    assigned_cleaner_id UUID REFERENCES public.cleaners(id),
    status cleaning_status NOT NULL DEFAULT 'scheduled',
    checklist JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.cleaning_tasks ENABLE ROW LEVEL SECURITY;

-- 8. Maintenance Issues
CREATE TABLE public.maintenance_issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) NOT NULL,
    description TEXT NOT NULL,
    reported_by TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    photos JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.maintenance_issues ENABLE ROW LEVEL SECURITY;

-- 9. Revenue Ledger
CREATE TABLE public.revenue_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) NOT NULL,
    booking_id UUID REFERENCES public.bookings(id) NOT NULL,
    payout_cents INTEGER NOT NULL,
    platform_fee_cents INTEGER NOT NULL,
    cleaning_fee_cents INTEGER NOT NULL,
    net_cents INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.revenue_ledger ENABLE ROW LEVEL SECURITY;

-- Security Definer Function
CREATE OR REPLACE FUNCTION public.get_auth_org_id()
RETURNS UUID AS $$
  SELECT organization_id FROM public.memberships WHERE user_id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;


-- RLS Policies

-- Memberships
CREATE POLICY "read own membership" ON public.memberships
  FOR SELECT USING (user_id = auth.uid());

-- Organizations
CREATE POLICY "read own organization" ON public.organizations
  FOR SELECT USING (id = public.get_auth_org_id());

-- Properties
CREATE POLICY "manage own organization properties" ON public.properties
  FOR ALL USING (organization_id = public.get_auth_org_id());

-- iCal Feeds
CREATE POLICY "manage own organization ical feeds" ON public.ical_feeds
  FOR ALL USING (property_id IN (
      SELECT id FROM public.properties WHERE organization_id = public.get_auth_org_id()
  ));

-- Bookings
CREATE POLICY "manage own organization bookings" ON public.bookings
  FOR ALL USING (property_id IN (
      SELECT id FROM public.properties WHERE organization_id = public.get_auth_org_id()
  ));

-- Cleaners
CREATE POLICY "manage own organization cleaners" ON public.cleaners
  FOR ALL USING (organization_id = public.get_auth_org_id());

-- Cleaning Tasks
CREATE POLICY "manage own organization cleaning tasks" ON public.cleaning_tasks
  FOR ALL USING (property_id IN (
      SELECT id FROM public.properties WHERE organization_id = public.get_auth_org_id()
  ));

-- Maintenance Issues
CREATE POLICY "manage own organization maintenance issues" ON public.maintenance_issues
  FOR ALL USING (property_id IN (
      SELECT id FROM public.properties WHERE organization_id = public.get_auth_org_id()
  ));

-- Revenue Ledger
CREATE POLICY "manage own organization revenue" ON public.revenue_ledger
  FOR ALL USING (property_id IN (
      SELECT id FROM public.properties WHERE organization_id = public.get_auth_org_id()
  ));
