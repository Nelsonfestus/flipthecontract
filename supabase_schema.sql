-- CRM Tables for Flip the Contract

-- 1. CRM Items (Leads, Offers, Outreach, and Pipeline Deals)
CREATE TABLE IF NOT EXISTS crm_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'lead', 'offer', 'sent', 'pipeline'
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  notes TEXT,
  status TEXT, -- Status within the list (e.g. 'New Lead', 'Accepted')
  pipeline_stage TEXT, -- Stage on the pipeline board (e.g. 'Negotiating')
  amount NUMERIC,
  price NUMERIC,
  metadata JSONB DEFAULT '{}', -- Catch-all for extra fields
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE crm_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own crm_items" ON crm_items
  FOR ALL USING (auth.uid() = user_id);

-- 2. Contacts
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  address TEXT,
  role TEXT NOT NULL DEFAULT 'other',
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  source TEXT,
  last_contacted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own contacts" ON contacts
  FOR ALL USING (auth.uid() = user_id);

-- 3. Tasks
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'todo',
  due_date TIMESTAMPTZ,
  related_deal_id UUID REFERENCES crm_items(id) ON DELETE SET NULL,
  contact_name TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own tasks" ON tasks
  FOR ALL USING (auth.uid() = user_id);

-- 4. Activities
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('email', 'call', 'meeting', 'note')),
  subject TEXT NOT NULL,
  description TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  deal_id UUID REFERENCES crm_items(id) ON DELETE SET NULL,
  attachments JSONB DEFAULT '[]', -- List of attachment objects
  reminder JSONB, -- { date: string, note: string, completed: boolean }
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own activities" ON activities
  FOR ALL USING (auth.uid() = user_id);

-- 5. Deal Scores (History)
CREATE TABLE IF NOT EXISTS deal_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  result JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE deal_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own deal_scores" ON deal_scores
  FOR ALL USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_crm_items_updated_at BEFORE UPDATE ON crm_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_crm_items_user ON crm_items(user_id);
CREATE INDEX idx_contacts_user ON contacts(user_id);
CREATE INDEX idx_tasks_user ON tasks(user_id);
CREATE INDEX idx_activities_user ON activities(user_id);
CREATE INDEX idx_deal_scores_user ON deal_scores(user_id);
