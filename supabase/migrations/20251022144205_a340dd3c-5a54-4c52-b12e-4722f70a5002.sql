-- Create apps table for storing verified finance apps
CREATE TABLE public.apps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  app_name TEXT NOT NULL,
  category TEXT NOT NULL,
  trust_score INTEGER NOT NULL CHECK (trust_score >= 0 AND trust_score <= 100),
  developer TEXT NOT NULL,
  rbi_verified BOOLEAN DEFAULT false,
  permissions TEXT[] DEFAULT '{}',
  reason TEXT NOT NULL,
  icon_url TEXT,
  play_store_link TEXT,
  package_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (no auth required)
CREATE POLICY "Apps are viewable by everyone" 
ON public.apps 
FOR SELECT 
USING (true);

-- Create index for faster searches
CREATE INDEX idx_apps_category ON public.apps(category);
CREATE INDEX idx_apps_trust_score ON public.apps(trust_score);
CREATE INDEX idx_apps_app_name ON public.apps(app_name);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_apps_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_apps_updated_at
BEFORE UPDATE ON public.apps
FOR EACH ROW
EXECUTE FUNCTION public.update_apps_updated_at();

-- Insert sample data
INSERT INTO public.apps (app_name, category, trust_score, developer, rbi_verified, permissions, reason, icon_url, play_store_link, package_id) VALUES
('PhonePe', 'Payments', 95, 'PhonePe Pvt Ltd', true, ARRAY['Camera', 'Contacts', 'Location'], 'RBI verified, transparent policies, no unnecessary data access', 'https://play-lh.googleusercontent.com/6iyA0jJq7u_OAPt3WGDOhV_1vKp4fJFgMTPb-sVMBJhF7HvOSvwHO0Zh5vc7vH4bTkw', 'https://play.google.com/store/apps/details?id=com.phonepe.app', 'com.phonepe.app'),
('Google Pay', 'Payments', 94, 'Google LLC', true, ARRAY['Camera', 'Contacts', 'SMS'], 'Backed by Google, strong security measures, RBI compliant', 'https://play-lh.googleusercontent.com/HArtbyi53u0jnqD76mqz9iF-S8qM4v8bD-lqTAv7vMoWq7W0pNs6SLkwfR5-qr1tAj4', 'https://play.google.com/store/apps/details?id=com.google.android.apps.nbu.paisa.user', 'com.google.android.apps.nbu.paisa.user'),
('Paytm', 'Payments', 88, 'Paytm Mobile Solutions', true, ARRAY['Camera', 'Contacts', 'Location', 'Storage'], 'RBI licensed payment bank, comprehensive KYC process', 'https://play-lh.googleusercontent.com/6yJXMqf5hJdnRKrpqEr-lSqRGFqJTAJEcRyxbxcBYvq4qSRmMqV5DxZr5jZX0X5x5w', 'https://play.google.com/store/apps/details?id=net.one97.paytm', 'net.one97.paytm'),
('Groww', 'Investments', 92, 'Groww Invest Tech', true, ARRAY['Camera', 'Storage'], 'SEBI registered broker, transparent fee structure, secure trading platform', 'https://play-lh.googleusercontent.com/WqQ4Lqn8RQJ5HJxMqV5DxZr5jZX0X5x5wQqQ4Lqn8RQJ5HJxMqV5DxZr5jZX0X5x5w', 'https://play.google.com/store/apps/details?id=com.nextbillion.groww', 'com.nextbillion.groww'),
('Zerodha Kite', 'Investments', 93, 'Zerodha', true, ARRAY['Camera', 'Biometric'], 'Leading discount broker, SEBI registered, robust security', 'https://play-lh.googleusercontent.com/RQJ5HJxMqV5DxZr5jZX0X5x5wQqQ4Lqn8RQJ5HJxMqV5DxZr5jZX0X5x5wQqQ4Lqn8', 'https://play.google.com/store/apps/details?id=com.zerodha.kite3', 'com.zerodha.kite3'),
('CRED', 'Budgeting', 90, 'Dreamplug Technologies', false, ARRAY['Camera', 'Contacts'], 'Secure credit card bill payment, good rewards program, no hidden charges', 'https://play-lh.googleusercontent.com/5HJxMqV5DxZr5jZX0X5x5wQqQ4Lqn8RQJ5HJxMqV5DxZr5jZX0X5x5wQqQ4Lqn8RQ', 'https://play.google.com/store/apps/details?id=com.dreamplug.androidapp', 'com.dreamplug.androidapp'),
('Jupiter', 'Savings', 89, 'Amica Financial Technologies', true, ARRAY['Camera', 'Location'], 'Federal Bank partnership, transparent charges, AI-powered insights', 'https://play-lh.googleusercontent.com/xMqV5DxZr5jZX0X5x5wQqQ4Lqn8RQJ5HJxMqV5DxZr5jZX0X5x5wQqQ4Lqn8RQJ5HJ', 'https://play.google.com/store/apps/details?id=com.jupiter.money', 'com.jupiter.money'),
('MoneyTap', 'Loans', 85, 'MoneyTap', true, ARRAY['Camera', 'Contacts', 'SMS', 'Location'], 'RBI approved NBFC, transparent interest rates, flexible repayment', 'https://play-lh.googleusercontent.com/V5DxZr5jZX0X5x5wQqQ4Lqn8RQJ5HJxMqV5DxZr5jZX0X5x5wQqQ4Lqn8RQJ5HJxMq', 'https://play.google.com/store/apps/details?id=com.moneytap.android', 'com.moneytap.android'),
('PolicyBazaar', 'Insurance', 91, 'Policybazaar Insurance Brokers', true, ARRAY['Camera', 'Storage'], 'IRDAI approved broker, transparent comparison, secure document handling', 'https://play-lh.googleusercontent.com/DxZr5jZX0X5x5wQqQ4Lqn8RQJ5HJxMqV5DxZr5jZX0X5x5wQqQ4Lqn8RQJ5HJxMqV5', 'https://play.google.com/store/apps/details?id=com.policybazaar.healthApp', 'com.policybazaar.healthApp'),
('CoinDCX', 'Crypto', 87, 'CoinDCX', false, ARRAY['Camera', 'Biometric'], 'Regulated crypto exchange, strong KYC, secure wallet infrastructure', 'https://play-lh.googleusercontent.com/Zr5jZX0X5x5wQqQ4Lqn8RQJ5HJxMqV5DxZr5jZX0X5x5wQqQ4Lqn8RQJ5HJxMqV5Dx', 'https://play.google.com/store/apps/details?id=com.coindcx', 'com.coindcx'),
('ET Money', 'Investments', 88, 'Times Internet', false, ARRAY['Camera', 'Storage'], 'Mutual fund investment platform, low fees, user-friendly interface', 'https://play-lh.googleusercontent.com/5jZX0X5x5wQqQ4Lqn8RQJ5HJxMqV5DxZr5jZX0X5x5wQqQ4Lqn8RQJ5HJxMqV5DxZr', 'https://play.google.com/store/apps/details?id=com.timesinternet.wealth', 'com.timesinternet.wealth'),
('Khatabook', 'Budgeting', 86, 'Khatabook', false, ARRAY['Camera', 'Contacts'], 'Simple bookkeeping for small businesses, secure data backup', 'https://play-lh.googleusercontent.com/ZX0X5x5wQqQ4Lqn8RQJ5HJxMqV5DxZr5jZX0X5x5wQqQ4Lqn8RQJ5HJxMqV5DxZr5j', 'https://play.google.com/store/apps/details?id=com.khatabook.android', 'com.khatabook.android');