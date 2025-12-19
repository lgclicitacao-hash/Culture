// app.js - Router e gerenciamento de estado

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  "https://uushczefewuwnictpkqn.supabase.co",
  "sb_publishable_a4UXyq9feisKV_6Tge459w_7Ioa7U97"
);

const App = {
  currentUser: null,
  currentRoute: "dashboard",
  supabase: supabase,

  async init() {
    DataManager.init();
    await this.checkAuth();
    this.setupRouter();
    this.render();
  },

  async checkAuth() {
    // Carregar perfil do localStorage
    const cachedProfile = localStorage.getItem("session_profile");
    if (cachedProfile) {
      try {
        this.currentUser = JSON.parse(cachedProfile);
      } catch (e) {
        console.error("Erro ao parsear perfil:", e);
        localStorage.removeItem("session_profile");
      }
    }

    // Verificar sessão do Supabase
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      window.location.href = "/login.html";
      return;
    }

    // Se não tem perfil em cache, buscar do Supabase
    if (!this.currentUser) {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role, tenant_id, full_name")
        .eq("user_id", data.session.user.id)
        .single();

      if (error) {
        console.error("Erro ao buscar perfil:", error);
        window.location.href = "/login.html";
        return;
      }

      this.currentUser = {
        ...profile,
        email: data.session.user.email,
        user_id: data.session.user.id,
        name: profile.full_name
      };

      localStorage.setItem("session_profile", JSON.stringify(this.currentUser));
    }

    // Configurar rota inicial
    const currentHash = window.location.hash.slice(1) || "";
    if (currentHash === "login" || currentHash === "") {
      this.currentRoute = "dashboard";
      window.location.hash = "dashboard";
    } else {
      this.currentRoute = currentHash;
    }
  },

  async logout() {
    await supabase.auth.signOut();
    this.currentUser = null;
    localStorage.removeItem("session_profile");
    window.location.href = "/login.html";
  },

  isAdmin() {
    return this.currentUser && this.currentUser.role === "admin";
  },

  isStaff() {
    return this.currentUser && (this.currentUser.role === "staff" || this.currentUser.role === "admin");
  },

  canAccessModule(moduleKey) {
    if (!this.currentUser) return false;

    const permissions = {
      client: ["dashboard", "timeline", "journey", "deliverables", "meetings", "documents", "tasks", "assessment"],
      staff: ["dashboard", "timeline", "journey", "deliverables", "meetings", "documents", "tasks", "assessment", "employees"],
      admin: ["dashboard", "timeline", "journey", "deliverables", "meetings", "documents", "tasks", "assessment", "employees", "admin", "audit"]
    };

    const allowedModules = permissions[this.currentUser.role] || permissions.client;
    return allowedModules.includes(moduleKey);
  },

  setupRouter() {
    window.addEventListener("hashchange", () => {
      const route = window.location.hash.slice(1) || "login";
      if (route !== "login" && !this.currentUser) {
        this.navigate("login");
        return;
      }
      this.currentRoute = route;
      this.render();
    });
  },

  navigate(route) {
    window.location.hash = route;
  },

  render() {
    const mainContent = document.getElementById("main-content");
    const sidebar = document.getElementById("sidebar");
    const header = document.getElementById("header");

    if (this.currentRoute === "login" || !this.currentUser) {
      sidebar.style.display = "none";
      header.style.display = "none";
      mainContent.innerHTML = LoginComponent.render();
      LoginComponent.afterRender();
      return;
    }

    sidebar.style.display = "flex";
    header.style.display = "flex";
    this.renderHeader();
    this.renderSidebar();

    const [route, param] = this.currentRoute.split("/");

    try {
      switch (route) {
        case "dashboard":
          mainContent.innerHTML = DashboardComponent.render();
          DashboardComponent.afterRender();
          break;
        case "timeline":
          mainContent.innerHTML = TimelineComponent.render();
          TimelineComponent.afterRender();
          break;
        case "manual":
          mainContent.innerHTML = ManualComponent.render();
          ManualComponent.afterRender();
          break;
        case "contract":
          mainContent.innerHTML = ContractComponent.render();
          ContractComponent.afterRender();
          break;
        case "journey":
          mainContent.innerHTML = JourneyComponent.render();
          JourneyComponent.afterRender();
          break;
        case "deliverables":
          mainContent.innerHTML = DeliverablesComponent.render();
          DeliverablesComponent.afterRender();
          break;
        case "meetings":
          mainContent.innerHTML = MeetingsComponent.render();
          MeetingsComponent.afterRender();
          break;
        case "employees":
          if (param) {
            mainContent.innerHTML = EmployeesComponent.renderProfile(param);
          } else {
            mainContent.innerHTML = EmployeesComponent.render();
          }
          EmployeesComponent.afterRender();
          break;
        case "assessment":
          mainContent.innerHTML = AssessmentComponent.render();
          AssessmentComponent.afterRender();
          break;
        default:
          mainContent.innerHTML = DashboardComponent.render();
          DashboardComponent.afterRender();
      }
    } catch (error) {
      console.error(`Erro ao renderizar componente '${route}':`, error);
      mainContent.innerHTML = `
        <div class="card">
          <h2>Erro ao carregar página</h2>
          <p>Ocorreu um erro ao carregar a página "${route}".</p>
          <p><strong>Erro:</strong> ${error.message}</p>
          <pre>${error.stack}</pre>
        </div>
      `;
    }
  },

  renderHeader() {
    const data = DataManager.getData();
    const header = document.getElementById("header");

    const roleLabels = {
      admin: "Admin",
      staff: "Staff",
      client: "Cliente"
    };

    const roleLabel = roleLabels[this.currentUser?.role] || "Usuário";

    header.innerHTML = `
      <div class="header-left">
        <img src="${data.tenant.logoPath}" alt="Logo" class="header-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
        <span class="header-logo-fallback" style="display:none;">LGC</span>
        <span class="header-company">${data.tenant.clientCompany}</span>
      </div>
      <div class="header-right">
        <span class="header-user">${this.currentUser?.name || this.currentUser?.email}</span>
        <span class="header-role">${roleLabel}</span>
        <button class="btn-logout" id="logoutBtn">Sair</button>
      </div>
    `;

    // Adicionar evento de logout
    document.getElementById("logoutBtn").addEventListener("click", async () => {
      await this.logout();
    });
  },

  renderSidebar() {
    const sidebar = document.getElementById("sidebar");
    const menuItems = [
      { route: "dashboard", label: "Dashboard", icon: "chart", module: "dashboard" },
      { route: "timeline", label: "Linha do Tempo", icon: "clock", module: "timeline" },
      { route: "manual", label: "Manual de Cultura", icon: "book", module: "documents" },
      { route: "contract", label: "Contrato", icon: "file", module: "documents" },
      { route: "journey", label: "Jornada", icon: "map", module: "journey" },
      { route: "deliverables", label: "Entregaveis", icon: "package", module: "deliverables" },
      { route: "meetings", label: "Reunioes", icon: "calendar", module: "meetings" },
      { route: "employees", label: "Funcionarios", icon: "users", module: "employees" },
      { route: "assessment", label: "Assessment", icon: "clipboard", module: "assessment" }
    ];

    // Filtrar itens com base nas permissões do usuário
    const visibleItems = menuItems.filter(item => this.canAccessModule(item.module));

    sidebar.innerHTML = `
      <nav class="sidebar-nav">
        ${visibleItems.map(item => `
          <a href="#${item.route}"
             class="sidebar-item ${this.currentRoute.startsWith(item.route) ? "active" : ""}">
            <span class="sidebar-icon">${this.getIcon(item.icon)}</span>
            <span class="sidebar-label">${item.label}</span>
          </a>
        `).join("")}
      </nav>
    `;
  },

  getIcon(type) {
    const icons = {
      chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>`,
      clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
      book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
      file: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
      map: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`,
      package: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
      calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
      users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      clipboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M9 14l2 2 4-4"/></svg>`
    };
    return icons[type] || "";
  },

  formatDate(dateStr) {
    if (!dateStr) return "-";
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("pt-BR");
  },

  getStatusClass(status) {
    const statusMap = {
      "Concluído": "status-done",
      "Em andamento": "status-progress",
      "Não iniciado": "status-pending"
    };
    return statusMap[status] || "status-pending";
  },

  getRiskClass(risk) {
    const riskMap = {
      "Baixo": "risk-low",
      "Médio": "risk-medium",
      "Alto": "risk-high"
    };
    return riskMap[risk] || "risk-low";
  }
};

// Inicializar quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", async () => await App.init());
