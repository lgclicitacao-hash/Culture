# Guia Rápido - Portal LGC Consultoria

## 🚀 Início Rápido

### Para Testar Localmente

1. **Abra o arquivo `login.html` no navegador**
   - Pode usar um servidor local (Live Server, Python HTTP Server, etc.)
   - Ou simplesmente abrir diretamente no navegador

2. **Configure o Supabase** (se ainda não configurou)
   - Siga as instruções em `SETUP-SUPABASE.md`
   - Execute o script `supabase-setup.sql`
   - Crie os usuários no painel do Supabase

3. **Faça login com um dos usuários criados**

## 👥 Usuários do Sistema

### Admin
- **Awdren** - Acesso total ao sistema

### Staff (Equipe LGC)
- **Aline** - Colaboradora
- **Hélio** - Colaborador
- **Julliano** - Colaborador
- **Muriel** - Colaboradora
- **Nicole** - Colaboradora

### Cliente
- **Renata Tarsitano** - Consultora CNP

## 🔐 Sistema de Permissões

O sistema possui 3 níveis de acesso:

### 1. Cliente (`client`)
Pode acessar:
- ✅ Dashboard
- ✅ Linha do Tempo
- ✅ Jornada
- ✅ Entregáveis
- ✅ Reuniões
- ✅ Documentos
- ✅ Tarefas
- ✅ Assessment

### 2. Staff (`staff`)
Tudo do Cliente +
- ✅ Funcionários (gestão de colaboradores)

### 3. Admin (`admin`)
Tudo do Staff +
- ✅ Configurações de Admin
- ✅ Auditoria

## 📁 Estrutura de Arquivos

```
Cultura/
├── index.html              # Página principal (protegida)
├── login.html              # Página de login
├── app.js                  # Router e autenticação
├── data.js                 # Dados do projeto
├── styles.css              # Estilos
├── supabase-config.js      # Config do Supabase
├── supabase-setup.sql      # Script de setup do DB
├── SETUP-SUPABASE.md       # Instruções de configuração
├── GUIA-RAPIDO.md          # Este arquivo
│
├── components/
│   ├── dashboard.js
│   ├── timeline.js
│   ├── journey.js
│   ├── deliverables.js
│   ├── meetings.js
│   ├── employees.js
│   ├── assessment.js
│   ├── manual.js
│   └── contract.js
│
├── img/                    # Imagens
├── assets/                 # Recursos
├── contrato/               # Documentos de contrato
└── manual de cultura/      # Manual de cultura
```

## 🔧 Como Funciona

### Fluxo de Autenticação

1. **Usuário acessa index.html**
   - Script verifica se há sessão ativa no Supabase
   - Se não houver, redireciona para `/login.html`

2. **Usuário faz login em login.html**
   - Credenciais são validadas pelo Supabase Auth
   - Perfil do usuário é carregado da tabela `profiles`
   - Perfil é salvo no localStorage como cache
   - Redireciona para `/index.html`

3. **Sistema carrega com permissões**
   - Menu lateral mostra apenas módulos permitidos
   - Navegação é controlada por role

4. **Logout**
   - Limpa sessão do Supabase
   - Limpa cache do localStorage
   - Redireciona para `/login.html`

## 🎯 Próximas Funcionalidades

- [ ] Página de recuperação de senha
- [ ] Troca de senha pelo usuário
- [ ] Upload de documentos
- [ ] Notificações em tempo real
- [ ] Chat integrado
- [ ] Dashboard com gráficos dinâmicos
- [ ] Exportação de relatórios (PDF/Excel)

## 🐛 Troubleshooting

### Login não funciona
- Verifique se o usuário foi criado no Supabase Authentication
- Verifique se o perfil foi inserido na tabela `profiles`
- Verifique o console do navegador (F12) para erros
- Confirme que as credenciais estão corretas

### Menu não aparece
- Verifique se o role do usuário está correto na tabela `profiles`
- Limpe o cache do navegador
- Verifique o localStorage (F12 > Application > Local Storage)

### Redirecionamento em loop
- Limpe todo o localStorage
- Faça logout e login novamente
- Verifique se há sessão válida no Supabase

### Permissões não funcionam
- Verifique se o role está escrito corretamente: `admin`, `staff` ou `client`
- Execute a query de verificação no SQL Editor do Supabase
- Faça logout e login novamente para recarregar o perfil

## 📧 Contato

Para suporte técnico ou dúvidas sobre o sistema, entre em contato com a equipe de desenvolvimento.

---

**Versão**: 1.0
**Última atualização**: Dezembro 2024
