-- ============================================
-- VERIFICAR SE O PERFIL FOI INSERIDO
-- ============================================

-- 1. Ver todos os perfis (simples)
SELECT * FROM profiles;

-- 2. Ver perfis com detalhes
SELECT
  p.id,
  p.user_id,
  p.full_name,
  p.role,
  p.tenant_id,
  p.created_at
FROM profiles p;

-- 3. Ver com JOIN (tenants)
SELECT
  p.full_name,
  p.role,
  p.tenant_id,
  t.name as tenant_name
FROM profiles p
LEFT JOIN tenants t ON p.tenant_id = t.id;

-- 4. Ver com JOIN (users)
SELECT
  p.full_name,
  p.role,
  u.email
FROM profiles p
LEFT JOIN auth.users u ON p.user_id = u.id;

-- 5. Ver com JOIN completo
SELECT
  p.user_id,
  p.full_name,
  p.role,
  p.tenant_id,
  t.name as tenant_name,
  u.email
FROM profiles p
LEFT JOIN auth.users u ON p.user_id = u.id
LEFT JOIN tenants t ON p.tenant_id = t.id;

-- 6. Contar quantos perfis existem
SELECT COUNT(*) as total_profiles FROM profiles;

-- 7. Se não existir nenhum perfil, inserir manualmente
INSERT INTO profiles (user_id, full_name, role, tenant_id)
VALUES (
  'fd0d6dc3-a008-4fa2-9ad9-33613698ea7c'::uuid,
  'Douglas Senturião',
  'admin',
  'bf798e9e-8326-435d-9d9d-8f725dd317bc'::uuid
)
ON CONFLICT (user_id) DO NOTHING;

-- 8. Verificar novamente
SELECT * FROM profiles;
