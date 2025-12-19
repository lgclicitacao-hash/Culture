# ✅ Solução: "Não foi possível carregar seu perfil"

## O Problema

✅ Login funcionou (usuário existe no Authentication)
❌ Perfil não foi encontrado (não existe na tabela `profiles`)

---

## Solução em 3 Passos

### Passo 1: Descobrir o UUID do Usuário

**No Supabase**:
1. Vá em **Authentication** > **Users**
2. Encontre o usuário que você criou
3. Clique nele
4. Copie o **User UID** (UUID)

Exemplo: `550e8400-e29b-41d4-a716-446655440000`

---

### Passo 2: Verificar se a Tabela Profiles Existe

**No SQL Editor**, execute:

```sql
-- Ver se a tabela existe
SELECT * FROM profiles LIMIT 1;
```

**Resultado esperado**:
- ✅ Se mostrar colunas vazias = tabela existe
- ❌ Se der erro "relation does not exist" = precisa criar a tabela

**Se a tabela NÃO existe**, execute primeiro o `supabase-setup.sql` completo!

---

### Passo 3: Inserir o Perfil do Usuário

**Substitua `UUID_DO_USUARIO` pelo UUID que você copiou**:

```sql
-- Inserir perfil do primeiro usuário
INSERT INTO profiles (user_id, full_name, role, tenant_id)
VALUES (
  'UUID_DO_USUARIO',  -- ⚠️ SUBSTITUA pelo UUID real!
  'Seu Nome',         -- Nome que aparecerá no sistema
  'admin',            -- Role: 'admin', 'staff' ou 'client'
  'lgc_consultoria'
);
```

**Exemplo real**:
```sql
INSERT INTO profiles (user_id, full_name, role, tenant_id)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Awdren',
  'admin',
  'lgc_consultoria'
);
```

---

### Passo 4: Verificar se Funcionou

Execute no SQL Editor:

```sql
-- Ver todos os perfis
SELECT
  p.full_name,
  p.role,
  p.tenant_id,
  u.email
FROM profiles p
JOIN auth.users u ON p.user_id = u.id;
```

**Resultado esperado**:
```
full_name | role  | tenant_id       | email
----------|-------|-----------------|---------------------------
Awdren    | admin | lgc_consultoria | awdren@lgcconsultoria.com.br
```

---

## 🧪 Teste o Login Novamente

1. Abra `login.html`
2. Faça logout (se ainda estiver logado)
3. Faça login novamente
4. **Deve funcionar!** 🎉

---

## ⚠️ Problemas Comuns

### Erro: "duplicate key value violates unique constraint"
**Causa**: Você já inseriu esse usuário antes
**Solução**:
```sql
-- Deletar e inserir novamente
DELETE FROM profiles WHERE user_id = 'UUID_DO_USUARIO';
-- Depois execute o INSERT novamente
```

### Erro: "relation profiles does not exist"
**Causa**: Tabela `profiles` não foi criada
**Solução**: Execute `supabase-setup.sql` primeiro

### Erro: "insert or update on table violates foreign key constraint"
**Causa**: UUID do usuário não existe no Authentication
**Solução**: Verifique se copiou o UUID correto

---

## 📝 Script Completo (Copie e Cole)

**Ajuste as informações conforme necessário**:

```sql
-- 1. Verificar se a tabela existe
SELECT * FROM profiles LIMIT 1;

-- 2. Ver usuários criados no Authentication (se tiver acesso)
-- SELECT id, email FROM auth.users;

-- 3. Inserir perfil (SUBSTITUA OS VALORES!)
INSERT INTO profiles (user_id, full_name, role, tenant_id)
VALUES (
  'COLE_O_UUID_AQUI',  -- UUID do usuário
  'Nome do Usuário',   -- Nome completo
  'admin',             -- Role: admin, staff ou client
  'lgc_consultoria'    -- Tenant
);

-- 4. Verificar se foi inserido
SELECT
  p.full_name,
  p.role,
  u.email
FROM profiles p
JOIN auth.users u ON p.user_id = u.id;
```

---

## 🎯 Próximos Passos

Depois de inserir o perfil e fazer login com sucesso:

1. ✅ Crie os outros 6 usuários
2. ✅ Insira os perfis de cada um
3. ✅ Teste login com cada tipo de usuário
4. ✅ Verifique as permissões do menu

---

**Dica**: Guarde o UUID de cada usuário em um arquivo de texto conforme cria, para facilitar a inserção dos perfis.

**Exemplo**:
```
awdren@lgcconsultoria.com.br - 550e8400-e29b-41d4-a716-446655440000
aline@lgcconsultoria.com.br - 660e8400-e29b-41d4-a716-446655440001
...
```

---

**Status**: ✅ Login funcionando, aguardando inserção do perfil
**Arquivo**: SOLUCAO-PERFIL.md
