// components/deliverables.js - Entregáveis e Evidências

const DeliverablesComponent = {
  currentView: 'kanban', // 'kanban' ou 'list'
  filterPhase: 'all',
  selectedDeliverable: null,

  render() {
    // Garantir referência segura ao App global
    const app = window.App || {};
    const isAdmin = typeof app.isAdmin === "function" ? app.isAdmin() : false;
    const formatDate = typeof app.formatDate === "function" ? app.formatDate : (d => d || "-");
    const getIcon = typeof app.getIcon === "function" ? app.getIcon.bind(app) : (() => "");

    const data = DataManager.getData();
    const deliverables = data.deliverables || [];
    const phases = data.journey.phases;

    // Filtrar por fase se necessário
    const filtered = this.filterPhase === 'all'
      ? deliverables
      : deliverables.filter(d => d.phase === this.filterPhase);

    return `
      <div class="page-header">
        <h1 class="page-title">Entregáveis</h1>
        <p class="page-subtitle">Acompanhe todos os entregáveis do projeto com evidências e status</p>
      </div>

      <!-- Filtros e Visualização -->
      <div class="card">
        <div class="deliverables-controls">
          <div class="view-toggle">
            <button class="btn ${this.currentView === 'kanban' ? 'btn-primary' : 'btn-secondary'}"
                    onclick="DeliverablesComponent.setView('kanban')">
              Kanban
            </button>
            <button class="btn ${this.currentView === 'list' ? 'btn-primary' : 'btn-secondary'}"
                    onclick="DeliverablesComponent.setView('list')">
              Lista
            </button>
          </div>
          <div class="phase-filter">
            <label>Filtrar por Fase:</label>
            <select onchange="DeliverablesComponent.setFilter(this.value)" class="form-control">
              <option value="all" ${this.filterPhase === 'all' ? 'selected' : ''}>Todas as Fases</option>
              ${phases.map(p => `
                <option value="${p.id}" ${this.filterPhase === p.id ? 'selected' : ''}>
                  ${p.title}
                </option>
              `).join('')}
            </select>
          </div>
          ${isAdmin ? `
            <button class="btn btn-primary" onclick="DeliverablesComponent.showAddDeliverableModal()">
              + Novo Entregável
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Estatísticas Rápidas -->
      <div class="deliverables-stats">
        ${this.renderStats(deliverables)}
      </div>

      <!-- Visualização Kanban ou Lista -->
      ${this.currentView === 'kanban'
        ? this.renderKanban(filtered, phases)
        : this.renderList(filtered, phases)}

      <!-- Modal de Detalhes -->
      <div id="deliverableDetailModal" class="modal" style="display: none;">
        ${this.selectedDeliverable ? this.renderDeliverableDetail(this.selectedDeliverable) : ''}
      </div>
    `;
  },

  renderStats(deliverables) {
    const total = deliverables.length;
    const completed = deliverables.filter(d => d.status === 'Concluído').length;
    const inProgress = deliverables.filter(d => d.status === 'Em andamento').length;
    const validation = deliverables.filter(d => d.status === 'Em validação').length;
    const blocked = deliverables.filter(d => d.status === 'Bloqueado').length;
    const notStarted = deliverables.filter(d => d.status === 'Não iniciado').length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return `
      <div class="stats-grid">
        <div class="stat-card stat-total">
          <div class="stat-value">${total}</div>
          <div class="stat-label">Total</div>
        </div>
        <div class="stat-card stat-completed">
          <div class="stat-value">${completed}</div>
          <div class="stat-label">Concluídos</div>
        </div>
        <div class="stat-card stat-progress">
          <div class="stat-value">${inProgress}</div>
          <div class="stat-label">Em Andamento</div>
        </div>
        <div class="stat-card stat-validation">
          <div class="stat-value">${validation}</div>
          <div class="stat-label">Em Validação</div>
        </div>
        <div class="stat-card stat-blocked">
          <div class="stat-value">${blocked}</div>
          <div class="stat-label">Bloqueados</div>
        </div>
        <div class="stat-card stat-rate">
          <div class="stat-value">${completionRate}%</div>
          <div class="stat-label">Taxa de Conclusão</div>
        </div>
      </div>
    `;
  },

  renderKanban(deliverables, phases) {
    const statuses = ['Não iniciado', 'Em andamento', 'Em validação', 'Concluído', 'Bloqueado'];

    return `
      <div class="kanban-board">
        ${statuses.map(status => `
          <div class="kanban-column">
            <div class="kanban-header">
              <h3>${status}</h3>
              <span class="kanban-count">${deliverables.filter(d => d.status === status).length}</span>
            </div>
            <div class="kanban-cards">
              ${deliverables
                .filter(d => d.status === status)
                .map(d => this.renderDeliverableCard(d, phases))
                .join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderList(deliverables, phases) {
    return `
      <div class="card">
        <div class="deliverables-table">
          <table>
            <thead>
              <tr>
                <th>Entregável</th>
                <th>Fase</th>
                <th>Responsável</th>
                <th>Status</th>
                <th>Progresso</th>
                <th>Prazo</th>
                <th>Evidências</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              ${deliverables.map(d => this.renderDeliverableRow(d, phases)).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderDeliverableCard(deliverable, phases) {
    const phase = phases.find(p => p.id === deliverable.phase);
    const isLate = deliverable.plannedDate && new Date(deliverable.plannedDate) < new Date() && deliverable.status !== 'Concluído';
    const app = window.App || {};
    const formatDate = typeof app.formatDate === "function" ? app.formatDate : (d => d || "-");

    return `
      <div class="deliverable-card ${isLate ? 'late' : ''}" onclick="DeliverablesComponent.showDetail('${deliverable.id}')">
        <h4>${deliverable.title}</h4>
        <p class="deliverable-desc">${deliverable.description}</p>
        <div class="deliverable-meta">
          <span class="phase-badge">${phase ? phase.title : 'N/A'}</span>
          <span class="responsible">${deliverable.responsible}</span>
        </div>
        <div class="deliverable-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${deliverable.progress}%"></div>
          </div>
          <span>${deliverable.progress}%</span>
        </div>
        <div class="deliverable-footer">
          <span class="date">${formatDate(deliverable.plannedDate)}</span>
          <span class="evidences-count">${deliverable.evidences.length} evidências</span>
        </div>
      </div>
    `;
  },

  renderDeliverableRow(deliverable, phases) {
    const phase = phases.find(p => p.id === deliverable.phase);
    const isLate = deliverable.plannedDate && new Date(deliverable.plannedDate) < new Date() && deliverable.status !== 'Concluído';
    const app = window.App || {};
    const formatDate = typeof app.formatDate === "function" ? app.formatDate : (d => d || "-");

    return `
      <tr class="${isLate ? 'row-late' : ''}">
        <td>
          <strong>${deliverable.title}</strong>
          <br><small class="text-muted">${deliverable.description}</small>
        </td>
        <td>${phase ? phase.title : 'N/A'}</td>
        <td>${deliverable.responsible}</td>
        <td><span class="badge ${this.getStatusClass(deliverable.status)}">${deliverable.status}</span></td>
        <td>
          <div class="progress-bar-inline">
            <div class="progress-fill" style="width: ${deliverable.progress}%"></div>
          </div>
          ${deliverable.progress}%
        </td>
        <td>${formatDate(deliverable.plannedDate)}</td>
        <td>${deliverable.evidences.length}</td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="DeliverablesComponent.showDetail('${deliverable.id}')">
            Ver Detalhes
          </button>
        </td>
      </tr>
    `;
  },

  renderDeliverableDetail(deliverable) {
    const data = DataManager.getData();
    const phase = data.journey.phases.find(p => p.id === deliverable.phase);
    const app = window.App || {};
    const formatDate = typeof app.formatDate === "function" ? app.formatDate : (d => d || "-");
    const isAdmin = typeof app.isAdmin === "function" ? app.isAdmin() : false;

    return `
      <div class="modal-content modal-lg">
        <div class="modal-header">
          <h3>${deliverable.title}</h3>
          <button class="modal-close" onclick="DeliverablesComponent.closeDetail()">&times;</button>
        </div>
        <div class="modal-body">
          <div class="deliverable-detail-grid">
            <div class="detail-section">
              <h4>Informações Gerais</h4>
              <div class="detail-info">
                <div class="info-row">
                  <label>Fase:</label>
                  <span>${phase ? phase.title : 'N/A'}</span>
                </div>
                <div class="info-row">
                  <label>Status:</label>
                  <span class="badge ${this.getStatusClass(deliverable.status)}">${deliverable.status}</span>
                </div>
                <div class="info-row">
                  <label>Responsável:</label>
                  <span>${deliverable.responsible}</span>
                </div>
                <div class="info-row">
                  <label>Progresso:</label>
                  <div class="progress-detail">
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: ${deliverable.progress}%"></div>
                    </div>
                    <span>${deliverable.progress}%</span>
                  </div>
                </div>
                <div class="info-row">
                  <label>Data Prevista:</label>
                  <span>${formatDate(deliverable.plannedDate)}</span>
                </div>
                <div class="info-row">
                  <label>Data de Conclusão:</label>
                  <span>${deliverable.completedDate ? formatDate(deliverable.completedDate) : '-'}</span>
                </div>
              </div>
              <div class="detail-description">
                <label>Descrição:</label>
                <p>${deliverable.description}</p>
              </div>
            </div>

            <div class="detail-section">
              <h4>Evidências (${deliverable.evidences.length})</h4>
              ${deliverable.evidences.length > 0 ? `
                <div class="evidences-list">
                  ${deliverable.evidences.map(ev => `
                    <div class="evidence-item">
                      <div class="evidence-icon">${ev.type === 'pdf' ? '📄' : '🔗'}</div>
                      <div class="evidence-info">
                        <strong>${ev.title}</strong>
                        <div class="evidence-meta">
                          <span>${formatDate(ev.uploadedAt)}</span>
                          <span>${ev.uploadedBy}</span>
                        </div>
                      </div>
                      <div class="evidence-actions">
                        ${ev.type === 'pdf'
                          ? `<a href="${ev.path}" target="_blank" class="btn btn-sm btn-primary">Abrir</a>`
                          : `<a href="${ev.url}" target="_blank" class="btn btn-sm btn-primary">Acessar</a>`
                        }
                      </div>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <p class="text-muted">Nenhuma evidência cadastrada</p>
              `}
              ${isAdmin ? `
                <button class="btn btn-secondary mt-3" onclick="DeliverablesComponent.showAddEvidenceForm('${deliverable.id}')">
                  + Adicionar Evidência
                </button>
              ` : ''}
            </div>
          </div>

          <div class="detail-section">
            <h4>Histórico de Mudanças</h4>
            ${deliverable.changelog && deliverable.changelog.length > 0 ? `
              <div class="changelog-list">
                ${deliverable.changelog.map(log => `
                  <div class="changelog-entry">
                    <div class="changelog-date">${App.formatDate(log.date)}</div>
                    <div class="changelog-change">${log.change}</div>
                    <div class="changelog-user">${log.user}</div>
                  </div>
                `).join('')}
              </div>
            ` : `
              <p class="text-muted">Nenhum histórico registrado</p>
            `}
          </div>
        </div>
        <div class="modal-footer">
          ${isAdmin ? `
            <button class="btn btn-secondary" onclick="DeliverablesComponent.editDeliverable('${deliverable.id}')">
              Editar
            </button>
          ` : ''}
          <button class="btn btn-primary" onclick="DeliverablesComponent.closeDetail()">
            Fechar
          </button>
        </div>
      </div>
    `;
  },

  getStatusClass(status) {
    const map = {
      'Concluído': 'status-done',
      'Em andamento': 'status-progress',
      'Em validação': 'status-validation',
      'Bloqueado': 'status-blocked',
      'Não iniciado': 'status-pending'
    };
    return map[status] || 'status-pending';
  },

  setView(view) {
    this.currentView = view;
    const app = window.App || {};
    if (typeof app.render === "function") {
      app.render();
    }
  },

  setFilter(phase) {
    this.filterPhase = phase;
    const app = window.App || {};
    if (typeof app.render === "function") {
      app.render();
    }
  },

  showDetail(deliverableId) {
    const data = DataManager.getData();
    this.selectedDeliverable = data.deliverables.find(d => d.id === deliverableId);
    document.getElementById('deliverableDetailModal').style.display = 'flex';
  },

  closeDetail() {
    this.selectedDeliverable = null;
    document.getElementById('deliverableDetailModal').style.display = 'none';
  },

  showAddDeliverableModal() {
    alert('Funcionalidade de adicionar entregável será implementada');
  },

  showAddEvidenceForm(deliverableId) {
    alert('Funcionalidade de adicionar evidência será implementada');
  },

  editDeliverable(deliverableId) {
    alert('Funcionalidade de edição será implementada');
  },

  afterRender() {
    // Event listeners configurados inline
  }
};
