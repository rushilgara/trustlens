-- Add new financial categories and international finance apps

-- Insert new apps with expanded financial categories
INSERT INTO public.apps (app_name, category, trust_score, developer, rbi_verified, icon_url, play_store_link, permissions, reason) VALUES
-- Tax Filing Apps
('ClearTax', 'Tax Filing', 95, 'ClearTax', true, NULL, 'https://play.google.com/store/apps/details?id=com.cleartax.mobile', ARRAY['Storage', 'Network Access', 'Identity'], 'RBI verified with strong security measures and transparent tax filing process'),
('TaxBuddy', 'Tax Filing', 88, 'TaxBuddy Technologies', true, NULL, 'https://play.google.com/store/apps/details?id=com.taxbuddy', ARRAY['Storage', 'Network Access'], 'Verified CA-backed platform with good security practices'),

-- Retirement Planning Apps  
('NPS Lite', 'Retirement Planning', 92, 'NSDL e-Governance', true, NULL, 'https://play.google.com/store/apps/details?id=com.npscra.npslite', ARRAY['Network Access', 'Identity'], 'Government-backed National Pension System app with high security'),
('Groww Pension', 'Retirement Planning', 90, 'Nextbillion Technology', true, NULL, 'https://play.google.com/store/apps/details?id=com.groww.pension', ARRAY['Storage', 'Network Access', 'Camera'], 'SEBI registered with transparent fee structure and strong encryption'),

-- Personal Finance Apps
('Money View', 'Personal Finance', 85, 'Money View', true, NULL, 'https://play.google.com/store/apps/details?id=com.moneyview', ARRAY['Storage', 'Network Access', 'SMS', 'Location'], 'Personal finance manager with decent security but requests many permissions'),
('Walnut', 'Personal Finance', 87, 'Walnut Solutions', true, NULL, 'https://play.google.com/store/apps/details?id=com.droom.walnut', ARRAY['SMS', 'Storage', 'Network Access'], 'Good expense tracking with acceptable privacy practices'),

-- Wealth Management Apps
('Kuvera', 'Wealth Management', 93, 'Kuvera', true, NULL, 'https://play.google.com/store/apps/details?id=com.kuvera.app', ARRAY['Storage', 'Network Access', 'Camera'], 'SEBI registered RIA with strong security and transparent pricing'),
('Scripbox', 'Wealth Management', 91, 'Scripbox', true, NULL, 'https://play.google.com/store/apps/details?id=com.scripbox.android', ARRAY['Storage', 'Network Access', 'Identity'], 'SEBI registered with good track record and security measures'),

-- Fixed Deposit Apps
('FD Bazaar', 'Fixed Deposits', 89, 'BankBazaar', true, NULL, 'https://play.google.com/store/apps/details?id=com.fdbazaar', ARRAY['Storage', 'Network Access', 'Camera'], 'Aggregator for FDs across banks with good security practices'),
('IndiaBonds', 'Fixed Deposits', 90, 'IndiaBonds', true, NULL, 'https://play.google.com/store/apps/details?id=com.indiabonds', ARRAY['Storage', 'Network Access'], 'SEBI registered platform for bonds and FDs with strong encryption'),

-- International Finance Apps
('Wise (TransferWise)', 'International Finance', 94, 'Wise Payments Limited', true, NULL, 'https://play.google.com/store/apps/details?id=com.transferwise.android', ARRAY['Camera', 'Storage', 'Network Access', 'Location'], 'FCA regulated international money transfer with excellent security and transparency'),
('Remitly', 'International Finance', 90, 'Remitly', true, NULL, 'https://play.google.com/store/apps/details?id=com.remitly.mobile', ARRAY['Camera', 'Storage', 'Network Access', 'SMS'], 'Licensed money transfer service with strong compliance and security'),
('Western Union', 'International Finance', 88, 'Western Union', true, NULL, 'https://play.google.com/store/apps/details?id=com.westernunion.moneytransferr3app.android', ARRAY['Camera', 'Storage', 'Network Access', 'Location', 'SMS'], 'Established international transfer service but requests many permissions'),
('Xoom by PayPal', 'International Finance', 91, 'PayPal Inc', true, NULL, 'https://play.google.com/store/apps/details?id=com.xoom.android', ARRAY['Camera', 'Storage', 'Network Access'], 'PayPal-backed international transfers with strong security measures'),
('Revolut', 'International Finance', 92, 'Revolut Ltd', true, NULL, 'https://play.google.com/store/apps/details?id=com.revolut.revolut', ARRAY['Camera', 'Storage', 'Network Access', 'Location', 'Biometric'], 'FCA licensed multi-currency account with excellent security features');

-- Update existing categories to ensure consistency
UPDATE public.apps SET category = 'Payments' WHERE category = 'Payment' OR category = 'UPI';
UPDATE public.apps SET category = 'Investments' WHERE category = 'Investment';
UPDATE public.apps SET category = 'Savings' WHERE category = 'Saving';
UPDATE public.apps SET category = 'Insurance' WHERE category = 'Insurence';
UPDATE public.apps SET category = 'Budgeting' WHERE category = 'Budget';
UPDATE public.apps SET category = 'Cryptocurrency' WHERE category = 'Crypto';