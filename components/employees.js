// components/employees.js - Funcionários

const EmployeesComponent = {
  filters: {
    area: "all",
    risk: "all"
  },

  render() {
    const data = DataManager.getData();
    const employees = this.getFilteredEmployees(data.employees);
    const areas = [...new Set(data.employees.map(e => e.area))];

    return `
      <div class="page-header">
        <h1 class="page-title">Funcionarios</h1>
        <p class="page-subtitle">Painel de desempenho e indicadores individuais</p>
      </div>

      <div class="meetings-filters">
        <select id="filter-area" onchange="EmployeesComponent.updateFilter('area', this.value)">
          <option value="all">Todas as areas</option>
          ${areas.map(a => `
            <option value="${a}" ${this.filters.area === a ? 'selected' : ''}>${a}</option>
          `).join("")}
        </select>

        <select id="filter-risk" onchange="EmployeesComponent.updateFilter('risk', this.value)">
          <option value="all">Todos os riscos</option>
          <option value="Baixo" ${this.filters.risk === "Baixo" ? 'selected' : ''}>Baixo</option>
          <option value="Medio" ${this.filters.risk === "Médio" ? 'selected' : ''}>Medio</option>
          <option value="Alto" ${this.filters.risk === "Alto" ? 'selected' : ''}>Alto</option>
        </select>
      </div>

      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Area</th>
                <th>Cargo</th>
                <th>Score Cultura</th>
                <th>Score Desempenho</th>
                <th>Engajamento</th>
                <th>Risco</th>
              </tr>
            </thead>
            <tbody>
              ${employees.map(emp => `
                <tr>
                  <td>
                    <span class="employee-name" onclick="App.navigate('employees/${emp.id}')">${emp.name}</span>
                  </td>
                  <td>${emp.area}</td>
                  <td>${emp.role}</td>
                  <td><span class="score ${this.getScoreClass(emp.cultureScore)}">${emp.cultureScore}</span></td>
                  <td><span class="score ${this.getScoreClass(emp.performanceScore)}">${emp.performanceScore}</span></td>
                  <td><span class="score ${this.getScoreClass(emp.engagement)}">${emp.engagement}%</span></td>
                  <td><span class="risk-badge ${App.getRiskClass(emp.risk)}">${emp.risk}</span></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">Resumo por Area</h3>
        <div class="kpi-grid" style="margin-top: 16px;">
          ${areas.map(area => {
            const areaEmps = data.employees.filter(e => e.area === area);
            const avgCulture = Math.round(areaEmps.reduce((sum, e) => sum + e.cultureScore, 0) / areaEmps.length);
            const avgEngagement = Math.round(areaEmps.reduce((sum, e) => sum + e.engagement, 0) / areaEmps.length);
            return `
              <div class="kpi-card">
                <div class="kpi-label">${area}</div>
                <div class="kpi-value">${avgCulture}</div>
                <div class="kpi-trend">Cultura | ${avgEngagement}% Engajamento</div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  },

  renderProfile(employeeId) {
    const data = DataManager.getData();
    const employee = data.employees.find(e => e.id === employeeId);

    if (!employee) {
      return `
        <div class="card">
          <p>Funcionario nao encontrado.</p>
          <a href="#employees" class="btn btn-secondary mt-4">Voltar</a>
        </div>
      `;
    }

    const history = data.employeeHistory[employeeId] || [];
    const initials = employee.name.split(" ").map(n => n[0]).join("").substring(0, 2);

    return `
      <a href="#employees" class="back-link">
        ← Voltar para lista
      </a>

      <div class="card">
        <div class="profile-header">
          <div class="profile-avatar">${initials}</div>
          <div class="profile-info">
            <h2>${employee.name}</h2>
            <p class="profile-meta">${employee.role} | ${employee.area}</p>
          </div>
          <span class="risk-badge ${App.getRiskClass(employee.risk)}">Risco ${employee.risk}</span>
        </div>

        <div class="profile-scores">
          <div class="profile-score-card">
            <div class="profile-score-label">Score Cultura</div>
            <div class="profile-score-value ${this.getScoreClass(employee.cultureScore)}">${employee.cultureScore}</div>
          </div>
          <div class="profile-score-card">
            <div class="profile-score-label">Score Desempenho</div>
            <div class="profile-score-value ${this.getScoreClass(employee.performanceScore)}">${employee.performanceScore}</div>
          </div>
          <div class="profile-score-card">
            <div class="profile-score-label">Engajamento</div>
            <div class="profile-score-value ${this.getScoreClass(employee.engagement)}">${employee.engagement}%</div>
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">Historico de Avaliacoes</h3>
        ${history.length > 0 ? `
          <div class="table-container" style="margin-top: 16px;">
            <table class="history-table">
              <thead>
                <tr>
                  <th>Mes</th>
                  <th>Cultura</th>
                  <th>Desempenho</th>
                  <th>Observacoes</th>
                </tr>
              </thead>
              <tbody>
                ${history.map(h => `
                  <tr>
                    <td>${h.month}</td>
                    <td><span class="score ${this.getScoreClass(h.culture)}">${h.culture}</span></td>
                    <td><span class="score ${this.getScoreClass(h.performance)}">${h.performance}</span></td>
                    <td><span class="history-note">${h.note}</span></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        ` : `
          <p style="color: var(--text-muted); margin-top: 16px;">Nenhum historico disponivel.</p>
        `}
      </div>

      <div class="card">
        <h3 class="card-title">Plano de Desenvolvimento Individual</h3>
        <div style="margin-top: 16px;">
          ${this.generateDevPlan(employee)}
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">Comentarios da Consultoria</h3>
        <div style="margin-top: 16px; color: var(--text-muted);">
          ${this.generateComments(employee, history)}
        </div>
      </div>
    `;
  },

  getFilteredEmployees(employees) {
    return employees.filter(e => {
      if (this.filters.area !== "all" && e.area !== this.filters.area) return false;
      if (this.filters.risk !== "all" && e.risk !== this.filters.risk) return false;
      return true;
    });
  },

  updateFilter(filterName, value) {
    this.filters[filterName] = value;
    App.render();
  },

  getScoreClass(score) {
    if (score >= 75) return "high";
    if (score >= 65) return "medium";
    return "low";
  },

  generateDevPlan(employee) {
    const plans = [];

    if (employee.cultureScore < 70) {
      plans.push({
        area: "Cultura",
        action: "Participar de workshops de alinhamento cultural",
        priority: "Alta"
      });
    }

    if (employee.performanceScore < 70) {
      plans.push({
        area: "Desempenho",
        action: "Definir metas SMART com acompanhamento quinzenal",
        priority: "Alta"
      });
    }

    if (employee.engagement < 70) {
      plans.push({
        area: "Engajamento",
        action: "Realizar 1:1s semanais com gestor direto",
        priority: "Media"
      });
    }

    if (employee.risk === "Alto") {
      plans.push({
        area: "Retencao",
        action: "Plano de carreira e mentoria interna",
        priority: "Urgente"
      });
    }

    if (plans.length === 0) {
      plans.push({
        area: "Desenvolvimento",
        action: "Manter rituais atuais e buscar oportunidades de lideranca",
        priority: "Normal"
      });
    }

    return `
      <table>
        <thead>
          <tr>
            <th>Area</th>
            <th>Acao</th>
            <th>Prioridade</th>
          </tr>
        </thead>
        <tbody>
          ${plans.map(p => `
            <tr>
              <td>${p.area}</td>
              <td>${p.action}</td>
              <td><span class="risk-badge ${p.priority === 'Urgente' ? 'risk-high' : p.priority === 'Alta' ? 'risk-medium' : 'risk-low'}">${p.priority}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  },

  generateComments(employee, history) {
    const comments = [];

    if (history.length > 0) {
      const lastEntry = history[history.length - 1];
      comments.push(`<p><strong>Ultima avaliacao (${lastEntry.month}):</strong> ${lastEntry.note}</p>`);
    }

    if (employee.risk === "Alto") {
      comments.push(`<p><strong>Atencao:</strong> Colaborador identificado com risco alto de desengajamento. Recomendamos acompanhamento proximo e plano de acao imediato.</p>`);
    } else if (employee.risk === "Médio") {
      comments.push(`<p><strong>Observacao:</strong> Colaborador com pontos de atencao. Manter acompanhamento regular.</p>`);
    } else {
      comments.push(`<p><strong>Status:</strong> Colaborador com bom alinhamento cultural e desempenho. Manter rituais e considerar para projetos de destaque.</p>`);
    }

    return comments.join("");
  },

  afterRender() {
    // Nenhuma interação adicional necessária
  }
};

// Expor componente globalmente
window.EmployeesComponent = EmployeesComponent;
