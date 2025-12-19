# Portal de Cultura Organizacional - LGC Consultoria

Sistema de acompanhamento e gestão de projetos de cultura organizacional para a LGC Consultoria.

## 🎯 Sobre o Projeto

Portal web desenvolvido para auxiliar a LGC Consultoria no acompanhamento do projeto de cultura organizacional em parceria com a CNP, com a consultora Renata Tarsitano.

### Funcionalidades Principais

- ✅ **Autenticação segura** com Supabase
- ✅ **Sistema de permissões** baseado em roles (Admin, Staff, Cliente)
- ✅ **Dashboard** com indicadores do projeto
- ✅ **Linha do Tempo** com marcos e progresso
- ✅ **Gestão de Jornada** do colaborador
- ✅ **Entregáveis** e documentação
- ✅ **Reuniões** e acompanhamento
- ✅ **Assessment** de cultura organizacional
- ✅ **Gestão de Funcionários** (para staff/admin)

## 👥 Equipe

### Admin
- **Awdren** - Administrador do sistema

### Staff LGC Consultoria
- **Aline**
- **Hélio**
- **Julliano**
- **Muriel**
- **Nicole**

### Cliente
- **Renata Tarsitano** - Consultora CNP

## 🚀 Como Começar

### Pré-requisitos

- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Projeto configurado no Supabase
- Servidor web local (opcional, mas recomendado)

### Instalação

1. **Clone ou baixe este repositório**

2. **Configure o Supabase**
   ```bash
   # Siga as instruções no arquivo SETUP-SUPABASE.md
   ```

3. **Execute o script SQL**
   - Abra o painel do Supabase
   - Vá para SQL Editor
   - Execute `supabase-setup.sql`

4. **Crie os usuários**
   - Siga as instruções em `criar-usuarios.sql`
   - Crie os usuários no Authentication
   - Insira os perfis na tabela `profiles`

5. **Abra o sistema**
   ```bash
   # Opção 1: Com servidor local (recomendado)
   python -m http.server 8000
   # Acesse: http://localhost:8000/login.html

   # Opção 2: Diretamente no navegador
   # Abra o arquivo login.html
   ```

## 📁 Estrutura do Projeto

```
Cultura/
├── 📄 index.html              # Aplicação principal
├── 📄 login.html              # Página de login
├── 📄 app.js                  # Router e autenticação
├── 📄 data.js                 # Dados do projeto
├── 📄 styles.css              # Estilos CSS
├── 📄 supabase-config.js      # Configuração Supabase
│
├── 📂 components/             # Componentes da aplicação
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
├── 📂 img/                    # Imagens e assets
├── 📂 assets/                 # Recursos adicionais
├── 📂 contrato/               # Documentos de contrato
├── 📂 manual de cultura/      # Manual de cultura
│
├── 📝 supabase-setup.sql      # Setup do banco de dados
├── 📝 criar-usuarios.sql      # Script auxiliar de usuários
├── 📖 SETUP-SUPABASE.md       # Guia de configuração
├── 📖 GUIA-RAPIDO.md          # Guia rápido de uso
└── 📖 README.md               # Este arquivo
```

## 🔐 Sistema de Permissões

### Cliente (`client`)
Acesso aos módulos de visualização e acompanhamento:
- Dashboard, Timeline, Jornada, Entregáveis, Reuniões, Documentos, Tarefas, Assessment

### Staff (`staff`)
Tudo do Cliente + gestão de colaboradores:
- Funcionários

### Admin (`admin`)
Acesso total ao sistema:
- Todas as funcionalidades + Configurações + Auditoria

## 🔧 Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Autenticação**: Supabase Auth
- **Banco de Dados**: PostgreSQL (Supabase)
- **CDN**: ESM.sh (para módulos JavaScript)

## 📚 Documentação

- [SETUP-SUPABASE.md](./SETUP-SUPABASE.md) - Guia completo de configuração do Supabase
- [GUIA-RAPIDO.md](./GUIA-RAPIDO.md) - Guia rápido de uso do sistema
- [criar-usuarios.sql](./criar-usuarios.sql) - Script auxiliar para criação de usuários

## 🐛 Troubleshooting

### Problemas Comuns

**Login não funciona**
- Verifique se os usuários foram criados no Supabase Authentication
- Confirme se os perfis foram inseridos na tabela `profiles`
- Verifique o console do navegador (F12) para erros

**Menu não aparece**
- Verifique se o role está correto na tabela `profiles`
- Limpe o cache do navegador
- Faça logout e login novamente

**Erro de CORS**
- Use um servidor local (não abra o HTML diretamente)
- Configure o CORS no Supabase se necessário

## 🔄 Atualizações Futuras

- [ ] Recuperação de senha por email
- [ ] Troca de senha pelo próprio usuário
- [ ] Upload de documentos
- [ ] Notificações em tempo real
- [ ] Chat integrado
- [ ] Dashboard com gráficos interativos
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] Modo offline
- [ ] PWA (Progressive Web App)

## 📞 Suporte

Para dúvidas ou suporte técnico, entre em contato com a equipe de desenvolvimento.

## 📄 Licença

Este projeto é propriedade da LGC Consultoria. Todos os direitos reservados.

---

**Desenvolvido para LGC Consultoria**
**Versão**: 1.0
**Última atualização**: Dezembro 2024
