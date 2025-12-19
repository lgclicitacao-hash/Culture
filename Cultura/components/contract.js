// components/contract.js - Contrato e Aditivos

const ContractComponent = {
  render() {
    const data = DataManager.getData();
    const contract = data.documents.contract;

    return `
      <div class="page-header">
        <h1 class="page-title">Contrato</h1>
        <p class="page-subtitle">Detalhes do contrato de consultoria e documentos relacionados</p>
      </div>

      <!-- Contrato Principal -->
      <div class="card">
        <div class="card-header-with-action">
          <h3 class="card-title">Contrato Principal</h3>
          <span class="badge badge-success">Vigente</span>
        </div>
        <div class="document-card">
          <div class="document-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <div class="document-info">
            <h2 class="document-title">${contract.title}</h2>
            <div class="document-meta">
              <div class="meta-item">
                <span class="meta-label">Plano</span>
                <span class="meta-value">${contract.plan}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Início</span>
                <span class="meta-value">${App.formatDate(contract.startDate)}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Término</span>
                <span class="meta-value">${App.formatDate(contract.endDate)}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Status Financeiro</span>
                <span class="meta-value" style="color: var(--success);">${contract.billingStatus}</span>
              </div>
            </div>
            <div class="document-actions">
              <a href="${contract.pdfPath}" target="_blank" class="btn btn-primary">
                Abrir PDF
              </a>
              <a href="${contract.pdfPath}" download class="btn btn-secondary">
                Baixar
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Escopo do Contrato -->
      <div class="card">
        <h3 class="card-title">Escopo do Contrato</h3>
        <div class="scope-list">
          ${contract.scope.map(item => `
            <span class="scope-item">${item}</span>
          `).join("")}
        </div>
      </div>

      <!-- Aditivos e Anexos -->
      <div class="card">
        <div class="card-header-with-action">
          <h3 class="card-title">Aditivos e Anexos</h3>
          ${App.isAdmin() ? `
            <button class="btn btn-primary btn-sm" onclick="ContractComponent.showAddAdditiveModal()">
              + Adicionar Aditivo
            </button>
          ` : ''}
        </div>
        ${contract.additives && contract.additives.length > 0 ? `
          <div class="additives-list">
            ${contract.additives.map(additive => this.renderAdditive(additive)).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <p>Nenhum aditivo ou anexo cadastrado</p>
          </div>
        `}
      </div>

      <!-- Informações Adicionais -->
      <div class="card">
        <h3 class="card-title">Informações Adicionais</h3>
        <div class="document-meta" style="margin-top: 16px;">
          <div class="meta-item">
            <span class="meta-label">Empresa Cliente</span>
            <span class="meta-value">${data.tenant.clientCompany}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Consultoria</span>
            <span class="meta-value">${data.tenant.consultantName}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Duração</span>
            <span class="meta-value">6 meses</span>
          </div>
        </div>
      </div>

      <!-- Modal para Adicionar Aditivo -->
      <div id="additiveModal" class="modal" style="display: none;">
        <div class="modal-content modal-md">
          <div class="modal-header">
            <h3>Adicionar Aditivo/Anexo</h3>
            <button class="modal-close" onclick="ContractComponent.closeAdditiveModal()">&times;</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Tipo de Documento</label>
              <select id="additiveType" class="form-control">
                <option value="aditivo">Aditivo Contratual</option>
                <option value="anexo">Anexo</option>
              </select>
            </div>
            <div class="form-group">
              <label>Título</label>
              <input type="text" id="additiveTitle" class="form-control" placeholder="Ex: Aditivo 01 - Extensão de Prazo">
            </div>
            <div class="form-group">
              <label>Versão</label>
              <input type="text" id="additiveVersion" class="form-control" placeholder="Ex: 1.0">
            </div>
            <div class="form-group">
              <label>Data</label>
              <input type="date" id="additiveDate" class="form-control">
            </div>
            <div class="form-group">
              <label>Descrição</label>
              <textarea id="additiveDescription" class="form-control" rows="3" placeholder="Breve descrição do documento"></textarea>
            </div>
            <div class="form-group">
              <label>Link/Caminho do Arquivo</label>
              <input type="text" id="additivePath" class="form-control" placeholder="./contrato/aditivo-01.pdf">
            </div>
            <div class="form-group">
              <label>Responsável pelo Upload</label>
              <input type="text" id="additiveUploader" class="form-control" value="${App.currentUser.name}" readonly>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="ContractComponent.closeAdditiveModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="ContractComponent.saveAdditive()">Salvar</button>
          </div>
        </div>
      </div>
    `;
  },

  renderAdditive(additive) {
    const typeLabel = additive.type === 'aditivo' ? 'Aditivo' : 'Anexo';
    const typeClass = additive.type === 'aditivo' ? 'badge-primary' : 'badge-secondary';

    return `
      <div class="additive-item">
        <div class="additive-header">
          <div class="additive-title-section">
            <span class="badge ${typeClass}">${typeLabel}</span>
            <h4>${additive.title}</h4>
          </div>
          <div class="additive-actions">
            <a href="${additive.path}" target="_blank" class="btn btn-sm btn-primary">Abrir</a>
            <a href="${additive.path}" download class="btn btn-sm btn-secondary">Baixar</a>
            ${App.isAdmin() ? `
              <button class="btn btn-sm btn-danger" onclick="ContractComponent.deleteAdditive('${additive.id}')">Excluir</button>
            ` : ''}
          </div>
        </div>
        <div class="additive-info">
          <div class="additive-meta">
            <span><strong>Versão:</strong> ${additive.version}</span>
            <span><strong>Data:</strong> ${App.formatDate(additive.date)}</span>
            <span><strong>Responsável:</strong> ${additive.uploadedBy}</span>
          </div>
          ${additive.description ? `<p class="additive-description">${additive.description}</p>` : ''}
        </div>
      </div>
    `;
  },

  showAddAdditiveModal() {
    document.getElementById('additiveModal').style.display = 'flex';
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('additiveDate').value = today;
  },

  closeAdditiveModal() {
    document.getElementById('additiveModal').style.display = 'none';
    // Clear form
    document.getElementById('additiveType').value = 'aditivo';
    document.getElementById('additiveTitle').value = '';
    document.getElementById('additiveVersion').value = '';
    document.getElementById('additiveDate').value = '';
    document.getElementById('additiveDescription').value = '';
    document.getElementById('additivePath').value = '';
  },

  saveAdditive() {
    const type = document.getElementById('additiveType').value;
    const title = document.getElementById('additiveTitle').value.trim();
    const version = document.getElementById('additiveVersion').value.trim();
    const date = document.getElementById('additiveDate').value;
    const description = document.getElementById('additiveDescription').value.trim();
    const path = document.getElementById('additivePath').value.trim();
    const uploadedBy = App.currentUser.name;

    if (!title || !version || !date || !path) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const data = DataManager.getData();
    if (!data.documents.contract.additives) {
      data.documents.contract.additives = [];
    }

    const newAdditive = {
      id: 'AD' + (data.documents.contract.additives.length + 1),
      type,
      title,
      version,
      date,
      description,
      path,
      uploadedBy,
      uploadedAt: new Date().toISOString().split('T')[0]
    };

    data.documents.contract.additives.push(newAdditive);
    DataManager.saveData(data);

    this.closeAdditiveModal();
    App.render();
  },

  deleteAdditive(additiveId) {
    if (!confirm('Tem certeza que deseja excluir este documento?')) {
      return;
    }

    const data = DataManager.getData();
    data.documents.contract.additives = data.documents.contract.additives.filter(
      a => a.id !== additiveId
    );
    DataManager.saveData(data);
    App.render();
  },

  afterRender() {
    // Event listeners já estão configurados inline
  }
};
