-- ============================================
-- SUPABASE SETUP - LGC CONSULTORIA
-- Portal de Cultura Organizacional
-- ============================================

-- 1. Criar tabela de perfis de usuários
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'staff', 'client')),
  tenant_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_tenant_id ON profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 3. Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas de acesso

-- Política: Usuários podem ver seu próprio perfil
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Usuários podem atualizar seu próprio perfil
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Política: Admins podem ver todos os perfis
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- 5. Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Criar trigger para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INSERIR USUÁRIOS DA LGC CONSULTORIA
-- ============================================
-- IMPORTANTE: Execute este script no SQL Editor do Supabase
-- APÓS criar os usuários no Authentication do Supabase
-- ============================================

-- Nota: Você precisa primeiro criar os usuários no painel de Authentication do Supabase
-- e depois executar os INSERTs abaixo substituindo os UUIDs pelos IDs reais dos usuários

-- Exemplo de INSERT (substitua 'USER_UUID_AQUI' pelo UUID real do usuário):

-- Admin - LGC Consultoria
-- INSERT INTO profiles (user_id, full_name, role, tenant_id)
-- VALUES ('USER_UUID_AWDREN', 'Awdren', 'admin', 'lgc_consultoria');

-- Staff - Equipe LGC
-- INSERT INTO profiles (user_id, full_name, role, tenant_id)
-- VALUES ('USER_UUID_ALINE', 'Aline', 'staff', 'lgc_consultoria');

-- INSERT INTO profiles (user_id, full_name, role, tenant_id)
-- VALUES ('USER_UUID_HELIO', 'Hélio', 'staff', 'lgc_consultoria');

-- INSERT INTO profiles (user_id, full_name, role, tenant_id)
-- VALUES ('USER_UUID_JULLIANO', 'Julliano', 'staff', 'lgc_consultoria');

-- INSERT INTO profiles (user_id, full_name, role, tenant_id)
-- VALUES ('USER_UUID_MURIEL', 'Muriel', 'staff', 'lgc_consultoria');

-- INSERT INTO profiles (user_id, full_name, role, tenant_id)
-- VALUES ('USER_UUID_NICOLE', 'Nicole', 'staff', 'lgc_consultoria');

-- Cliente - Consultora CNP
-- INSERT INTO profiles (user_id, full_name, role, tenant_id)
-- VALUES ('USER_UUID_RENATA', 'Renata Tarsitano', 'client', 'lgc_consultoria');

-- ============================================
-- VERIFICAR DADOS
-- ============================================

-- Ver todos os perfis criados
-- SELECT p.full_name, p.role, p.tenant_id, u.email
-- FROM profiles p
-- JOIN auth.users u ON p.user_id = u.id
-- ORDER BY p.role, p.full_name;
