-- ============================================
-- VERIFICAR ESTRUTURA DO BANCO
-- ============================================

-- 1. Ver TODAS as tabelas que existem
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- 2. Ver estrutura da tabela tenants
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'tenants'
ORDER BY ordinal_position;

-- 3. Verificar se a tabela profiles existe
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'profiles'
);

-- 4. Se profiles existir, ver sua estrutura
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 5. Ver dados atuais em tenants
SELECT * FROM tenants;

-- ============================================
-- CRIAR TABELA PROFILES (se não existir)
-- ============================================

CREATE TABLE IF NOT EXISTS profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'staff', 'client')),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 6. Criar índices
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_tenant_id ON profiles(tenant_id);

-- 7. Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 8. Criar política de leitura
DROP POLICY IF EXISTS "allow_select_for_authenticated" ON profiles;

CREATE POLICY "allow_select_for_authenticated" ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- INSERIR PERFIL DO USUÁRIO
-- ============================================

-- 9. Inserir perfil usando o tenant_id correto
INSERT INTO profiles (user_id, full_name, role, tenant_id)
SELECT
  id as user_id,
  'Douglas Senturião' as full_name,
  'admin' as role,
  'bf798e9e-8326-435d-9d9d-8f725dd317bc'::uuid as tenant_id
FROM auth.users
WHERE email = 'contato@lgcitacaogc.com.br'
ON CONFLICT (user_id) DO NOTHING;

-- 10. Verificar resultado
SELECT
  p.user_id,
  p.full_name,
  p.role,
  t.name as tenant_name,
  u.email
FROM profiles p
JOIN auth.users u ON p.user_id = u.id
JOIN tenants t ON p.tenant_id = t.id;
