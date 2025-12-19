# ✅ Checklist de Configuração - Portal LGC Consultoria

Use este checklist para garantir que todos os passos de configuração foram executados corretamente.

## 📋 Fase 1: Configuração do Supabase

### Passo 1: Criar Projeto no Supabase
- [ ] Acesse https://app.supabase.com
- [ ] Projeto criado: `uushczefewuwnictpkqn`
- [ ] URL do projeto anotada
- [ ] Anon Key copiada e salva

### Passo 2: Configurar Banco de Dados
- [ ] Abra o SQL Editor no Supabase
- [ ] Execute o script `supabase-setup.sql` completo
- [ ] Tabela `profiles` criada com sucesso
- [ ] Índices criados
- [ ] RLS (Row Level Security) habilitado
- [ ] Políticas de acesso criadas
- [ ] Função `update_updated_at_column()` criada
- [ ] Trigger criado

### Passo 3: Verificar Estrutura
Execute no SQL Editor:
```sql
-- Verificar se a tabela existe
\dt profiles

-- Ver estrutura da tabela
\d profiles

-- Ver políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

- [ ] Tabela existe e tem a estrutura correta
- [ ] Políticas RLS estão ativas

## 👥 Fase 2: Criar Usuários

### Passo 1: Criar no Authentication

Acesse Authentication > Users e crie cada usuário:

#### Admin
- [ ] **Awdren** - awdren@lgcconsultoria.com.br
  - UUID copiado: `________________`

#### Staff
- [ ] **Aline** - aline@lgcconsultoria.com.br
  - UUID copiado: `________________`

- [ ] **Hélio** - helio@lgcconsultoria.com.br
  - UUID copiado: `________________`

- [ ] **Julliano** - julliano@lgcconsultoria.com.br
  - UUID copiado: `________________`

- [ ] **Muriel** - muriel@lgcconsultoria.com.br
  - UUID copiado: `________________`

- [ ] **Nicole** - nicole@lgcconsultoria.com.br
  - UUID copiado: `________________`

#### Cliente
- [ ] **Renata Tarsitano** - renata.tarsitano@cnp.com.br
  - UUID copiado: `________________`

### Passo 2: Configurações dos Usuários
Para cada usuário criado:
- [ ] Opção "Auto Confirm User" marcada
- [ ] Senha definida (sugestão: `LGC@2025!temp`)
- [ ] Email confirmado automaticamente

### Passo 3: Inserir Perfis na Tabela

Use o arquivo `criar-usuarios.sql` e substitua os UUIDs:

- [ ] Perfil do Awdren inserido
- [ ] Perfil da Aline inserido
- [ ] Perfil do Hélio inserido
- [ ] Perfil do Julliano inserido
- [ ] Perfil da Muriel inserido
- [ ] Perfil da Nicole inserido
- [ ] Perfil da Renata inserido

### Passo 4: Verificar Perfis

Execute no SQL Editor:
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

Resultado esperado:
- [ ] 1 usuário com role `admin` (Awdren)
- [ ] 5 usuários com role `staff` (Aline, Hélio, Julliano, Muriel, Nicole)
- [ ] 1 usuário com role `client` (Renata Tarsitano)
- [ ] Total: 7 usuários
- [ ] Todos com tenant_id = `lgc_consultoria`

## 🌐 Fase 3: Configurar Aplicação

### Passo 1: Verificar Arquivos
- [ ] Arquivo `login.html` existe
- [ ] Arquivo `index.html` existe
- [ ] Arquivo `app.js` existe e está atualizado
- [ ] Arquivo `supabase-config.js` existe
- [ ] Diretório `components/` existe com todos os arquivos

### Passo 2: Verificar Configurações
Abra os arquivos e confirme:

**login.html**
- [ ] URL do Supabase está correta
- [ ] Anon Key está correta

**index.html**
- [ ] Auth guard está presente no `<script type="module">`
- [ ] URL do Supabase está correta
- [ ] Anon Key está correta

**app.js**
- [ ] Import do Supabase está correto
- [ ] URL do Supabase está correta
- [ ] Anon Key está correta
- [ ] Função `canAccessModule()` está implementada
- [ ] Sistema de permissões está configurado

## 🧪 Fase 4: Testes

### Teste 1: Login de Admin
- [ ] Abra `login.html` no navegador
- [ ] Faça login com awdren@lgcconsultoria.com.br
- [ ] Login bem-sucedido
- [ ] Redirecionado para index.html
- [ ] Dashboard carregado corretamente
- [ ] Nome "Awdren" aparece no header
- [ ] Role "Admin" aparece no header
- [ ] Menu lateral mostra TODOS os módulos

### Teste 2: Login de Staff
- [ ] Faça logout
- [ ] Faça login com aline@lgcconsultoria.com.br
- [ ] Login bem-sucedido
- [ ] Nome "Aline" aparece no header
- [ ] Role "Staff" aparece no header
- [ ] Menu lateral mostra módulos de staff (sem Admin/Audit)

### Teste 3: Login de Cliente
- [ ] Faça logout
- [ ] Faça login com renata.tarsitano@cnp.com.br
- [ ] Login bem-sucedido
- [ ] Nome "Renata Tarsitano" aparece no header
- [ ] Role "Cliente" aparece no header
- [ ] Menu lateral mostra apenas módulos de cliente (sem Funcionários)

### Teste 4: Funcionalidades
- [ ] Navegação entre páginas funciona
- [ ] Botão de logout funciona
- [ ] Redirecionamento após logout funciona
- [ ] Acesso direto a index.html sem login redireciona para login.html
- [ ] Não há erros no console do navegador (F12)

### Teste 5: Permissões
- [ ] Cliente NÃO vê módulo "Funcionários"
- [ ] Staff vê módulo "Funcionários"
- [ ] Admin vê TODOS os módulos
- [ ] Cada role vê apenas os módulos permitidos

## 🔒 Fase 5: Segurança

### Verificações de Segurança
- [ ] RLS está habilitado na tabela `profiles`
- [ ] Políticas RLS estão ativas e funcionando
- [ ] Senhas dos usuários são fortes (ou temporárias para primeiro login)
- [ ] Não há credenciais hardcoded no código (exceto anon key que é pública)
- [ ] Auth guard está presente em todas as páginas protegidas

### Teste de Segurança
- [ ] Tentar acessar index.html sem login redireciona para login
- [ ] Logout limpa a sessão completamente
- [ ] Não é possível acessar dados de outros usuários
- [ ] SQL Injection está prevenido (usando prepared statements do Supabase)

## 📱 Fase 6: Finalização

### Documentação
- [ ] README.md criado e atualizado
- [ ] SETUP-SUPABASE.md disponível
- [ ] GUIA-RAPIDO.md disponível
- [ ] Todos os usuários receberam suas credenciais

### Deploy (Opcional)
- [ ] Escolher plataforma de hosting (Vercel, Netlify, GitHub Pages, etc.)
- [ ] Configurar domínio personalizado (se necessário)
- [ ] Configurar SSL/HTTPS
- [ ] Testar em produção
- [ ] Compartilhar URL com a equipe

### Treinamento
- [ ] Equipe LGC treinada no uso do sistema
- [ ] Renata Tarsitano recebeu acesso e instruções
- [ ] Documentação compartilhada com todos

## ✅ Checklist Final

- [ ] ✅ Supabase configurado
- [ ] ✅ Banco de dados criado
- [ ] ✅ Usuários criados
- [ ] ✅ Perfis inseridos
- [ ] ✅ Aplicação configurada
- [ ] ✅ Testes realizados
- [ ] ✅ Segurança verificada
- [ ] ✅ Documentação completa
- [ ] ✅ Sistema em produção (ou pronto para produção)

---

## 📞 Suporte

Se algum item do checklist falhar:

1. **Verifique os logs**
   - Console do navegador (F12)
   - Logs do Supabase (Dashboard > Logs)

2. **Consulte a documentação**
   - SETUP-SUPABASE.md
   - GUIA-RAPIDO.md
   - README.md

3. **Problemas comuns**
   - Ver seção Troubleshooting no README.md

---

**Data de configuração**: _________________
**Configurado por**: _________________
**Status**: ⬜ Em andamento | ⬜ Concluído | ⬜ Com problemas
