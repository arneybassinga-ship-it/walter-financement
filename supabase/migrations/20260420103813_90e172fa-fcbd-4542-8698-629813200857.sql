-- Enum statuts
CREATE TYPE public.loan_status AS ENUM ('en_attente', 'approuve', 'refuse');

-- Enum rôles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Table user_roles
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Fonction security definer pour vérifier le rôle (évite récursion RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Policies user_roles
CREATE POLICY "Les admins peuvent voir tous les rôles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Les utilisateurs voient leurs propres rôles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Les admins peuvent gérer les rôles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Table loan_requests
CREATE TABLE public.loan_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  monthly_income NUMERIC(12,2) NOT NULL,
  purpose TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  duration_months INTEGER NOT NULL,
  interest_rate NUMERIC(5,2) NOT NULL DEFAULT 5.00,
  monthly_payment NUMERIC(12,2) NOT NULL,
  total_repayment NUMERIC(12,2) NOT NULL,
  status loan_status NOT NULL DEFAULT 'en_attente',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.loan_requests ENABLE ROW LEVEL SECURITY;

-- N'importe qui peut soumettre une demande
CREATE POLICY "Tout le monde peut soumettre une demande"
ON public.loan_requests FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Seuls les admins peuvent lire / modifier / supprimer
CREATE POLICY "Les admins voient toutes les demandes"
ON public.loan_requests FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Les admins peuvent modifier les demandes"
ON public.loan_requests FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Les admins peuvent supprimer les demandes"
ON public.loan_requests FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_loan_requests_updated_at
BEFORE UPDATE ON public.loan_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_loan_requests_created_at ON public.loan_requests(created_at DESC);
CREATE INDEX idx_loan_requests_status ON public.loan_requests(status);