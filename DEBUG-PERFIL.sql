-- ============================================
-- DEBUG: Verificar Perfil do Usuário
-- ============================================

-- 1. Verificar se o perfil existe
SELECT * FROM profiles
WHERE user_id = 'fd0d6dc3-a008-4fa2-9ad9-33613698ea7c';

-- 2. Ver TODOS os perfis que existem
SELECT
  user_id,
  full_name,
  role,
  tenant_id,
  created_at
FROM profiles;

-- 3. Verificar as políticas RLS (Row Level Security)
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- 4. Verificar se RLS está ativado
SELECT
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'profiles';

-- ============================================
-- SOLUÇÕES POSSÍVEIS
-- ============================================

-- Se o perfil NÃO existe, insira-o:
-- INSERT INTO profiles (user_id, full_name, role, tenant_id)
-- VALUES (
--   'fd0d6dc3-a008-4fa2-9ad9-33613698ea7c',
--   'Douglas Senturião',
--   'admin',
--   'lgc_consultoria'
-- );

-- Se RLS está bloqueando, TEMPORARIAMENTE desative (APENAS PARA TESTE!):
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Depois de inserir o perfil, REATIVE o RLS:
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- VERIFICAÇÃO FINAL
-- ============================================

-- Ver o perfil junto com o email do usuário
SELECT
  p.user_id,
  p.full_name,
  p.role,
  p.tenant_id,
  u.email
FROM profiles p
JOIN auth.users u ON p.user_id = u.id
WHERE p.user_id = 'fd0d6dc3-a008-4fa2-9ad9-33613698ea7c';
