// components/timeline.js - Componente de Linha do Tempo e Setup do Projeto

const TimelineComponent = {
  getHelpers() {
    const app = window.App || {};
    const formatDate = typeof app.formatDate === "function" ? app.formatDate : (d => d || "-");
    const getStatusClass = typeof app.getStatusClass === "function" ? app.getStatusClass : (s => "");
    const isAdmin = typeof app.isAdmin === "function" ? app.isAdmin() : false;
    const renderApp = typeof app.render === "function" ? app.render.bind(app) : (() => {});
    return { formatDate, getStatusClass, isAdmin, renderApp };
  },

  render() {
    const data = DataManager.getData();
    const { project, timeline, nextSteps } = data;
    const { formatDate, isAdmin } = this.getHelpers();

    // Validar dados
    if (!project || !timeline || !nextSteps) {
      return `<div class="card"><p>Erro: Dados incompletos</p></div>`;
    }

    // Calcular progresso do projeto
    const start = new Date(project.startDate + "T00:00:00");
    const end = new Date(project.endDate + "T00:00:00");
    const now = new Date();
    const total = end - start;
    const elapsed = now - start;
    const progressPercent = Math.min(Math.max((elapsed / total) * 100, 0), 100);

    // Próximos 30 dias
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const upcomingSteps = (nextSteps || []).filter(step => {
      if (!step.dueDate) return false;
      const stepDate = new Date(step.dueDate + "T00:00:00");
      return stepDate <= thirtyDaysFromNow && step.status !== "Concluído";
    }).sort((a, b) => new Date(a.dueDate + "T00:00:00") - new Date(b.dueDate + "T00:00:00"));

    return `
      <div class="timeline-container">
        <div class="page-header">
          <h1>Linha do Tempo do Projeto</h1>
          <p>Acompanhe a evolução e marcos do projeto de Cultura Organizacional</p>
        </div>

        <!-- Setup do Projeto -->
        <div class="timeline-section">
          <h2>Setup do Projeto</h2>
          <div class="project-setup-grid">
            <div class="setup-card">
              <div class="setup-icon">📅</div>
              <div class="setup-content">
                <label>Data de Início</label>
                <div class="setup-value">${formatDate(project.startDate)}</div>
              </div>
            </div>
            <div class="setup-card">
              <div class="setup-icon">🎯</div>
              <div class="setup-content">
                <label>Data de Término</label>
                <div class="setup-value">${formatDate(project.endDate)}</div>
              </div>
            </div>
            <div class="setup-card">
              <div class="setup-icon">⏱️</div>
              <div class="setup-content">
                <label>Vigência</label>
                <div class="setup-value">${project.vigencia}</div>
              </div>
            </div>
            <div class="setup-card">
              <div class="setup-icon">📊</div>
              <div class="setup-content">
                <label>Status</label>
                <div class="setup-value">
                  <span class="badge badge-progress">${project.status}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Barra de Progresso -->
          <div class="project-progress">
            <div class="progress-header">
              <span>Progresso do Projeto</span>
              <span class="progress-percent">${Math.round(progressPercent)}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progressPercent}%"></div>
            </div>
            <div class="progress-dates">
              <span>${formatDate(project.startDate)}</span>
              <span>${formatDate(project.endDate)}</span>
            </div>
          </div>
        </div>

        <!-- Próximos 30 Dias -->
        <div class="timeline-section next-steps-section">
          <h2>Próximos 30 Dias</h2>
          ${upcomingSteps.length > 0 ? `
            <div class="next-steps-grid">
              ${upcomingSteps.map(step => this.renderNextStep(step)).join('')}
            </div>
          ` : `
            <div class="empty-state">
              <p>Nenhuma entrega prevista para os próximos 30 dias</p>
            </div>
          `}
        </div>

        <!-- Marcos do Projeto -->
        <div class="timeline-section">
          <h2>Marcos do Projeto (Planejado x Realizado)</h2>
          <div class="milestones-timeline">
            ${timeline.milestones.map((milestone, index) => this.renderMilestone(milestone, index)).join('')}
          </div>
        </div>

        <!-- Todos os Próximos Passos -->
        <div class="timeline-section">
          <h2>Todos os Próximos Passos</h2>
          <div class="all-next-steps">
            ${nextSteps.map(step => this.renderNextStepCard(step)).join('')}
          </div>
        </div>
      </div>
    `;
  },

  renderNextStep(step) {
    const { formatDate } = this.getHelpers();

    const dueDate = new Date(step.dueDate + "T00:00:00");
    const now = new Date();
    const isOverdue = dueDate < now && step.status !== "Concluído";
    const daysUntil = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

    return `
      <div class="next-step-card ${isOverdue ? 'overdue' : ''}">
        <div class="next-step-header">
          <h3>${step.title}</h3>
          <span class="next-step-date ${isOverdue ? 'text-danger' : ''}">
            ${isOverdue ? '⚠️ Atrasado' : `${daysUntil} dia(s)`}
          </span>
        </div>
        <p class="next-step-description">${step.description}</p>
        <div class="next-step-footer">
          <span class="next-step-responsible">
            <strong>Responsável:</strong> ${step.responsible}
          </span>
          <span class="next-step-due">
            <strong>Data:</strong> ${formatDate(step.dueDate)}
          </span>
        </div>
      </div>
    `;
  },

  renderMilestone(milestone, index) {
    const { formatDate, getStatusClass } = this.getHelpers();

    const hasActualDate = milestone.actualDate !== null;
    const isDelayed = hasActualDate &&
                     new Date(milestone.actualDate + "T00:00:00") > new Date(milestone.plannedDate + "T00:00:00");

    return `
      <div class="milestone-item ${getStatusClass(milestone.status)}">
        <div class="milestone-timeline-line">
          <div class="milestone-dot"></div>
          ${index < 5 ? '<div class="milestone-connector"></div>' : ''}
        </div>
        <div class="milestone-content">
          <div class="milestone-header">
            <h3>${milestone.title}</h3>
            <span class="milestone-status ${getStatusClass(milestone.status)}">
              ${milestone.status}
            </span>
          </div>
          <p class="milestone-description">${milestone.description}</p>
          <div class="milestone-dates">
            <div class="date-item">
              <label>Planejado:</label>
              <span>${formatDate(milestone.plannedDate)}</span>
            </div>
            <div class="date-item">
              <label>Realizado:</label>
              <span class="${isDelayed ? 'text-warning' : ''}">
                ${hasActualDate ? formatDate(milestone.actualDate) : '-'}
                ${isDelayed ? ' ⚠️' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderNextStepCard(step) {
    const { formatDate, isAdmin } = this.getHelpers();
    const statusClass = step.status === "Concluído" ? "status-done" : "status-pending";

    return `
      <div class="next-step-full-card">
        <div class="next-step-full-header">
          <div>
            <h3>${step.title}</h3>
            <p class="text-muted">${step.description}</p>
          </div>
          <span class="badge ${statusClass}">${step.status}</span>
        </div>
        <div class="next-step-full-footer">
          <div class="info-item">
            <label>Responsável:</label>
            <span>${step.responsible}</span>
          </div>
          <div class="info-item">
            <label>Departamento:</label>
            <span>${step.department}</span>
          </div>
          <div class="info-item">
            <label>Prazo:</label>
            <span>${formatDate(step.dueDate)}</span>
          </div>
          ${isAdmin ? `
            <button class="btn-secondary btn-sm" onclick="TimelineComponent.toggleStepStatus('${step.id}')">
              Marcar como ${step.status === "Concluído" ? "Pendente" : "Concluído"}
            </button>
          ` : ''}
        </div>
      </div>
    `;
  },

  toggleStepStatus(stepId) {
    const { renderApp } = this.getHelpers();
    const data = DataManager.getData();
    const step = data.nextSteps.find(s => s.id === stepId);
    if (step) {
      step.status = step.status === "Concluído" ? "Pendente" : "Concluído";
      DataManager.saveData(data);
      renderApp();
    }
  },

  afterRender() {
    // Adicionar funcionalidades interativas se necessário
  }
};

// Expor componente globalmente para os onclick
window.TimelineComponent = TimelineComponent;
