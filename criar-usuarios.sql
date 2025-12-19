-- ============================================
-- SCRIPT AUXILIAR - CRIAR PERFIS DOS USUÁRIOS
-- LGC Consultoria - Portal de Cultura
-- ============================================

-- IMPORTANTE: Antes de executar este script, você precisa:
-- 1. Criar os usuários manualmente no painel Authentication do Supabase
-- 2. Copiar o UUID (user_id) de cada usuário criado
-- 3. Substituir os valores 'UUID_AQUI' pelos UUIDs reais

-- ============================================
-- EXEMPLO DE COMO CRIAR OS PERFIS
-- ============================================

-- PASSO 1: Verificar se a tabela profiles existe
SELECT * FROM profiles LIMIT 1;

-- PASSO 2: Listar todos os usuários do Authentication
-- (Execute no console do Supabase ou use a API)
-- SELECT id, email FROM auth.users;

-- ============================================
-- INSERIR PERFIS
-- ============================================

-- 1. AWDREN - Admin
-- Substitua 'UUID_AWDREN' pelo UUID real do usuário
INSERT INTO profiles (user_id, full_name, role, tenant_id)
VALUES (
  'UUID_AWDREN',  -- Substitua pelo UUID real
  'Awdren',
  'admin',
  'lgc_consultoria'
);

-- 2. ALINE - Staff
INSERT INTO profiles (user_id, full_name, role, tenant_id)
VALUES (
  'UUID_ALINE',  -- Substitua pelo UUID real
  'Aline',
  'staff',
  'lgc_consultoria'
);

-- 3. HÉLIO - Staff
INSERT INTO profiles (user_id, full_name, role, tenant_id)
VALUES (
  'UUID_HELIO',  -- Substitua pelo UUID real
  'Hélio',
  'staff',
  'lgc_consultoria'
);

-- 4. JULLIANO - Staff
INSERT INTO profiles (user_id, full_name, role, tenant_id)
VALUES (
  'UUID_JULLIANO',  -- Substitua pelo UUID real
  'Julliano',
  'staff',
  'lgc_consultoria'
);

-- 5. MURIEL - Staff
INSERT INTO profiles (user_id, full_name, role, tenant_id)
VALUES (
  'UUID_MURIEL',  -- Substitua pelo UUID real
  'Muriel',
  'staff',
  'lgc_consultoria'
);

-- 6. NICOLE - Staff
INSERT INTO profiles (user_id, full_name, role, tenant_id)
VALUES (
  'UUID_NICOLE',  -- Substitua pelo UUID real
  'Nicole',
  'staff',
  'lgc_consultoria'
);

-- 7. RENATA TARSITANO - Cliente (Consultora CNP)
INSERT INTO profiles (user_id, full_name, role, tenant_id)
VALUES (
  'UUID_RENATA',  -- Substitua pelo UUID real
  'Renata Tarsitano',
  'client',
  'lgc_consultoria'
);

-- ============================================
-- VERIFICAR SE OS PERFIS FORAM CRIADOS
-- ============================================

SELECT
  p.full_name AS "Nome",
  p.role AS "Role",
  p.tenant_id AS "Tenant",
  u.email AS "Email",
  p.created_at AS "Criado em"
FROM profiles p
JOIN auth.users u ON p.user_id = u.id
ORDER BY
  CASE p.role
    WHEN 'admin' THEN 1
    WHEN 'staff' THEN 2
    WHEN 'client' THEN 3
  END,
  p.full_name;

-- ============================================
-- COMO OBTER OS UUIDs DOS USUÁRIOS
-- ============================================

-- Opção 1: Via SQL (se tiver acesso)
-- SELECT id as user_id, email FROM auth.users;

-- Opção 2: Via painel do Supabase
-- 1. Vá para Authentication > Users
-- 2. Clique no usuário
-- 3. Copie o "User UID" que aparece

-- ============================================
-- EXEMPLO COMPLETO (SUBSTITUA OS UUIDS)
-- ============================================

/*
-- Supondo que os UUIDs sejam:
-- Awdren: a1b2c3d4-e5f6-7890-abcd-ef1234567890
-- Aline: b2c3d4e5-f6a7-8901-bcde-f12345678901
-- etc...

INSERT INTO profiles (user_id, full_name, role, tenant_id) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Awdren', 'admin', 'lgc_consultoria'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Aline', 'staff', 'lgc_consultoria'),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Hélio', 'staff', 'lgc_consultoria'),
  ('d4e5f6a7-b8c9-0123-def1-234567890123', 'Julliano', 'staff', 'lgc_consultoria'),
  ('e5f6a7b8-c9d0-1234-ef12-345678901234', 'Muriel', 'staff', 'lgc_consultoria'),
  ('f6a7b8c9-d0e1-2345-f123-456789012345', 'Nicole', 'staff', 'lgc_consultoria'),
  ('a7b8c9d0-e1f2-3456-1234-567890123456', 'Renata Tarsitano', 'client', 'lgc_consultoria');
*/

-- ============================================
-- ATUALIZAR UM PERFIL (se necessário)
-- ============================================

-- Alterar o role de um usuário
-- UPDATE profiles
-- SET role = 'admin'
-- WHERE user_id = 'UUID_DO_USUARIO';

-- Alterar o nome
-- UPDATE profiles
-- SET full_name = 'Novo Nome'
-- WHERE user_id = 'UUID_DO_USUARIO';

-- ============================================
-- DELETAR UM PERFIL (se necessário)
-- ============================================

-- DELETE FROM profiles
-- WHERE user_id = 'UUID_DO_USUARIO';

-- ============================================
-- EMAILS SUGERIDOS PARA CRIAR NO AUTHENTICATION
-- ============================================

/*
1. awdren@lgcconsultoria.com.br (Admin)
2. aline@lgcconsultoria.com.br (Staff)
3. helio@lgcconsultoria.com.br (Staff)
4. julliano@lgcconsultoria.com.br (Staff)
5. muriel@lgcconsultoria.com.br (Staff)
6. nicole@lgcconsultoria.com.br (Staff)
7. renata.tarsitano@cnp.com.br (Cliente)
*/

-- Senha sugerida inicial: LGC@2025!temp
-- (Os usuários devem alterar no primeiro login)
