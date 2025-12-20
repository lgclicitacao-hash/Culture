// components/dashboard.js - Dashboard com KPIs

const DashboardComponent = {
  render() {
    const data = DataManager.getData();
    const kpis = data.kpis;
    const lastMonth = kpis.months.length - 1;
    const prevMonth = lastMonth - 1;
    
    // Acesso seguro ao App
    const app = window.App || {};
    const getIcon = typeof app.getIcon === "function" ? app.getIcon.bind(app) : (type => "");

    return `
      <div class="page-header">
        <h1 class="page-title">Dashboard de Cultura</h1>
        <p class="page-subtitle">Visao geral dos indicadores de ${data.tenant.clientCompany}</p>
      </div>

      <div class="kpi-grid">
        ${kpis.indicators.map(indicator => {
          const currentValue = indicator.values[lastMonth];
          const prevValue = indicator.values[prevMonth];
          const diff = currentValue - prevValue;
          const isPositive = indicator.inverted ? diff < 0 : diff > 0;
          const trendClass = isPositive ? "positive" : (diff === 0 ? "" : "negative");
          const trendText = diff > 0 ? `+${diff}` : diff;

          return `
            <div class="kpi-card">
              <div class="kpi-label">${indicator.label}</div>
              <div class="kpi-value">${currentValue}${indicator.unit}</div>
              <div class="kpi-trend ${trendClass}">
                ${trendText}${indicator.unit} vs mes anterior
              </div>
            </div>
          `;
        }).join("")}
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Evolucao Mensal - Engajamento</h3>
        </div>
        <div class="chart-container">
          <div class="bar-chart" id="engagement-chart">
            ${this.renderBarChart(kpis.indicators[0])}
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Acesso Rapido</h3>
        </div>
        <div class="quick-links">
          <a href="#journey" class="quick-link">
            ${getIcon("map")} Ver Jornada
          </a>
          <a href="#meetings" class="quick-link">
            ${getIcon("calendar")} Ver Reunioes
          </a>
          <a href="#employees" class="quick-link">
            ${getIcon("users")} Ver Funcionarios
          </a>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Resumo da Jornada</h3>
        </div>
        ${this.renderJourneySummary(data.journey)}
      </div>
    `;
  },

  renderBarChart(indicator) {
    const data = DataManager.getData();
    const months = data.kpis.months;
    const maxValue = Math.max(...indicator.values);

    return months.map((month, index) => {
      const value = indicator.values[index];
      const height = (value / maxValue) * 100;
      return `
        <div class="bar-group">
          <div class="bar" style="height: ${height}%;">
            <span class="bar-value">${value}%</span>
          </div>
          <span class="bar-label">${month}</span>
        </div>
      `;
    }).join("");
  },

  renderJourneySummary(journey) {
    const phases = journey.phases || [];
    const completed = phases.filter(s => s.status === "Concluído").length;
    const inProgress = phases.filter(s => s.status === "Em andamento").length;
    const pending = phases.filter(s => s.status === "Não iniciado").length;
    const totalProgress = phases.length > 0
      ? Math.round(phases.reduce((sum, s) => sum + s.progress, 0) / phases.length)
      : 0;

    return `
      <div class="kpi-grid" style="margin-bottom: 0;">
        <div class="kpi-card">
          <div class="kpi-label">Etapas Concluidas</div>
          <div class="kpi-value">${completed}/${phases.length}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Em Andamento</div>
          <div class="kpi-value">${inProgress}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Nao Iniciadas</div>
          <div class="kpi-value">${pending}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Progresso Total</div>
          <div class="kpi-value">${totalProgress}%</div>
        </div>
      </div>
    `;
  },

  afterRender() {
    // Nenhuma interação adicional necessária
  }
};

// Expor componente globalmente
window.DashboardComponent = DashboardComponent;
