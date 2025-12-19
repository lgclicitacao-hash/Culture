-- ============================================
-- INSERT CORRETO - Versão Explícita
-- ============================================

-- 1. Primeiro, ver a estrutura REAL da tabela
SELECT
  column_name,
  data_type,
  ordinal_position
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. Limpar qualquer dado incorreto
DELETE FROM profiles;

-- 3. INSERT EXPLÍCITO (especificando cada coluna e valor)
INSERT INTO profiles (
  user_id,
  full_name,
  role,
  tenant_id
)
VALUES (
  'fd0d6dc3-a008-4fa2-9ad9-33613698ea7c'::uuid,  -- user_id
  'Douglas Senturião',                            -- full_name
  'admin',                                        -- role
  'lgc_consultoria'                               -- tenant_id
);

-- 4. Verificar se inseriu corretamente
SELECT
  user_id,
  full_name,
  role,
  tenant_id
FROM profiles;

-- 5. Ver junto com o email do Authentication
SELECT
  p.user_id,
  p.full_name,
  p.role,
  p.tenant_id,
  u.email
FROM profiles p
JOIN auth.users u ON p.user_id = u.id;
