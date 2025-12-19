# Configuração do Sistema de Autenticação - LGC Consultoria

## Visão Geral

Este documento descreve como configurar o sistema de autenticação Supabase para o Portal de Cultura Organizacional da LGC Consultoria.

## Informações do Projeto Supabase

- **URL do Projeto**: https://uushczefewuwnictpkqn.supabase.co
- **Anon Key**: `sb_publishable_a4UXyq9feisKV_6Tge459w_7Ioa7U97`

## Usuários do Sistema

### 1. Admin - LGC Consultoria
- **Nome**: Awdren
- **Email**: awdren@lgcconsultoria.com.br
- **Role**: `admin`
- **Permissões**: Acesso total ao sistema, incluindo gestão de usuários e auditoria

### 2. Staff - Equipe LGC Consultoria

#### Aline
- **Email**: aline@lgcconsultoria.com.br
- **Role**: `staff`
- **Permissões**: Acesso a todos os módulos exceto admin e auditoria

#### Hélio
- **Email**: helio@lgcconsultoria.com.br
- **Role**: `staff`
- **Permissões**: Acesso a todos os módulos exceto admin e auditoria

#### Julliano
- **Email**: julliano@lgcconsultoria.com.br
- **Role**: `staff`
- **Permissões**: Acesso a todos os módulos exceto admin e auditoria

#### Muriel
- **Email**: muriel@lgcconsultoria.com.br
- **Role**: `staff`
- **Permissões**: Acesso a todos os módulos exceto admin e auditoria

#### Nicole
- **Email**: nicole@lgcconsultoria.com.br
- **Role**: `staff`
- **Permissões**: Acesso a todos os módulos exceto admin e auditoria

### 3. Cliente - Consultora CNP

#### Renata Tarsitano
- **Email**: renata.tarsitano@cnp.com.br
- **Role**: `client`
- **Permissões**: Acesso aos módulos de visualização (dashboard, timeline, journey, deliverables, meetings, documents, tasks, assessment)

## Passos para Configuração

### Passo 1: Criar Tabela de Perfis no Supabase

1. Acesse o painel do Supabase: https://app.supabase.com
2. Vá para o projeto: uushczefewuwnictpkqn
3. Navegue para **SQL Editor**
4. Execute o script `supabase-setup.sql` completo

### Passo 2: Criar Usuários no Authentication

1. No painel do Supabase, vá para **Authentication** > **Users**
2. Clique em **Add user** (ou **Invite user**)
3. Para cada usuário da lista acima:
   - Insira o email
   - Defina uma senha inicial (ou deixe o Supabase gerar)
   - Marque **Auto Confirm User** (para não precisar confirmar email)
   - Clique em **Create user**

**Senhas sugeridas iniciais** (alterar no primeiro login):
- Todos: `LGC@2025!temp`

### Passo 3: Inserir Perfis na Tabela

Após criar cada usuário no Authentication, você precisará copiar o UUID do usuário e criar o perfil correspondente:

1. No **Authentication** > **Users**, clique no usuário criado
2. Copie o **User UID** (UUID)
3. Vá para **SQL Editor** e execute:

```sql
-- Exemplo para Awdren (Admin)
INSERT INTO profiles (user_id, full_name, role, tenant_id)
VALUES ('UUID_DO_USUARIO_AWDREN', 'Awdren', 'admin', 'lgc_consultoria');

-- Exemplo para Aline (Staff)
INSERT INTO profiles (user_id, full_name, role, tenant_id)
VALUES ('UUID_DO_USUARIO_ALINE', 'Aline', 'staff', 'lgc_consultoria');

-- Exemplo para Hélio (Staff)
INSERT INTO profiles (user_id, full_name, role, tenant_id)
VALUES ('UUID_DO_USUARIO_HELIO', 'Hélio', 'staff', 'lgc_consultoria');

-- Exemplo para Julliano (Staff)
INSERT INTO profiles (user_id, full_name, role, tenant_id)
VALUES ('UUID_DO_USUARIO_JULLIANO', 'Julliano', 'staff', 'lgc_consultoria');

-- Exemplo para Muriel (Staff)
INSERT INTO profiles (user_id, full_name, role, tenant_id)
VALUES ('UUID_DO_USUARIO_MURIEL', 'Muriel', 'staff', 'lgc_consultoria');

-- Exemplo para Nicole (Staff)
INSERT INTO profiles (user_id, full_name, role, tenant_id)
VALUES ('UUID_DO_USUARIO_NICOLE', 'Nicole', 'staff', 'lgc_consultoria');

-- Exemplo para Renata Tarsitano (Cliente)
INSERT INTO profiles (user_id, full_name, role, tenant_id)
VALUES ('UUID_DO_USUARIO_RENATA', 'Renata Tarsitano', 'client', 'lgc_consultoria');
```

### Passo 4: Verificar Configuração

Execute no SQL Editor para verificar se todos os perfis foram criados corretamente:

```sql
SELECT
  p.full_name,
  p.role,
  p.tenant_id,
  u.email,
  p.created_at
FROM profiles p
JOIN auth.users u ON p.user_id = u.id
ORDER BY p.role, p.full_name;
```

## Estrutura de Permissões

### Admin (`admin`)
- Dashboard
- Timeline
- Journey
- Deliverables
- Meetings
- Documents
- Tasks
- Assessment
- **Employees** (gestão de colaboradores)
- **Admin** (configurações)
- **Audit** (auditoria)

### Staff (`staff`)
- Dashboard
- Timeline
- Journey
- Deliverables
- Meetings
- Documents
- Tasks
- Assessment
- **Employees** (gestão de colaboradores)

### Client (`client`)
- Dashboard
- Timeline
- Journey
- Deliverables
- Meetings
- Documents
- Tasks
- Assessment

## Arquivos do Sistema

### Frontend
- `login.html` - Página de login
- `index.html` - Aplicação principal (com auth guard)
- `app.js` - Router e gerenciamento de autenticação
- `supabase-config.js` - Configuração centralizada do Supabase

### Backend (Supabase)
- `supabase-setup.sql` - Script de criação de tabelas e políticas

## Como Testar

1. Abra `login.html` no navegador
2. Faça login com um dos usuários criados
3. Verifique se o redirecionamento funciona
4. Teste o menu lateral - deve mostrar apenas os módulos permitidos para o role do usuário
5. Teste o logout - deve redirecionar para login.html

## Mudança de Senha

Os usuários podem alterar suas senhas através do painel de configurações do Supabase ou você pode criar uma página de "Esqueci minha senha" usando o método `supabase.auth.resetPasswordForEmail()`.

## Suporte

Para problemas ou dúvidas:
1. Verificar logs no console do navegador (F12)
2. Verificar logs no painel do Supabase (Logs & Analytics)
3. Revisar políticas RLS na tabela `profiles`

## Próximos Passos (Opcional)

1. Implementar confirmação de email para novos usuários
2. Adicionar página de "Esqueci minha senha"
3. Implementar alteração de senha pelo próprio usuário
4. Adicionar auditoria de logins
5. Implementar refresh token automático
6. Adicionar 2FA (autenticação de dois fatores)
