// components/manual.js - Manual de Cultura

const ManualComponent = {
  render() {
    const data = DataManager.getData();
    const manual = data.documents.cultureManual;

    return `
      <div class="page-header">
        <h1 class="page-title">Manual de Cultura</h1>
        <p class="page-subtitle">Documento oficial da cultura organizacional</p>
      </div>

      <div class="card">
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
            <h2 class="document-title">${manual.title}</h2>
            <div class="document-meta">
              <div class="meta-item">
                <span class="meta-label">Versao</span>
                <span class="meta-value">${manual.version}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Status</span>
                <span class="meta-value">${manual.status}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Aprovado por</span>
                <span class="meta-value">${manual.approvedBy}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Data de Aprovacao</span>
                <span class="meta-value">${App.formatDate(manual.approvedAt)}</span>
              </div>
            </div>
            <div class="document-actions">
              <a href="${manual.pdfPath}" target="_blank" class="btn btn-primary">
                Abrir PDF
              </a>
              <a href="${manual.pdfPath}" download class="btn btn-secondary">
                Baixar
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">Sobre o Manual</h3>
        <p style="color: var(--text-muted); margin-top: 12px; line-height: 1.7;">
          O Manual de Cultura documenta os valores, comportamentos esperados e praticas
          organizacionais definidos durante o processo de diagnostico e construcao cultural
          realizado pela CNP em parceria com ${data.tenant.clientCompany}. Este documento
          serve como referencia oficial para alinhamento de todas as areas e colaboradores.
        </p>
      </div>
    `;
  },

  afterRender() {
    // Nenhuma interação adicional necessária
  }
};
