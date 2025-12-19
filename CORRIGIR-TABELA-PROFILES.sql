-- ============================================
-- CORRIGIR TABELA PROFILES
-- Atualizar para usar UUID no tenant_id
-- ============================================

-- 1. Deletar tabela antiga se existir
DROP TABLE IF EXISTS profiles CASCADE;

-- 2. Criar tabela profiles CORRETA (com tenant_id como UUID)
CREATE TABLE profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'staff', 'client')),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Criar índices
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_tenant_id ON profiles(tenant_id);
CREATE INDEX idx_profiles_role ON profiles(role);

-- 4. Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 5. Criar políticas
CREATE POLICY "allow_select_for_authenticated" ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "allow_update_own_profile" ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- 6. Criar função de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Criar trigger
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INSERIR PERFIL DO USUÁRIO
-- ============================================

-- 8. Inserir perfil do Douglas
INSERT INTO profiles (user_id, full_name, role, tenant_id)
SELECT
  u.id as user_id,
  'Douglas Senturião' as full_name,
  'admin' as role,
  t.id as tenant_id
FROM auth.users u
CROSS JOIN tenants t
WHERE u.email = 'contato@lgcitacaogc.com.br'
  AND t.name = 'LGC Consultoria';

-- 9. Verificar resultado
SELECT
  p.id,
  p.user_id,
  p.full_name,
  p.role,
  t.name as tenant_name,
  u.email,
  p.created_at
FROM profiles p
JOIN auth.users u ON p.user_id = u.id
JOIN tenants t ON p.tenant_id = t.id;

-- ============================================
-- RESULTADO ESPERADO
-- ============================================
-- Deve mostrar:
-- user_id: fd0d6dc3-a008-4fa2-9ad9-33613698ea7c
-- full_name: Douglas Senturião
-- role: admin
-- tenant_name: LGC Consultoria
-- email: contato@lgcitacaogc.com.br
