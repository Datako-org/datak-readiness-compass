-- Datakö Diagnostic Database Schema

-- Organizations table
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sector TEXT NOT NULL,
  country TEXT NOT NULL,
  size TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Respondents table
CREATE TABLE public.respondents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL,
  consent_given BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Questions table
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  step INTEGER NOT NULL,
  axis TEXT NOT NULL,
  sector TEXT,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'single_choice',
  options JSONB,
  max_score INTEGER NOT NULL DEFAULT 4,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Diagnostics table
CREATE TABLE public.diagnostics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  respondent_id UUID REFERENCES public.respondents(id) ON DELETE CASCADE,
  total_score INTEGER NOT NULL DEFAULT 0,
  maturity_level TEXT NOT NULL DEFAULT 'debutant',
  axis_scores JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'in_progress',
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Answers table
CREATE TABLE public.answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  diagnostic_id UUID REFERENCES public.diagnostics(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  answer_value TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Emails log table
CREATE TABLE public.emails_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  diagnostic_id UUID REFERENCES public.diagnostics(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.respondents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emails_log ENABLE ROW LEVEL SECURITY;

-- Public read access for questions (they are public content)
CREATE POLICY "Questions are publicly readable" 
ON public.questions 
FOR SELECT 
USING (true);

-- Allow public insert for organizations (anonymous diagnostic)
CREATE POLICY "Anyone can create organizations" 
ON public.organizations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can read their organization" 
ON public.organizations 
FOR SELECT 
USING (true);

-- Allow public insert for respondents
CREATE POLICY "Anyone can create respondents" 
ON public.respondents 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can read respondents" 
ON public.respondents 
FOR SELECT 
USING (true);

-- Allow public insert/read for diagnostics
CREATE POLICY "Anyone can create diagnostics" 
ON public.diagnostics 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can read diagnostics" 
ON public.diagnostics 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update diagnostics" 
ON public.diagnostics 
FOR UPDATE 
USING (true);

-- Allow public insert/read for answers
CREATE POLICY "Anyone can create answers" 
ON public.answers 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can read answers" 
ON public.answers 
FOR SELECT 
USING (true);

-- Allow public insert for emails_log
CREATE POLICY "Anyone can create email logs" 
ON public.emails_log 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can read email logs" 
ON public.emails_log 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update email logs" 
ON public.emails_log 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_organizations_updated_at
BEFORE UPDATE ON public.organizations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_diagnostics_updated_at
BEFORE UPDATE ON public.diagnostics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();