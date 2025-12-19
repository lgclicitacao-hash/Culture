-- ============================================
-- CORREÇÃO: INSERT com ordem correta
-- ============================================

-- 1. Primeiro, limpar qualquer dado incorreto
DELETE FROM profiles
WHERE user_id = 'fd0d6dc3-a008-4fa2-9ad9-33613698ea7c';

-- 2. Inserir com a ORDEM CORRETA das colunas
INSERT INTO profiles (user_id, full_name, role, tenant_id)
VALUES (
  'fd0d6dc3-a008-4fa2-9ad9-33613698ea7c',  -- user_id (UUID)
  'Douglas Senturião',                      -- full_name (TEXT)
  'admin',                                  -- role (TEXT)
  'lgc_consultoria'                         -- tenant_id (TEXT)
);

-- 3. Verificar se foi inserido corretamente
SELECT
  user_id,
  full_name,
  role,
  tenant_id,
  created_at
FROM profiles
WHERE user_id = 'fd0d6dc3-a008-4fa2-9ad9-33613698ea7c';

-- 4. Ver junto com o email
SELECT
  p.user_id,
  p.full_name,
  p.role,
  p.tenant_id,
  u.email
FROM profiles p
JOIN auth.users u ON p.user_id = u.id
WHERE p.user_id = 'fd0d6dc3-a008-4fa2-9ad9-33613698ea7c';

-- ============================================
-- CORRIGIR RLS (Row Level Security)
-- ============================================

-- 5. Garantir que RLS está configurado corretamente
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 6. Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "allow_select_all_profiles_authenticated" ON profiles;

-- 7. Criar política simples que funciona
CREATE POLICY "enable_select_for_authenticated_users" ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- RESULTADO ESPERADO
-- ============================================
-- Deve mostrar:
-- user_id: fd0d6dc3-a008-4fa2-9ad9-33613698ea7c
-- full_name: Douglas Senturião
-- role: admin
-- tenant_id: lgc_consultoria
-- email: contato@lgcitacaogc.com.br
