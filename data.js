// data.js - Seed de dados fictícios e gerenciamento de LocalStorage

const seedData = {
  tenant: {
    consultantName: "CNP",
    clientCompany: "LGC Consultoria",
    logoPath: "./img/cnplogo.png",
  },
  project: {
    startDate: "2025-11-15",
    endDate: "2026-05-15",
    vigencia: "6 meses",
    status: "Em andamento"
  },
  timeline: {
    milestones: [
      {
        id: "MS1",
        title: "Kickoff do Projeto",
        plannedDate: "2025-11-18",
        actualDate: "2025-11-18",
        status: "Concluído",
        description: "Alinhamento inicial com stakeholders e definição de sponsor"
      },
      {
        id: "MS2",
        title: "Conclusão Diagnóstico Base",
        plannedDate: "2025-11-30",
        actualDate: "2025-11-30",
        status: "Concluído",
        description: "Finalização da pesquisa de clima e entrevistas"
      },
      {
        id: "MS3",
        title: "Workshops de Liderança",
        plannedDate: "2025-12-20",
        actualDate: null,
        status: "Em andamento",
        description: "Série de workshops com lideranças e coordenadores"
      },
      {
        id: "MS4",
        title: "Diagnóstico Follow-up",
        plannedDate: "2026-01-20",
        actualDate: null,
        status: "Não iniciado",
        description: "Segunda rodada de avaliação para medir evolução"
      },
      {
        id: "MS5",
        title: "Plano de Ação Aprovado",
        plannedDate: "2026-02-10",
        actualDate: null,
        status: "Não iniciado",
        description: "Roadmap 90 dias com responsáveis definidos"
      },
      {
        id: "MS6",
        title: "Encerramento do Projeto",
        plannedDate: "2026-05-15",
        actualDate: null,
        status: "Não iniciado",
        description: "Apresentação final e entrega de documentação"
      }
    ]
  },
  nextSteps: [
    {
      id: "NS1",
      title: "Workshop Liderança 2",
      dueDate: "2025-12-15",
      responsible: "CNP - Fernando",
      department: "Geral",
      description: "Segunda sessão de desenvolvimento de lideranças",
      status: "Pendente"
    },
    {
      id: "NS2",
      title: "Finalizar Mapa de Alavancas",
      dueDate: "2025-12-18",
      responsible: "CNP - Nicole",
      department: "Geral",
      description: "Consolidação das principais alavancas de mudança cultural",
      status: "Pendente"
    },
    {
      id: "NS3",
      title: "Preparar Diagnóstico 2",
      dueDate: "2025-12-28",
      responsible: "CNP - Juliano",
      department: "Geral",
      description: "Elaborar questionário e agendar entrevistas",
      status: "Pendente"
    }
  ],
  documents: {
    cultureManual: {
      title: "Manual de Cultura - Versão 1.0",
      pdfPath: "./manual de cultura/Cultura-Organizacional (1).pdf",
      version: "1.0",
      approvedBy: "CNP - Consultoria",
      approvedAt: "2025-11-28",
      status: "Aprovado"
    },
    contract: {
      title: "Contrato de Consultoria CNP",
      pdfPath: "./contrato/relatorio-informacoes-gerais-protocolo-2829699.pdf",
      plan: "Implementação + Acompanhamento (6 meses)",
      startDate: "2025-11-15",
      endDate: "2026-05-15",
      billingStatus: "Em dia",
      scope: ["Diagnóstico", "Workshops", "Plano de Ação", "Acompanhamento mensal"],
      additives: []
    }
  },
  kpis: {
    months: ["Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    indicators: [
      { key: "engajamento", label: "Engajamento", values: [62, 64, 67, 66, 69, 72], unit: "%" },
      { key: "clima", label: "Clima Organizacional", values: [58, 60, 61, 63, 65, 66], unit: "%" },
      { key: "valores", label: "Aderência a Valores", values: [55, 57, 58, 60, 62, 64], unit: "%" },
      { key: "nps", label: "NPS Interno", values: [20, 24, 28, 30, 32, 35], unit: "" },
      { key: "rotatividade", label: "Rotatividade", values: [6, 6, 5, 5, 4, 4], unit: "%", inverted: true }
    ]
  },
  deliverables: [
    {
      id: "D1",
      title: "Relatório de Diagnóstico Inicial",
      phase: "J2",
      status: "Concluído",
      responsible: "CNP - Aline",
      plannedDate: "2025-11-30",
      completedDate: "2025-11-30",
      progress: 100,
      description: "Diagnóstico completo da cultura organizacional com baseline de indicadores",
      evidences: [
        { id: "E1", type: "pdf", title: "Relatório Final - Diagnóstico", path: "./docs/diagnostico.pdf", uploadedAt: "2025-11-30", uploadedBy: "CNP - Aline" },
        { id: "E2", type: "link", title: "Apresentação Executiva", url: "#", uploadedAt: "2025-11-30", uploadedBy: "CNP - Aline" }
      ],
      changelog: [
        { date: "2025-11-30", change: "Entrega concluída", user: "CNP - Aline" },
        { date: "2025-11-25", change: "Status alterado para Em andamento", user: "CNP - Aline" }
      ]
    },
    {
      id: "D2",
      title: "Workshop 1 - Fundamentos de Cultura",
      phase: "J3",
      status: "Concluído",
      responsible: "CNP - Fernando",
      plannedDate: "2025-12-05",
      completedDate: "2025-12-05",
      progress: 100,
      description: "Primeira sessão de workshop sobre cultura organizacional",
      evidences: [
        { id: "E3", type: "pdf", title: "Slides Workshop 1", path: "./docs/workshop1.pdf", uploadedAt: "2025-12-05", uploadedBy: "CNP - Fernando" },
        { id: "E4", type: "link", title: "Gravação da Sessão", url: "#", uploadedAt: "2025-12-05", uploadedBy: "CNP - Fernando" }
      ],
      changelog: [
        { date: "2025-12-05", change: "Workshop concluído com sucesso", user: "CNP - Fernando" }
      ]
    },
    {
      id: "D3",
      title: "Workshop 2 - Liderança e Valores",
      phase: "J3",
      status: "Em validação",
      responsible: "CNP - Fernando",
      plannedDate: "2025-12-15",
      completedDate: null,
      progress: 90,
      description: "Segunda sessão focada em liderança e valores organizacionais",
      evidences: [
        { id: "E5", type: "pdf", title: "Material Preparatório", path: "./docs/workshop2-prep.pdf", uploadedAt: "2025-12-12", uploadedBy: "CNP - Fernando" }
      ],
      changelog: [
        { date: "2025-12-14", change: "Workshop realizado, aguardando validação do cliente", user: "CNP - Fernando" },
        { date: "2025-12-10", change: "Iniciada preparação", user: "CNP - Fernando" }
      ]
    },
    {
      id: "D4",
      title: "Mapa de Alavancas Culturais",
      phase: "J3",
      status: "Em andamento",
      responsible: "CNP - Nicole",
      plannedDate: "2025-12-18",
      completedDate: null,
      progress: 60,
      description: "Identificação das principais alavancas para transformação cultural",
      evidences: [],
      changelog: [
        { date: "2025-12-12", change: "Progresso atualizado para 60%", user: "CNP - Nicole" },
        { date: "2025-12-08", change: "Iniciado mapeamento", user: "CNP - Nicole" }
      ]
    },
    {
      id: "D5",
      title: "Plano de Comunicação Interna",
      phase: "J3",
      status: "Bloqueado",
      responsible: "CNP - Nicole",
      plannedDate: "2025-12-20",
      completedDate: null,
      progress: 30,
      description: "Estratégia de comunicação para o projeto de cultura",
      evidences: [],
      changelog: [
        { date: "2025-12-10", change: "Bloqueado - aguardando aprovação da diretoria", user: "CNP - Nicole" },
        { date: "2025-12-05", change: "Rascunho inicial criado", user: "CNP - Nicole" }
      ]
    },
    {
      id: "D6",
      title: "Pesquisa de Clima - Follow-up",
      phase: "J4",
      status: "Não iniciado",
      responsible: "CNP - Juliano",
      plannedDate: "2026-01-15",
      completedDate: null,
      progress: 0,
      description: "Segunda rodada de pesquisa de clima para medir evolução",
      evidences: [],
      changelog: []
    }
  ],
  journey: {
    currentPhase: "J3",
    nextPhase: "J4",
    orderHistory: [
      {
        date: "2025-11-15",
        change: "Ordem inicial definida",
        changedBy: "CNP - Nicole"
      }
    ],
    phases: [
      {
        id: "J1",
        title: "Onboarding",
        status: "Concluído",
        owner: "CNP - Nicole",
        dueDate: "2025-11-20",
        progress: 100,
        order: 1,
        checklist: ["Kickoff", "Definição de sponsor", "Cronograma aprovado"],
        description: "Alinhamento inicial e definição do escopo do projeto"
      },
      {
        id: "J2",
        title: "Diagnóstico 1 (Base)",
        status: "Concluído",
        owner: "CNP - Aline",
        dueDate: "2025-11-30",
        progress: 100,
        order: 2,
        checklist: ["Pesquisa clima", "Entrevistas", "Leitura de contexto"],
        description: "Avaliação inicial da cultura organizacional"
      },
      {
        id: "J3",
        title: "Workshops com lideranças",
        status: "Em andamento",
        owner: "CNP - Fernando",
        dueDate: "2025-12-20",
        progress: 55,
        order: 3,
        checklist: ["Workshop Liderança 1", "Workshop Liderança 2", "Mapa de alavancas"],
        description: "Desenvolvimento de lideranças e definição de alavancas culturais"
      },
      {
        id: "J4",
        title: "Diagnóstico 2 (Follow-up)",
        status: "Não iniciado",
        owner: "CNP - Juliano",
        dueDate: "2026-01-20",
        progress: 0,
        order: 4,
        checklist: ["Pesquisa pulso", "Entrevistas curtas", "Comparativo com baseline"],
        description: "Segunda avaliação para medir evolução"
      },
      {
        id: "J5",
        title: "Plano de Ação",
        status: "Não iniciado",
        owner: "CNP - Douglas",
        dueDate: "2026-02-10",
        progress: 0,
        order: 5,
        checklist: ["Prioridades", "Roadmap 90 dias", "Responsáveis e rituais"],
        description: "Plano estruturado de ações para transformação cultural"
      },
      {
        id: "J6",
        title: "Acompanhamento mensal",
        status: "Não iniciado",
        owner: "CNP - Time",
        dueDate: "2026-05-15",
        progress: 0,
        order: 6,
        checklist: ["Rituais", "Métricas", "Revisões mensais"],
        description: "Acompanhamento contínuo e ajustes no plano"
      }
    ]
  },
  employees: [
    { id: "E1", name: "Bruna Carvalho", area: "RH", role: "Analista de RH", cultureScore: 78, performanceScore: 74, engagement: 80, risk: "Baixo" },
    { id: "E2", name: "Rafael Nunes", area: "Operações", role: "Supervisor", cultureScore: 70, performanceScore: 76, engagement: 72, risk: "Médio" },
    { id: "E3", name: "Camila Rocha", area: "Financeiro", role: "Analista Financeiro", cultureScore: 82, performanceScore: 79, engagement: 77, risk: "Baixo" },
    { id: "E4", name: "Thiago Lima", area: "Comercial", role: "Executivo de Vendas", cultureScore: 66, performanceScore: 81, engagement: 68, risk: "Médio" },
    { id: "E5", name: "Mariana Alves", area: "Operações", role: "Coordenadora", cultureScore: 74, performanceScore: 72, engagement: 71, risk: "Baixo" },
    { id: "E6", name: "Gabriel Souza", area: "Comercial", role: "SDR", cultureScore: 61, performanceScore: 68, engagement: 63, risk: "Alto" },
    { id: "E7", name: "Larissa Menezes", area: "Financeiro", role: "Assistente", cultureScore: 73, performanceScore: 70, engagement: 69, risk: "Médio" },
    { id: "E8", name: "Diego Martins", area: "Operações", role: "Técnico", cultureScore: 69, performanceScore: 67, engagement: 66, risk: "Médio" },
    { id: "E9", name: "Fernanda Pinto", area: "RH", role: "Business Partner", cultureScore: 85, performanceScore: 83, engagement: 82, risk: "Baixo" },
    { id: "E10", name: "João Victor", area: "Comercial", role: "Gerente Comercial", cultureScore: 71, performanceScore: 78, engagement: 74, risk: "Baixo" },
    { id: "E11", name: "Paula Ribeiro", area: "Financeiro", role: "Controller", cultureScore: 76, performanceScore: 80, engagement: 75, risk: "Baixo" },
    { id: "E12", name: "Mateus Fernandes", area: "Operações", role: "Planejamento", cultureScore: 64, performanceScore: 69, engagement: 61, risk: "Alto" }
  ],
  meetings: [
    {
      id: "M1",
      title: "Kickoff do Projeto",
      date: "2025-11-18",
      type: "Diretoria",
      department: "Geral",
      participants: ["Diretoria", "RH", "CNP - Nicole"],
      summary: "Alinhamento de objetivos, métricas e comunicação interna do projeto.",
      decisions: ["Sponsor do projeto definido", "Calendário inicial aprovado"],
      nextSteps: ["Enviar comunicado oficial", "Agendar entrevistas diagnóstico"],
      attachments: [{ label: "Agenda (PDF)", url: "#" }]
    },
    {
      id: "M2",
      title: "Entrevistas - Operações",
      date: "2025-11-25",
      type: "Workshop",
      department: "Operações",
      participants: ["Operações", "CNP - Aline"],
      summary: "Mapeamento de dores e rituais de equipe.",
      decisions: ["Padronizar ritual diário", "Criar canal de feedback"],
      nextSteps: ["Propor template de rotina", "Validar com supervisor"],
      attachments: []
    },
    {
      id: "M3",
      title: "1:1 - Colaborador (E6)",
      date: "2025-12-02",
      type: "1:1",
      department: "Comercial",
      participants: ["Gabriel Souza", "CNP - Fernando"],
      summary: "Sinais de queda de engajamento e ruído na comunicação com liderança.",
      decisions: ["Plano de acompanhamento quinzenal"],
      nextSteps: ["Revisar metas", "Definir mentoria interna"],
      attachments: []
    },
    {
      id: "M4",
      title: "Workshop Liderança 1",
      date: "2025-12-05",
      type: "Workshop",
      department: "Geral",
      participants: ["Gerentes", "Coordenadores", "CNP - Fernando"],
      summary: "Primeira sessão de alinhamento sobre cultura e liderança.",
      decisions: ["Definir comportamentos-chave", "Criar compromissos de liderança"],
      nextSteps: ["Preparar material Workshop 2", "Enviar resumo aos participantes"],
      attachments: [{ label: "Slides Workshop", url: "#" }]
    },
    {
      id: "M5",
      title: "Alinhamento RH - Clima",
      date: "2025-12-08",
      type: "1:1",
      department: "RH",
      participants: ["Fernanda Pinto", "Bruna Carvalho", "CNP - Aline"],
      summary: "Discussão sobre resultados da pesquisa de clima e próximos passos.",
      decisions: ["Priorizar comunicação interna", "Criar grupo focal com operações"],
      nextSteps: ["Agendar grupo focal", "Preparar relatório executivo"],
      attachments: []
    },
    {
      id: "M6",
      title: "Reunião Diretoria - Progresso",
      date: "2025-12-10",
      type: "Diretoria",
      department: "Geral",
      participants: ["Diretoria", "CNP - Nicole", "CNP - Douglas"],
      summary: "Apresentação do progresso do projeto e alinhamento de expectativas.",
      decisions: ["Manter cronograma atual", "Ampliar comunicação sobre o projeto"],
      nextSteps: ["Preparar comunicado interno", "Agendar próxima revisão"],
      attachments: [{ label: "Relatório Progresso", url: "#" }]
    },
    {
      id: "M7",
      title: "Entrevistas - Financeiro",
      date: "2025-12-12",
      type: "Workshop",
      department: "Financeiro",
      participants: ["Paula Ribeiro", "Camila Rocha", "Larissa Menezes", "CNP - Juliano"],
      summary: "Mapeamento de cultura e processos na área financeira.",
      decisions: ["Melhorar integração com outras áreas", "Criar rituais de feedback"],
      nextSteps: ["Propor plano de integração", "Validar com Controller"],
      attachments: []
    },
    {
      id: "M8",
      title: "1:1 - Mateus Fernandes",
      date: "2025-12-14",
      type: "1:1",
      department: "Operações",
      participants: ["Mateus Fernandes", "CNP - Fernando"],
      summary: "Acompanhamento de colaborador com risco alto de desengajamento.",
      decisions: ["Aumentar frequência de feedbacks", "Revisar escopo de responsabilidades"],
      nextSteps: ["Definir PDI", "Agendar conversa com gestor direto"],
      attachments: []
    }
  ],
  employeeHistory: {
    E1: [
      { month: "Out", culture: 75, performance: 72, note: "Boa influência positiva no time." },
      { month: "Nov", culture: 77, performance: 73, note: "Melhora em rituais e comunicação." },
      { month: "Dez", culture: 78, performance: 74, note: "Consistência e boa colaboração." }
    ],
    E2: [
      { month: "Out", culture: 68, performance: 74, note: "Precisa melhorar comunicação com equipe." },
      { month: "Nov", culture: 69, performance: 75, note: "Progresso em delegação de tarefas." },
      { month: "Dez", culture: 70, performance: 76, note: "Melhoria consistente." }
    ],
    E3: [
      { month: "Out", culture: 80, performance: 77, note: "Excelente colaboração interdepartamental." },
      { month: "Nov", culture: 81, performance: 78, note: "Liderança informal positiva." },
      { month: "Dez", culture: 82, performance: 79, note: "Mantém alta performance." }
    ],
    E4: [
      { month: "Out", culture: 64, performance: 79, note: "Foco excessivo em resultados individuais." },
      { month: "Nov", culture: 65, performance: 80, note: "Trabalhando colaboração." },
      { month: "Dez", culture: 66, performance: 81, note: "Leve melhora em trabalho em equipe." }
    ],
    E5: [
      { month: "Out", culture: 72, performance: 70, note: "Boa liderança de equipe." },
      { month: "Nov", culture: 73, performance: 71, note: "Implementou novos rituais." },
      { month: "Dez", culture: 74, performance: 72, note: "Consistente na gestão." }
    ],
    E6: [
      { month: "Out", culture: 64, performance: 70, note: "Boa energia, mas inseguro no processo." },
      { month: "Nov", culture: 62, performance: 69, note: "Queda de engajamento após mudança de meta." },
      { month: "Dez", culture: 61, performance: 68, note: "Precisa de alinhamento semanal e mentoria." }
    ],
    E7: [
      { month: "Out", culture: 71, performance: 68, note: "Boa execução de tarefas." },
      { month: "Nov", culture: 72, performance: 69, note: "Melhorando proatividade." },
      { month: "Dez", culture: 73, performance: 70, note: "Evolução positiva." }
    ],
    E8: [
      { month: "Out", culture: 67, performance: 65, note: "Técnico competente, pouca interação." },
      { month: "Nov", culture: 68, performance: 66, note: "Participando mais de reuniões." },
      { month: "Dez", culture: 69, performance: 67, note: "Melhora gradual." }
    ],
    E9: [
      { month: "Out", culture: 83, performance: 81, note: "Referência em cultura organizacional." },
      { month: "Nov", culture: 84, performance: 82, note: "Liderando iniciativas de clima." },
      { month: "Dez", culture: 85, performance: 83, note: "Excelente influência no time." }
    ],
    E10: [
      { month: "Out", culture: 69, performance: 76, note: "Bom gestor, pode melhorar escuta." },
      { month: "Nov", culture: 70, performance: 77, note: "Implementou 1:1s regulares." },
      { month: "Dez", culture: 71, performance: 78, note: "Time mais engajado." }
    ],
    E11: [
      { month: "Out", culture: 74, performance: 78, note: "Excelente visão estratégica." },
      { month: "Nov", culture: 75, performance: 79, note: "Melhorou comunicação com operações." },
      { month: "Dez", culture: 76, performance: 80, note: "Consistência alta." }
    ],
    E12: [
      { month: "Out", culture: 66, performance: 71, note: "Desmotivado com escopo atual." },
      { month: "Nov", culture: 65, performance: 70, note: "Queda de engajamento identificada." },
      { month: "Dez", culture: 64, performance: 69, note: "Necessário plano de desenvolvimento urgente." }
    ]
  },
  users: [
    { email: "cliente@empresa.com", password: "123456", role: "client", name: "Cliente Aurora" },
    { email: "admin@cnp.com", password: "123456", role: "admin", name: "Admin CNP" }
  ],
  assessments: [
    {
      id: "A1",
      employeeId: "E6",
      date: "2025-12-10",
      status: "completed",
      step: 4,
      entregas: {
        clarezaMetas: 2,
        entregaResultados: 2,
        qualidadeConsistencia: 3,
        responsabilidadeDono: 2,
        observacoes: "Dificuldade em compreender e priorizar metas estabelecidas."
      },
      comportamentos: {
        colaboracao: 2,
        comunicacao: 2,
        adaptabilidade: 3,
        protagonismo: 2,
        focoResultado: 2,
        observacoes: "Apresenta resistencia a feedbacks e pouca iniciativa."
      },
      alinhamentoCultural: {
        entregaConfianca: 2,
        inovarEstrategia: 2,
        disciplinaSemDesculpas: 1,
        clienteRegua: 2,
        evidencias: "Nao demonstra compromisso com prazos e qualidade esperada."
      },
      sumario: {
        forcas: "Conhecimento tecnico basico da area comercial.",
        pontosAtencao: "Baixo engajamento, resistencia a mudancas, falta de ownership."
      },
      classificacao: "red_flag",
      classificacaoManual: true,
      textoPerfilManual: "Colaborador apresenta sinais criticos de desalinhamento cultural e baixa performance. Recomenda-se PDI intensivo ou desligamento.",
      flagT: false,
      flagI: true
    },
    {
      id: "A2",
      employeeId: "E12",
      date: "2025-12-11",
      status: "completed",
      step: 4,
      entregas: {
        clarezaMetas: 3,
        entregaResultados: 3,
        qualidadeConsistencia: 3,
        responsabilidadeDono: 2,
        observacoes: "Entende as metas mas tem dificuldade em se responsabilizar pelos resultados."
      },
      comportamentos: {
        colaboracao: 3,
        comunicacao: 2,
        adaptabilidade: 2,
        protagonismo: 2,
        focoResultado: 3,
        observacoes: "Pouca comunicacao proativa, aguarda demandas."
      },
      alinhamentoCultural: {
        entregaConfianca: 3,
        inovarEstrategia: 2,
        disciplinaSemDesculpas: 2,
        clienteRegua: 3,
        evidencias: "Demonstra interesse mas falta consistencia na execucao."
      },
      sumario: {
        forcas: "Capacidade analitica e conhecimento de processos.",
        pontosAtencao: "Falta de protagonismo e comunicacao deficiente."
      },
      classificacao: "pontos_desenvolver",
      classificacaoManual: false,
      textoPerfilManual: "",
      flagT: true,
      flagI: true
    },
    {
      id: "A3",
      employeeId: "E4",
      date: "2025-12-09",
      status: "completed",
      step: 4,
      entregas: {
        clarezaMetas: 4,
        entregaResultados: 4,
        qualidadeConsistencia: 4,
        responsabilidadeDono: 3,
        observacoes: "Excelente em entregas individuais, precisa melhorar visao de time."
      },
      comportamentos: {
        colaboracao: 2,
        comunicacao: 3,
        adaptabilidade: 3,
        protagonismo: 4,
        focoResultado: 5,
        observacoes: "Muito focado em resultado proprio, pouca colaboracao."
      },
      alinhamentoCultural: {
        entregaConfianca: 4,
        inovarEstrategia: 3,
        disciplinaSemDesculpas: 4,
        clienteRegua: 4,
        evidencias: "Bom alinhamento com cliente, mas precisa desenvolver trabalho em equipe."
      },
      sumario: {
        forcas: "Alta performance individual, foco em resultados, disciplina.",
        pontosAtencao: "Colaboracao e trabalho em equipe."
      },
      classificacao: "pontos_desenvolver",
      classificacaoManual: false,
      textoPerfilManual: "",
      flagT: false,
      flagI: false
    },
    {
      id: "A4",
      employeeId: "E2",
      date: "2025-12-08",
      status: "completed",
      step: 4,
      entregas: {
        clarezaMetas: 4,
        entregaResultados: 3,
        qualidadeConsistencia: 3,
        responsabilidadeDono: 4,
        observacoes: "Bom entendimento de metas, execucao pode melhorar."
      },
      comportamentos: {
        colaboracao: 3,
        comunicacao: 3,
        adaptabilidade: 3,
        protagonismo: 3,
        focoResultado: 4,
        observacoes: "Equilibrado, mas sem destaques significativos."
      },
      alinhamentoCultural: {
        entregaConfianca: 3,
        inovarEstrategia: 3,
        disciplinaSemDesculpas: 4,
        clienteRegua: 3,
        evidencias: "Alinhamento cultural mediano, potencial de crescimento."
      },
      sumario: {
        forcas: "Responsabilidade, disciplina, conhecimento operacional.",
        pontosAtencao: "Comunicacao com equipe e inovacao."
      },
      classificacao: "pontos_desenvolver",
      classificacaoManual: false,
      textoPerfilManual: "",
      flagT: true,
      flagI: false
    },
    {
      id: "A5",
      employeeId: "E9",
      date: "2025-12-07",
      status: "completed",
      step: 4,
      entregas: {
        clarezaMetas: 5,
        entregaResultados: 5,
        qualidadeConsistencia: 4,
        responsabilidadeDono: 5,
        observacoes: "Referencia em entregas e ownership."
      },
      comportamentos: {
        colaboracao: 5,
        comunicacao: 5,
        adaptabilidade: 4,
        protagonismo: 5,
        focoResultado: 4,
        observacoes: "Excelente influencia positiva no time."
      },
      alinhamentoCultural: {
        entregaConfianca: 5,
        inovarEstrategia: 4,
        disciplinaSemDesculpas: 5,
        clienteRegua: 5,
        evidencias: "Exemplar em todos os valores culturais."
      },
      sumario: {
        forcas: "Lideranca, comunicacao, ownership, alinhamento cultural exemplar.",
        pontosAtencao: "Pode desenvolver mais inovacao estrategica."
      },
      classificacao: "com_potencial",
      classificacaoManual: false,
      textoPerfilManual: "",
      flagT: false,
      flagI: false
    },
    {
      id: "A6",
      employeeId: "E3",
      date: "2025-12-06",
      status: "completed",
      step: 4,
      entregas: {
        clarezaMetas: 4,
        entregaResultados: 4,
        qualidadeConsistencia: 5,
        responsabilidadeDono: 4,
        observacoes: "Consistente e confiavel nas entregas."
      },
      comportamentos: {
        colaboracao: 4,
        comunicacao: 4,
        adaptabilidade: 4,
        protagonismo: 4,
        focoResultado: 4,
        observacoes: "Equilibrada em todos os aspectos comportamentais."
      },
      alinhamentoCultural: {
        entregaConfianca: 5,
        inovarEstrategia: 4,
        disciplinaSemDesculpas: 4,
        clienteRegua: 4,
        evidencias: "Forte alinhamento com valores, especialmente confianca."
      },
      sumario: {
        forcas: "Qualidade, consistencia, colaboracao, confiabilidade.",
        pontosAtencao: "Pode assumir mais protagonismo em projetos."
      },
      classificacao: "com_potencial",
      classificacaoManual: false,
      textoPerfilManual: "",
      flagT: false,
      flagI: false
    },
    {
      id: "A7",
      employeeId: "E8",
      date: "2025-12-12",
      status: "completed",
      step: 4,
      entregas: {
        clarezaMetas: 3,
        entregaResultados: 3,
        qualidadeConsistencia: 4,
        responsabilidadeDono: 3,
        observacoes: "Bom tecnicamente, precisa entender melhor o contexto de negocios."
      },
      comportamentos: {
        colaboracao: 3,
        comunicacao: 2,
        adaptabilidade: 3,
        protagonismo: 2,
        focoResultado: 3,
        observacoes: "Introvertido, pouca participacao em discussoes."
      },
      alinhamentoCultural: {
        entregaConfianca: 3,
        inovarEstrategia: 3,
        disciplinaSemDesculpas: 4,
        clienteRegua: 3,
        evidencias: "Disciplinado mas precisa desenvolver visao de cliente."
      },
      sumario: {
        forcas: "Competencia tecnica, disciplina, qualidade.",
        pontosAtencao: "Comunicacao, protagonismo, visao de negocios."
      },
      classificacao: "pontos_desenvolver",
      classificacaoManual: false,
      textoPerfilManual: "",
      flagT: true,
      flagI: false
    },
    {
      id: "A8",
      employeeId: "E11",
      date: "2025-12-05",
      status: "completed",
      step: 4,
      entregas: {
        clarezaMetas: 5,
        entregaResultados: 4,
        qualidadeConsistencia: 4,
        responsabilidadeDono: 5,
        observacoes: "Visao estrategica e ownership exemplares."
      },
      comportamentos: {
        colaboracao: 4,
        comunicacao: 4,
        adaptabilidade: 4,
        protagonismo: 5,
        focoResultado: 4,
        observacoes: "Lideranca natural, boa influencia."
      },
      alinhamentoCultural: {
        entregaConfianca: 4,
        inovarEstrategia: 5,
        disciplinaSemDesculpas: 4,
        clienteRegua: 4,
        evidencias: "Forte em inovacao e estrategia."
      },
      sumario: {
        forcas: "Visao estrategica, inovacao, lideranca, ownership.",
        pontosAtencao: "Pode melhorar consistencia nas entregas."
      },
      classificacao: "com_potencial",
      classificacaoManual: false,
      textoPerfilManual: "",
      flagT: false,
      flagI: false
    }
  ],
  assessmentConfig: {
    consideracoesGerais: "O Assessment de Liderancas e Equipe revelou um cenario misto na Metalurgica Aurora. Identificamos colaboradores com alto potencial que podem ser desenvolvidos para posicoes de lideranca, bem como casos criticos que exigem atencao imediata. Recomendamos PDIs individualizados e acompanhamento mensal dos casos de atencao.",
    criteriosEntregas: [
      { key: "clarezaMetas", label: "Clareza de Metas", desc: "Entende e prioriza objetivos definidos" },
      { key: "entregaResultados", label: "Entrega de Resultados", desc: "Cumpre prazos e metas estabelecidas" },
      { key: "qualidadeConsistencia", label: "Qualidade e Consistencia", desc: "Mantem padrao elevado nas entregas" },
      { key: "responsabilidadeDono", label: "Responsabilidade e Dono", desc: "Assume ownership das entregas" }
    ],
    criteriosComportamentos: [
      { key: "colaboracao", label: "Colaboracao", desc: "Trabalha bem em equipe e apoia colegas" },
      { key: "comunicacao", label: "Comunicacao", desc: "Comunica de forma clara e proativa" },
      { key: "adaptabilidade", label: "Adaptabilidade", desc: "Adapta-se a mudancas e novos cenarios" },
      { key: "protagonismo", label: "Protagonismo", desc: "Toma iniciativa e lidera situacoes" },
      { key: "focoResultado", label: "Foco em Resultado", desc: "Orientado a entregas e metas" }
    ],
    criteriosCultura: [
      { key: "entregaConfianca", label: "Entrega que gera confianca", desc: "Cumpre o que promete, gera credibilidade" },
      { key: "inovarEstrategia", label: "Inovar com estrategia", desc: "Busca melhorias com visao estrategica" },
      { key: "disciplinaSemDesculpas", label: "Disciplina sem desculpas", desc: "Consistencia e compromisso sem justificativas" },
      { key: "clienteRegua", label: "Cliente e a regua", desc: "Coloca o cliente no centro das decisoes" }
    ]
  }
};

