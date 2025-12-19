# 🔧 Solução Definitiva - Perfil Não Carrega

## Diagnóstico

Você confirmou que:
- ✅ UUID existe no Authentication: `fd0d6dc3-a008-4fa2-9ad9-33613698ea7c`
- ✅ UUID existe na tabela `profiles`
- ❌ Ainda aparece erro: "Não foi possível carregar seu perfil"

## Possíveis Causas

### 1. Row Level Security (RLS) Bloqueando o Acesso

O RLS pode estar impedindo que o usuário veja seu próprio perfil devido às políticas configuradas.

### 2. Nome das Colunas Diferente

A query procura por `role, tenant_id, full_name` mas a tabela pode ter nomes diferentes.

### 3. Valor NULL em Alguma Coluna

Se alguma coluna obrigatória estiver NULL, pode causar erro.

---

## 🚀 Solução Passo a Passo

### Passo 1: Executar Script de Debug

**No SQL Editor**, execute o arquivo `DEBUG-PERFIL.sql` ou cole este código:

```sql
-- Ver o perfil deste usuário específico
SELECT * FROM profiles
WHERE user_id = 'fd0d6dc3-a008-4fa2-9ad9-33613698ea7c';
```

**O que deve aparecer**:
```
user_id                              | full_name | role  | tenant_id       | created_at
-------------------------------------|-----------|-------|-----------------|-------------------
fd0d6dc3-a008-4fa2-9ad9-33613698ea7c | Douglas   | admin | lgc_consultoria | 2024-12-19 ...
```

---

### Passo 2: Verificar Se Todas as Colunas Existem

```sql
-- Ver estrutura da tabela profiles
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
```

**Resultado esperado**:
- ✅ `user_id` (uuid)
- ✅ `full_name` (text)
- ✅ `role` (text)
- ✅ `tenant_id` (text)

---

### Passo 3: Verificar RLS (Row Level Security)

```sql
-- Ver se RLS está ativo
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'profiles';
```

**Se `rowsecurity = true`**, as políticas RLS estão ativas e podem estar bloqueando.

---

### Passo 4: Solução Temporária - Desabilitar RLS

**⚠️ APENAS PARA TESTE! NÃO USE EM PRODUÇÃO!**

```sql
-- Desabilitar RLS temporariamente
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

Agora tente fazer login novamente. Se funcionar, o problema é RLS.

---

### Passo 5: Solução Definitiva - Corrigir Políticas RLS

Se o problema foi RLS, execute:

```sql
-- Reativar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Deletar políticas antigas (se existirem)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Criar política correta para SELECT
CREATE POLICY "allow_select_own_profile" ON profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Criar política para permitir SELECT de qualquer perfil (necessário para o login)
CREATE POLICY "allow_select_all_profiles_authenticated" ON profiles
  FOR SELECT
  TO authenticated
  USING (true);
```

**Explicação**: A política `allow_select_all_profiles_authenticated` permite que qualquer usuário autenticado leia perfis. Isso é necessário para o login funcionar.

---

### Passo 6: Se o Perfil Não Existir ou Estiver Incompleto

```sql
-- Deletar perfil antigo (se houver)
DELETE FROM profiles
WHERE user_id = 'fd0d6dc3-a008-4fa2-9ad9-33613698ea7c';

-- Inserir perfil correto
INSERT INTO profiles (user_id, full_name, role, tenant_id)
VALUES (
  'fd0d6dc3-a008-4fa2-9ad9-33613698ea7c',
  'Douglas Senturião',
  'admin',
  'lgc_consultoria'
);
```

---

### Passo 7: Verificar Console do Navegador

Abra o console (F12) e veja se há erros mais específicos:

1. Abra `login.html`
2. Pressione F12
3. Vá na aba **Console**
4. Tente fazer login
5. Veja o erro exato que aparece

**Procure por**:
- `Erro ao buscar perfil:`
- Mensagens do Supabase
- Erros de permissão

---

## 🧪 Script Completo de Solução

**Execute este script no SQL Editor**:

```sql
-- ============================================
-- SOLUÇÃO COMPLETA
-- ============================================

-- 1. Desabilitar RLS temporariamente
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 2. Deletar perfil antigo
DELETE FROM profiles
WHERE user_id = 'fd0d6dc3-a008-4fa2-9ad9-33613698ea7c';

-- 3. Inserir perfil novo
INSERT INTO profiles (user_id, full_name, role, tenant_id)
VALUES (
  'fd0d6dc3-a008-4fa2-9ad9-33613698ea7c',
  'Douglas Senturião',
  'admin',
  'lgc_consultoria'
);

-- 4. Verificar se foi inserido
SELECT * FROM profiles
WHERE user_id = 'fd0d6dc3-a008-4fa2-9ad9-33613698ea7c';

-- 5. Reativar RLS com políticas corretas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 6. Criar políticas corretas
DROP POLICY IF EXISTS "allow_select_all_profiles_authenticated" ON profiles;

CREATE POLICY "allow_select_all_profiles_authenticated" ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- 7. Verificação final
SELECT
  p.user_id,
  p.full_name,
  p.role,
  p.tenant_id,
  u.email
FROM profiles p
JOIN auth.users u ON p.user_id = u.id
WHERE p.user_id = 'fd0d6dc3-a008-4fa2-9ad9-33613698ea7c';
```

**Resultado esperado da verificação final**:
```
user_id      | full_name         | role  | tenant_id       | email
-------------|-------------------|-------|-----------------|---------------------------
fd0d6dc3...  | Douglas Senturião | admin | lgc_consultoria | contato@lgcitacaogc.com.br
```

---

## 🎯 Teste Final

1. **Faça logout** (se estiver logado)
2. **Limpe o localStorage**: Console > `localStorage.clear()`
3. **Abra login.html** novamente
4. **Faça login** com `contato@lgcitacaogc.com.br`
5. **Deve funcionar!** 🎉

---

## ⚠️ Se Ainda Não Funcionar

**Cole aqui**:
1. O resultado do `SELECT * FROM profiles WHERE user_id = 'fd0d6dc3...'`
2. A mensagem exata do console do navegador (F12)
3. O resultado de `SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'profiles'`

Com essas informações consigo identificar o problema exato!

---

**Arquivos criados**:
- `DEBUG-PERFIL.sql` - Script de debug
- `SOLUCAO-DEFINITIVA.md` - Este arquivo
