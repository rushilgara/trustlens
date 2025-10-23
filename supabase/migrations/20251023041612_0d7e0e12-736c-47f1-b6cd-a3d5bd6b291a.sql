-- Fix function search_path security issue with CASCADE
DROP FUNCTION IF EXISTS public.update_apps_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION public.update_apps_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER update_apps_updated_at
BEFORE UPDATE ON public.apps
FOR EACH ROW
EXECUTE FUNCTION public.update_apps_updated_at();