// Funções de gerenciamento de dados
const DataManager = {
  STORAGE_KEY: "cnp_cultura_data",

  init() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      this.resetToSeed();
    }
  },

  resetToSeed() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(seedData));
  },

  getData() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY));
  },

  saveData(data) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  },

  // Journey
  updateJourneyStep(stepId, updates) {
    const data = this.getData();
    const stepIndex = data.journey.phases.findIndex(s => s.id === stepId);
    if (stepIndex !== -1) {
      data.journey.phases[stepIndex] = { ...data.journey.phases[stepIndex], ...updates };
      this.saveData(data);
    }
    return data;
  },

  updateJourneyOrder(newOrder) {
    const data = this.getData();
    data.journey.phases = newOrder;
    this.saveData(data);
    return data;
  },

  addJourneyOrderHistory(change, changedBy) {
    const data = this.getData();
    if (!data.journey.orderHistory) {
      data.journey.orderHistory = [];
    }
    data.journey.orderHistory.push({
      date: new Date().toISOString().split('T')[0],
      change,
      changedBy
    });
    this.saveData(data);
  },

  // Meetings
  addMeeting(meeting) {
    const data = this.getData();
    meeting.id = "M" + (data.meetings.length + 1);
    data.meetings.push(meeting);
    this.saveData(data);
    return data;
  },

  updateMeeting(meetingId, updates) {
    const data = this.getData();
    const meetingIndex = data.meetings.findIndex(m => m.id === meetingId);
    if (meetingIndex !== -1) {
      data.meetings[meetingIndex] = { ...data.meetings[meetingIndex], ...updates };
      this.saveData(data);
    }
    return data;
  },

  // Auth
  authenticate(email, password) {
    const data = this.getData();
    const user = data.users.find(u => u.email === email && u.password === password);
    return user || null;
  },

  // Assessments
  getAssessments() {
    const data = this.getData();
    return data.assessments || [];
  },

  getAssessment(id) {
    const data = this.getData();
    return data.assessments.find(a => a.id === id);
  },

  getAssessmentByEmployee(employeeId) {
    const data = this.getData();
    return data.assessments.find(a => a.employeeId === employeeId);
  },

  addAssessment(assessment) {
    const data = this.getData();
    if (!data.assessments) data.assessments = [];
    const maxId = data.assessments.reduce((max, a) => {
      const num = parseInt(a.id.replace('A', ''));
      return num > max ? num : max;
    }, 0);
    assessment.id = 'A' + (maxId + 1);
    assessment.date = new Date().toISOString().split('T')[0];
    data.assessments.push(assessment);
    this.saveData(data);
    return assessment;
  },

  updateAssessment(id, updates) {
    const data = this.getData();
    const index = data.assessments.findIndex(a => a.id === id);
    if (index !== -1) {
      data.assessments[index] = { ...data.assessments[index], ...updates };
      this.saveData(data);
      return data.assessments[index];
    }
    return null;
  },

  deleteAssessment(id) {
    const data = this.getData();
    data.assessments = data.assessments.filter(a => a.id !== id);
    this.saveData(data);
  },

  updateAssessmentConfig(updates) {
    const data = this.getData();
    data.assessmentConfig = { ...data.assessmentConfig, ...updates };
    this.saveData(data);
  },

  getAssessmentConfig() {
    const data = this.getData();
    return data.assessmentConfig;
  }
};
