// components/journey.js - Roadmap Estratégico

const JourneyComponent = {
  editingStep: null,

  render() {
    const data = DataManager.getData();
    const journeyData = data.journey;
    const phases = journeyData.phases.sort((a, b) => a.order - b.order);
    const isAdmin = App.isAdmin();

    const currentPhase = phases.find(p => p.id === journeyData.currentPhase);
    const nextPhase = phases.find(p => p.id === journeyData.nextPhase);

    return `
      <div class="page-header">
        <h1 class="page-title">Mapa Estratégico - Roadmap</h1>
        <p class="page-subtitle">Visualize as fases do projeto e o que vem a seguir</p>
      </div>

      <!-- Próxima Fase e Entrega -->
      <div class="card roadmap-highlight">
        <h3 class="card-title">Onde Estamos e Próximos Passos</h3>
        <div class="highlight-grid">
          <div class="highlight-card highlight-current">
            <div class="highlight-icon">🎯</div>
            <div class="highlight-content">
              <label>Fase Atual</label>
              <h4>${currentPhase ? currentPhase.title : 'N/A'}</h4>
              <div class="highlight-progress">
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${currentPhase ? currentPhase.progress : 0}%"></div>
                </div>
                <span>${currentPhase ? currentPhase.progress : 0}% concluído</span>
              </div>
            </div>
          </div>
          <div class="highlight-card highlight-next">
            <div class="highlight-icon">➡️</div>
            <div class="highlight-content">
              <label>Próxima Fase</label>
              <h4>${nextPhase ? nextPhase.title : 'N/A'}</h4>
              <p class="text-muted">${nextPhase ? nextPhase.description : ''}</p>
              <span class="next-date">Previsto: ${nextPhase ? App.formatDate(nextPhase.dueDate) : 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Trilha de Fases -->
      <div class="card">
        <h3 class="card-title">Trilha de Fases (Ordem Atual)</h3>
        ${journeyData.orderHistory && journeyData.orderHistory.length > 1 ? `
          <div class="order-history-alert">
            ℹ️ A ordem das fases foi ajustada durante o projeto.
            <button class="btn btn-link" onclick="JourneyComponent.showOrderHistory()">Ver histórico</button>
          </div>
        ` : ''}
        <div class="journey-timeline">
          ${phases.map((step, index) => `
          <div class="journey-step ${App.getStatusClass(step.status)} ${step.id === journeyData.currentPhase ? 'current-phase' : ''} ${this.editingStep === step.id ? 'editing' : ''}" data-step-id="${step.id}">
            <div class="journey-header">
              <div>
                <span style="color: var(--text-muted); font-size: 12px;">
                  Fase ${step.order}
                  ${step.id === journeyData.currentPhase ? ' • <strong>EM EXECUÇÃO</strong>' : ''}
                </span>
                <h3 class="journey-title">${step.title}</h3>
                <p class="journey-description">${step.description}</p>
              </div>
              <span class="journey-status">${step.status}</span>
            </div>

            <div class="journey-meta">
              <span>Responsável: ${step.owner}</span>
              <span>Data Prevista: ${App.formatDate(step.dueDate)}</span>
            </div>

            <div class="journey-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${step.progress}%;"></div>
              </div>
              <span class="progress-text">${step.progress}% concluído</span>
            </div>

            <div class="journey-checklist">
              ${step.checklist.map(item => `
                <span class="checklist-item">${item}</span>
              `).join("")}
            </div>

            ${isAdmin ? `
              <button class="btn btn-secondary mt-4" onclick="JourneyComponent.toggleEdit('${step.id}')">
                ${this.editingStep === step.id ? 'Cancelar' : 'Editar'}
              </button>

              <div class="journey-edit">
                <div class="edit-row">
                  <div class="form-group">
                    <label>Status</label>
                    <select id="status-${step.id}">
                      <option value="Não iniciado" ${step.status === "Não iniciado" ? "selected" : ""}>Não iniciado</option>
                      <option value="Em andamento" ${step.status === "Em andamento" ? "selected" : ""}>Em andamento</option>
                      <option value="Concluído" ${step.status === "Concluído" ? "selected" : ""}>Concluído</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Data Prevista</label>
                    <input type="date" id="date-${step.id}" value="${step.dueDate}">
                  </div>
                </div>
                <div class="edit-row">
                  <div class="form-group">
                    <label>Progresso (%)</label>
                    <input type="number" id="progress-${step.id}" value="${step.progress}" min="0" max="100">
                  </div>
                  <div class="form-group">
                    <label>Responsável</label>
                    <input type="text" id="owner-${step.id}" value="${step.owner}">
                  </div>
                </div>
                <button class="btn btn-primary" onclick="JourneyComponent.saveStep('${step.id}')">
                  Salvar Alterações
                </button>
              </div>
            ` : ''}
          </div>
        `).join("")}
        </div>
      </div>

      <!-- Histórico de Mudanças de Ordem -->
      <div id="orderHistoryModal" class="modal" style="display: none;">
        <div class="modal-content modal-sm">
          <div class="modal-header">
            <h3>Histórico de Mudanças</h3>
            <button class="modal-close" onclick="JourneyComponent.closeOrderHistory()">&times;</button>
          </div>
          <div class="modal-body">
            <div class="order-history-list">
              ${journeyData.orderHistory.map(entry => `
                <div class="history-entry">
                  <div class="history-date">${App.formatDate(entry.date)}</div>
                  <div class="history-change">${entry.change}</div>
                  <div class="history-user">${entry.changedBy}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  toggleEdit(stepId) {
    if (this.editingStep === stepId) {
      this.editingStep = null;
    } else {
      this.editingStep = stepId;
    }
    App.render();
  },

  saveStep(stepId) {
    const statusSelect = document.getElementById(`status-${stepId}`);
    const dateInput = document.getElementById(`date-${stepId}`);
    const progressInput = document.getElementById(`progress-${stepId}`);
    const ownerInput = document.getElementById(`owner-${stepId}`);

    const updates = {
      status: statusSelect.value,
      dueDate: dateInput.value,
      progress: parseInt(progressInput.value) || 0,
      owner: ownerInput.value
    };

    DataManager.updateJourneyStep(stepId, updates);
    this.editingStep = null;
    App.render();
  },

  showOrderHistory() {
    document.getElementById('orderHistoryModal').style.display = 'flex';
  },

  closeOrderHistory() {
    document.getElementById('orderHistoryModal').style.display = 'none';
  },

  afterRender() {
    // Event listeners já configurados inline
  }
};
