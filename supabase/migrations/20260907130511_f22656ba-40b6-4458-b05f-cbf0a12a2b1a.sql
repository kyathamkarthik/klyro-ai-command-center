CREATE TABLE public.credit_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  current_balance NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_purchased NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.credit_wallets TO authenticated;
GRANT ALL ON public.credit_wallets TO service_role;
ALTER TABLE public.credit_wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wallet_select_own" ON public.credit_wallets FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "wallet_insert_own" ON public.credit_wallets FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "wallet_update_own" ON public.credit_wallets FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.credit_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  feature TEXT NOT NULL,
  credits_used NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX credit_transactions_user_created_idx ON public.credit_transactions (user_id, created_at DESC);
GRANT SELECT, INSERT ON public.credit_transactions TO authenticated;
GRANT ALL ON public.credit_transactions TO service_role;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tx_select_own" ON public.credit_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "tx_insert_own" ON public.credit_transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.credit_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tier TEXT NOT NULL,
  name TEXT NOT NULL,
  price_usd NUMERIC(12,2),
  credits NUMERIC(12,2),
  is_custom BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.credit_packages TO anon;
GRANT SELECT ON public.credit_packages TO authenticated;
GRANT ALL ON public.credit_packages TO service_role;
ALTER TABLE public.credit_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "packages_public_read" ON public.credit_packages FOR SELECT TO anon, authenticated USING (is_active);

CREATE OR REPLACE FUNCTION public.handle_new_user_wallet()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.credit_wallets (user_id, current_balance, total_purchased)
  VALUES (NEW.id, 15.00, 15.00)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_wallet
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_wallet();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER credit_wallets_updated_at BEFORE UPDATE ON public.credit_wallets
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER PUBLICATION supabase_realtime ADD TABLE public.credit_wallets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.credit_transactions;

INSERT INTO public.credit_packages (tier, name, price_usd, credits, is_custom, sort_order) VALUES
('Starter','5 Credits',5,5,false,1),
('Starter','10 Credits',10,10,false,2),
('Starter','15 Credits',15,15,false,3),
('Pro','25 Credits',25,25,false,4),
('Pro','50 Credits',50,50,false,5),
('Pro','75 Credits',75,75,false,6),
('Pro','100 Credits',100,100,false,7),
('Business','500 Credits',500,500,false,8),
('Business','1,000 Credits',1000,1000,false,9),
('Enterprise','Custom',NULL,NULL,true,10);