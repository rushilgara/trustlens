-- Create user_scans table to track apps users have scanned
CREATE TABLE public.user_scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  app_id UUID NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
  scanned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, app_id)
);

-- Create user_watchlist table for apps users want to monitor
CREATE TABLE public.user_watchlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  app_id UUID NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  UNIQUE(user_id, app_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_watchlist ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_scans
CREATE POLICY "Users can view their own scans"
ON public.user_scans
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scans"
ON public.user_scans
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scans"
ON public.user_scans
FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for user_watchlist
CREATE POLICY "Users can view their own watchlist"
ON public.user_watchlist
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own watchlist"
ON public.user_watchlist
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own watchlist"
ON public.user_watchlist
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can remove from their own watchlist"
ON public.user_watchlist
FOR DELETE
USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_user_scans_user_id ON public.user_scans(user_id);
CREATE INDEX idx_user_scans_scanned_at ON public.user_scans(scanned_at DESC);
CREATE INDEX idx_user_watchlist_user_id ON public.user_watchlist(user_id);
CREATE INDEX idx_user_watchlist_added_at ON public.user_watchlist(added_at DESC);