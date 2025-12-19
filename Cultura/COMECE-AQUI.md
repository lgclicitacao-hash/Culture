# 🚀 COMECE AQUI - Portal LGC Consultoria

## 👋 Bem-vindo!

Este é o seu guia rápido para começar a usar o Portal de Cultura Organizacional da LGC Consultoria.

---

## ⚡ Setup Rápido (5 Passos)

### Passo 1️⃣: Configure o Supabase (15 min)

**Acesse**: https://app.supabase.com

1. Faça login no Supabase
2. Abra o projeto: `uushczefewuwnictpkqn`
3. Vá em **SQL Editor**
4. Copie e cole o conteúdo de `supabase-setup.sql`
5. Clique em **Run** ▶️

✅ **Pronto!** Tabela `profiles` criada.

---

### Passo 2️⃣: Crie os Usuários (10 min)

**No Supabase**: Authentication → Users → Add user

Crie estes 7 usuários:

```
1. awdren@lgcconsultoria.com.br         (Admin)
2. aline@lgcconsultoria.com.br          (Staff)
3. helio@lgcconsultoria.com.br          (Staff)
4. julliano@lgcconsultoria.com.br       (Staff)
5. muriel@lgcconsultoria.com.br         (Staff)
6. nicole@lgcconsultoria.com.br         (Staff)
7. renata.tarsitano@cnp.com.br          (Cliente)
```

**Para cada usuário**:
- Senha: `LGC@2025!temp`
- ✅ Marque "Auto Confirm User"
- Copie o **User UID** (UUID)

---

### Passo 3️⃣: Insira os Perfis (5 min)

**No Supabase**: SQL Editor

1. Abra `criar-usuarios.sql`
2. Substitua cada `UUID_AQUI` pelo UUID real do usuário
3. Execute o SQL

**Verifique**:
```sql
SELECT p.full_name, p.role, u.email
FROM profiles p
JOIN auth.users u ON p.user_id = u.id;
```

Deve mostrar 7 usuários ✅

---

### Passo 4️⃣: Teste Localmente (5 min)

**Inicie um servidor local**:

```bash
# Opção 1: Python
python -m http.server 8000

# Opção 2: VS Code Live Server
# Clique com botão direito em login.html > Open with Live Server
```

**Acesse**: http://localhost:8000/login.html

**Teste o login**:
- awdren@lgcconsultoria.com.br / LGC@2025!temp

✅ **Funcionou?** Parabéns! Sistema configurado.

---

### Passo 5️⃣: Deploy (Opcional) (10 min)

**Opção 1: Vercel** (Recomendado)

1. Acesse https://vercel.com
2. Crie uma conta
3. Clique em "New Project"
4. Importe este projeto
5. Deploy automático ✅

**Opção 2: Netlify**

1. Acesse https://netlify.com
2. Arraste a pasta do projeto
3. Deploy automático ✅

---

## 📚 Onde Encontrar Ajuda

### Documentação por Necessidade

| Preciso... | Consulte... |
|-----------|-------------|
| **Entender o projeto** | `README.md` |
| **Configurar o Supabase** | `SETUP-SUPABASE.md` |
| **Usar o sistema** | `GUIA-RAPIDO.md` |
| **Seguir passo a passo** | `CHECKLIST-CONFIGURACAO.md` |
| **Ver próximos passos** | `PROXIMOS-PASSOS.md` |
| **Listar usuários** | `USUARIOS-LGC.txt` |
| **Entender arquivos** | `ARQUIVOS-DO-PROJETO.md` |
| **Resumo executivo** | `RESUMO-EXECUTIVO.md` |

---

## 🎯 Fluxo Simplificado

```
1. Configure Supabase
   ↓
2. Crie Usuários
   ↓
3. Insira Perfis
   ↓
4. Teste Login
   ↓
5. Use o Sistema! 🎉
```

---

## ❓ FAQ Rápido

### **P: O que fazer primeiro?**
**R**: Siga os 5 passos acima na ordem.

### **P: Não consigo fazer login**
**R**: Verifique se:
- Criou o usuário no Authentication
- Inseriu o perfil na tabela `profiles`
- Email e senha estão corretos

### **P: Menu não aparece**
**R**: Faça logout e login novamente. Limpe o cache do navegador.

### **P: Erro de permissão**
**R**: Verifique se o `role` do usuário está correto: `admin`, `staff` ou `client`

### **P: Como adicionar mais usuários?**
**R**:
1. Crie no Authentication (Supabase)
2. Copie o UUID
3. Execute INSERT na tabela `profiles`

---

## 🆘 Problemas?

### Erro ao executar SQL
- Verifique se está logado no projeto correto
- Copie o SQL completo (incluindo comentários está OK)
- Execute linha por linha se necessário

### Login não funciona
1. Abra o Console (F12)
2. Veja erros na aba Console
3. Verifique a aba Network
4. Confirme que o Supabase está configurado

### Página em branco
- Verifique se o servidor local está rodando
- Abra o Console (F12) e veja erros
- Confirme que todos os arquivos `.js` carregaram

---

## 📞 Suporte

### Console do Navegador (F12)
Sempre abra o console para ver erros:
- Chrome/Edge: F12 ou Ctrl+Shift+I
- Firefox: F12 ou Ctrl+Shift+K
- Safari: Cmd+Option+I

### Logs do Supabase
No painel do Supabase:
- Vá em **Logs & Analytics**
- Veja erros de autenticação
- Verifique queries do banco

---

## 🎉 Pronto!

Você está pronto para começar!

**Próximo passo**: Configure o Supabase seguindo o **Passo 1** acima.

Boa sorte! 🚀

---

**Dica**: Mantenha este arquivo aberto enquanto configura o sistema pela primeira vez.

**Tempo total estimado**: 45 minutos

**Dificuldade**: ⭐⭐☆☆☆ (Fácil/Médio)
