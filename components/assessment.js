// components/assessment.js - Assessment de Liderancas e Equipe

const AssessmentComponent = {
  currentView: 'list', // list, wizard, detail, presentation
  currentAssessment: null,
  wizardStep: 1,
  editingEmployee: null,
  currentEditingId: null, // Track which assessment we're editing

  render() {
    const [route, param, subparam] = App.currentRoute.split('/');

    if (param === 'presentation') {
      // Reset wizard state when leaving wizard
      this.resetWizardState();
      return this.renderPresentation();
    } else if (param === 'new') {
      // Initialize new assessment if not already in new mode
      if (this.currentEditingId !== 'new') {
        this.resetWizardState();
        this.currentEditingId = 'new';
        this.currentAssessment = this.getEmptyAssessment();
      }
      return this.renderWizard(null);
    } else if (param === 'edit' && subparam) {
      // Initialize edit mode if switching to different assessment
      if (this.currentEditingId !== subparam) {
        this.resetWizardState();
        this.currentEditingId = subparam;
        const assessment = DataManager.getAssessment(subparam);
        this.currentAssessment = JSON.parse(JSON.stringify(assessment));
      }
      return this.renderWizard(this.currentAssessment);
    } else if (param === 'view' && subparam) {
      // Reset wizard state when leaving wizard
      this.resetWizardState();
      return this.renderDetail(subparam);
    }
    // Reset wizard state when returning to list
    this.resetWizardState();
    return this.renderList();
  },

  resetWizardState() {
    this.currentAssessment = null;
    this.wizardStep = 1;
    this.currentEditingId = null;
  },

  renderList() {
    const data = DataManager.getData();
    const assessments = data.assessments || [];
    
    // Acesso seguro ao App
    const app = window.App || {};
    const isAdmin = typeof app.isAdmin === "function" ? app.isAdmin() : false;
    const formatDate = typeof app.formatDate === "function" ? app.formatDate : (d => d || "-");

    const grouped = {
      red_flag: assessments.filter(a => a.classificacao === 'red_flag'),
      pontos_desenvolver: assessments.filter(a => a.classificacao === 'pontos_desenvolver'),
      com_potencial: assessments.filter(a => a.classificacao === 'com_potencial')
    };

    return `
      <div class="page-header">
        <h1 class="page-title">Assessment de Liderancas e Equipe</h1>
        <p class="page-subtitle">Avaliacao de pessoas, processos e performance</p>
      </div>

      <div class="assessment-actions">
        ${isAdmin ? `
          <button class="btn btn-primary" onclick="App.navigate('assessment/new')">
            + Novo Assessment
          </button>
        ` : ''}
        <button class="btn btn-secondary" onclick="App.navigate('assessment/presentation')">
          Ver Apresentacao Consolidada
        </button>
      </div>

      <div class="assessment-summary-cards">
        <div class="assessment-summary-card red-flag">
          <div class="summary-icon">!</div>
          <div class="summary-content">
            <div class="summary-count">${grouped.red_flag.length}</div>
            <div class="summary-label">Red Flags</div>
          </div>
        </div>
        <div class="assessment-summary-card pontos-desenvolver">
          <div class="summary-icon">~</div>
          <div class="summary-content">
            <div class="summary-count">${grouped.pontos_desenvolver.length}</div>
            <div class="summary-label">Pontos a Desenvolver</div>
          </div>
        </div>
        <div class="assessment-summary-card com-potencial">
          <div class="summary-icon">★</div>
          <div class="summary-content">
            <div class="summary-count">${grouped.com_potencial.length}</div>
            <div class="summary-label">Com Potencial</div>
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">Assessments Realizados</h3>
        <div class="table-container" style="margin-top: 16px;">
          <table>
            <thead>
              <tr>
                <th>Colaborador</th>
                <th>Area</th>
                <th>Data</th>
                <th>Entregas</th>
                <th>Comportamentos</th>
                <th>Cultura</th>
                <th>Classificacao</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              ${assessments.map(a => {
                const emp = data.employees.find(e => e.id === a.employeeId);
                const medias = this.calcularMedias(a);
                return `
                  <tr>
                    <td>
                      <div class="assessment-employee">
                        <span class="employee-name" onclick="App.navigate('assessment/view/${a.id}')">${emp ? emp.name : 'N/A'}</span>
                        ${a.flagT ? '<span class="flag-badge flag-t">T</span>' : ''}
                        ${a.flagI ? '<span class="flag-badge flag-i">I</span>' : ''}
                      </div>
                    </td>
                    <td>${emp ? emp.area : 'N/A'}</td>
                    <td>${formatDate(a.date)}</td>
                    <td><span class="score ${this.getScoreClass(medias.entregas)}">${medias.entregas.toFixed(1)}</span></td>
                    <td><span class="score ${this.getScoreClass(medias.comportamentos)}">${medias.comportamentos.toFixed(1)}</span></td>
                    <td><span class="score ${this.getScoreClass(medias.cultura)}">${medias.cultura.toFixed(1)}</span></td>
                    <td><span class="classificacao-badge ${a.classificacao}">${this.getClassificacaoLabel(a.classificacao)}</span></td>
                    <td>
                      <div class="action-buttons">
                        <button class="btn-icon" onclick="App.navigate('assessment/view/${a.id}')" title="Ver">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        ${isAdmin ? `
                          <button class="btn-icon" onclick="App.navigate('assessment/edit/${a.id}')" title="Editar">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                          <button class="btn-icon btn-danger" onclick="AssessmentComponent.deleteAssessment('${a.id}')" title="Excluir">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                          </button>
                        ` : ''}
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderWizard(existingAssessment) {
    const data = DataManager.getData();
    const config = data.assessmentConfig;
    
    // Acesso seguro ao App
    const app = window.App || {};
    const isAdmin = typeof app.isAdmin === "function" ? app.isAdmin() : false;

    if (!isAdmin) {
      return `<div class="card"><p>Acesso restrito a administradores.</p></div>`;
    }

    // currentAssessment should already be initialized in render()
    const assessment = this.currentAssessment;
    const step = this.wizardStep;

    if (!assessment) {
      // Fallback - should not happen but just in case
      this.currentAssessment = this.getEmptyAssessment();
    }

    const steps = [
      { num: 1, title: 'Entrevista Guiada', desc: 'Coleta individual' },
      { num: 2, title: 'Relatorio de Mapeamento', desc: 'Avaliacoes e notas' },
      { num: 3, title: 'Classificacao do Perfil', desc: 'Red Flag / Desenvolver / Potencial' },
      { num: 4, title: 'Apresentacao', desc: 'Sumario e conclusao' }
    ];

    return `
      <div class="page-header">
        <a href="#assessment" class="back-link">← Voltar para lista</a>
        <h1 class="page-title">${existingAssessment ? 'Editar' : 'Novo'} Assessment</h1>
      </div>

      <div class="wizard-steps">
        ${steps.map(s => `
          <div class="wizard-step ${step === s.num ? 'active' : ''} ${step > s.num ? 'completed' : ''}" onclick="AssessmentComponent.goToStep(${s.num})">
            <div class="wizard-step-number">${s.num}</div>
            <div class="wizard-step-info">
              <div class="wizard-step-title">${s.title}</div>
              <div class="wizard-step-desc">${s.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <form id="assessment-form" class="assessment-form">
        <input type="hidden" id="assessment-id" value="${assessment.id || ''}">

        ${step === 1 ? this.renderStep1(assessment, data) : ''}
        ${step === 2 ? this.renderStep2(assessment, config) : ''}
        ${step === 3 ? this.renderStep3(assessment) : ''}
        ${step === 4 ? this.renderStep4(assessment, data) : ''}

        <div class="wizard-actions">
          ${step > 1 ? `<button type="button" class="btn btn-secondary" onclick="AssessmentComponent.prevStep()">Anterior</button>` : ''}
          ${step < 4 ? `<button type="button" class="btn btn-primary" onclick="AssessmentComponent.nextStep()">Proximo</button>` : ''}
          ${step === 4 ? `<button type="button" class="btn btn-primary" onclick="AssessmentComponent.saveAssessment()">Salvar Assessment</button>` : ''}
        </div>
      </form>
    `;
  },

  renderStep1(assessment, data) {
    const availableEmployees = data.employees.filter(e => {
      const existing = data.assessments.find(a => a.employeeId === e.id && a.id !== assessment.id);
      return !existing;
    });

    return `
      <div class="card">
        <h3 class="card-title">1. Entrevista/Reuniao Guiada</h3>
        <p class="card-subtitle">Coleta individual baseada em Pessoas, Processos e Performance</p>

        <div class="form-group">
          <label>Selecione o Colaborador</label>
          <select id="employee-select" required>
            <option value="">Selecione...</option>
            ${availableEmployees.map(e => `
              <option value="${e.id}" ${assessment.employeeId === e.id ? 'selected' : ''}>
                ${e.name} - ${e.role} (${e.area})
              </option>
            `).join('')}
            ${assessment.employeeId && !availableEmployees.find(e => e.id === assessment.employeeId) ? `
              <option value="${assessment.employeeId}" selected>
                ${data.employees.find(e => e.id === assessment.employeeId)?.name || 'Colaborador'} (atual)
              </option>
            ` : ''}
          </select>
        </div>

        <div class="interview-guide">
          <h4>Roteiro de Entrevista</h4>
          <div class="guide-section">
            <h5>Pessoas</h5>
            <ul>
              <li>Como voce avalia sua relacao com a equipe?</li>
              <li>Como e sua comunicacao com lideranca e pares?</li>
              <li>Voce se sente apoiado no seu desenvolvimento?</li>
            </ul>
          </div>
          <div class="guide-section">
            <h5>Processos</h5>
            <ul>
              <li>Os processos da area sao claros?</li>
              <li>Voce tem autonomia para propor melhorias?</li>
              <li>Como avalia a organizacao do trabalho?</li>
            </ul>
          </div>
          <div class="guide-section">
            <h5>Performance</h5>
            <ul>
              <li>Suas metas estao claras?</li>
              <li>Voce recebe feedback sobre suas entregas?</li>
              <li>O que te impede de entregar mais?</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  },

  renderStep2(assessment, config) {
    return `
      <div class="card">
        <h3 class="card-title">2. Relatorio de Mapeamento de Perfil</h3>
        <p class="card-subtitle">Avalie cada criterio de 1 a 5</p>

        <div class="assessment-section">
          <h4>A) Entregas e Metas</h4>
          <table class="rating-table">
            <thead>
              <tr>
                <th>Criterio</th>
                <th>Descricao</th>
                <th>Nota (1-5)</th>
              </tr>
            </thead>
            <tbody>
              ${config.criteriosEntregas.map(c => `
                <tr>
                  <td><strong>${c.label}</strong></td>
                  <td>${c.desc}</td>
                  <td>
                    <select class="rating-select" data-field="entregas.${c.key}">
                      ${[1,2,3,4,5].map(n => `
                        <option value="${n}" ${assessment.entregas[c.key] === n ? 'selected' : ''}>${n}</option>
                      `).join('')}
                    </select>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="form-group">
            <label>Observacoes - Entregas</label>
            <textarea id="entregas-obs" rows="2">${assessment.entregas.observacoes || ''}</textarea>
          </div>
        </div>

        <div class="assessment-section">
          <h4>B) Comportamentos e Atitudes</h4>
          <table class="rating-table">
            <thead>
              <tr>
                <th>Competencia</th>
                <th>Descricao</th>
                <th>Nota (1-5)</th>
              </tr>
            </thead>
            <tbody>
              ${config.criteriosComportamentos.map(c => `
                <tr>
                  <td><strong>${c.label}</strong></td>
                  <td>${c.desc}</td>
                  <td>
                    <select class="rating-select" data-field="comportamentos.${c.key}">
                      ${[1,2,3,4,5].map(n => `
                        <option value="${n}" ${assessment.comportamentos[c.key] === n ? 'selected' : ''}>${n}</option>
                      `).join('')}
                    </select>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="form-group">
            <label>Observacoes - Comportamentos</label>
            <textarea id="comportamentos-obs" rows="2">${assessment.comportamentos.observacoes || ''}</textarea>
          </div>
        </div>

        <div class="assessment-section">
          <h4>C) Alinhamento Cultural</h4>
          <table class="rating-table">
            <thead>
              <tr>
                <th>Valor</th>
                <th>Descricao</th>
                <th>Nota (1-5)</th>
              </tr>
            </thead>
            <tbody>
              ${config.criteriosCultura.map(c => `
                <tr>
                  <td><strong>${c.label}</strong></td>
                  <td>${c.desc}</td>
                  <td>
                    <select class="rating-select" data-field="alinhamentoCultural.${c.key}">
                      ${[1,2,3,4,5].map(n => `
                        <option value="${n}" ${assessment.alinhamentoCultural[c.key] === n ? 'selected' : ''}>${n}</option>
                      `).join('')}
                    </select>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="form-group">
            <label>Evidencias - Cultura</label>
            <textarea id="cultura-evidencias" rows="2">${assessment.alinhamentoCultural.evidencias || ''}</textarea>
          </div>
        </div>
      </div>
    `;
  },

  renderStep3(assessment) {
    const medias = this.calcularMedias(assessment);
    const classificacaoAuto = this.calcularClassificacao(medias);

    return `
      <div class="card">
        <h3 class="card-title">3. Classificacao do Perfil</h3>

        <div class="classification-summary">
          <h4>Medias Calculadas</h4>
          <div class="medias-grid">
            <div class="media-card">
              <span class="media-label">Entregas</span>
              <span class="media-value ${this.getScoreClass(medias.entregas)}">${medias.entregas.toFixed(1)}</span>
            </div>
            <div class="media-card">
              <span class="media-label">Comportamentos</span>
              <span class="media-value ${this.getScoreClass(medias.comportamentos)}">${medias.comportamentos.toFixed(1)}</span>
            </div>
            <div class="media-card">
              <span class="media-label">Cultura</span>
              <span class="media-value ${this.getScoreClass(medias.cultura)}">${medias.cultura.toFixed(1)}</span>
            </div>
          </div>
          <p class="auto-classification">Classificacao automatica: <strong class="classificacao-badge ${classificacaoAuto}">${this.getClassificacaoLabel(classificacaoAuto)}</strong></p>
        </div>

        <div class="classification-options">
          <h4>Classificacao Final</h4>

          <div class="classification-cards">
            <label class="classification-card red-flag ${assessment.classificacao === 'red_flag' ? 'selected' : ''}">
              <input type="radio" name="classificacao" value="red_flag" ${assessment.classificacao === 'red_flag' ? 'checked' : ''}>
              <div class="card-content">
                <div class="card-icon">!</div>
                <h5>Red Flags</h5>
                <p>Ponto critico. Investigar e decidir: desligar ou desenvolver intensivamente.</p>
              </div>
            </label>

            <label class="classification-card pontos-desenvolver ${assessment.classificacao === 'pontos_desenvolver' ? 'selected' : ''}">
              <input type="radio" name="classificacao" value="pontos_desenvolver" ${assessment.classificacao === 'pontos_desenvolver' ? 'checked' : ''}>
              <div class="card-content">
                <div class="card-icon">~</div>
                <h5>Pontos a Desenvolver</h5>
                <p>Alinhamento cultural OK, mas precisa desenvolver em pessoas/processos/resultados.</p>
              </div>
            </label>

            <label class="classification-card com-potencial ${assessment.classificacao === 'com_potencial' ? 'selected' : ''}">
              <input type="radio" name="classificacao" value="com_potencial" ${assessment.classificacao === 'com_potencial' ? 'checked' : ''}>
              <div class="card-content">
                <div class="card-icon">★</div>
                <h5>Com Potencial</h5>
                <p>Postura esperada. Alinhamento cultural + conhecimento aplicado.</p>
              </div>
            </label>
          </div>
        </div>

        <div class="flags-section">
          <h4>Flags Opcionais</h4>
          <div class="flags-options">
            <label class="flag-option">
              <input type="checkbox" id="flag-t" ${assessment.flagT ? 'checked' : ''}>
              <span class="flag-badge flag-t">T</span>
              <span>Perfil predominantemente tecnico</span>
            </label>
            <label class="flag-option">
              <input type="checkbox" id="flag-i" ${assessment.flagI ? 'checked' : ''}>
              <span class="flag-badge flag-i">I</span>
              <span>Alto indice de insatisfacao</span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label>Texto do Perfil (opcional - sobrescreve automatico)</label>
          <textarea id="texto-perfil" rows="3" placeholder="Descreva observacoes especificas sobre o perfil...">${assessment.textoPerfilManual || ''}</textarea>
        </div>
      </div>
    `;
  },

  renderStep4(assessment, data) {
    const emp = data.employees.find(e => e.id === assessment.employeeId);
    const medias = this.calcularMedias(assessment);

    return `
      <div class="card">
        <h3 class="card-title">4. Sumario do Assessment</h3>

        ${emp ? `
          <div class="profile-header" style="margin-bottom: 24px;">
            <div class="profile-avatar">${emp.name.split(' ').map(n => n[0]).join('').substring(0,2)}</div>
            <div class="profile-info">
              <h2>${emp.name}</h2>
              <p class="profile-meta">${emp.role} | ${emp.area}</p>
            </div>
            <span class="classificacao-badge ${assessment.classificacao}">${this.getClassificacaoLabel(assessment.classificacao)}</span>
          </div>
        ` : '<p class="text-muted">Selecione um colaborador na etapa 1</p>'}

        <div class="sumario-table-container">
          <table class="sumario-table">
            <thead>
              <tr>
                <th>Dimensao</th>
                <th>Nota Media</th>
                <th>Forcas</th>
                <th>Pontos de Atencao</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Entregas</strong></td>
                <td><span class="score ${this.getScoreClass(medias.entregas)}">${medias.entregas.toFixed(1)}</span></td>
                <td rowspan="3">
                  <textarea id="sumario-forcas" rows="4" placeholder="Descreva as principais forcas...">${assessment.sumario?.forcas || ''}</textarea>
                </td>
                <td rowspan="3">
                  <textarea id="sumario-atencao" rows="4" placeholder="Descreva os pontos de atencao...">${assessment.sumario?.pontosAtencao || ''}</textarea>
                </td>
              </tr>
              <tr>
                <td><strong>Comportamentos</strong></td>
                <td><span class="score ${this.getScoreClass(medias.comportamentos)}">${medias.comportamentos.toFixed(1)}</span></td>
              </tr>
              <tr>
                <td><strong>Cultura</strong></td>
                <td><span class="score ${this.getScoreClass(medias.cultura)}">${medias.cultura.toFixed(1)}</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="final-notes">
          <p><strong>Media Geral:</strong> <span class="score ${this.getScoreClass(medias.geral)}">${medias.geral.toFixed(1)}</span></p>
          ${assessment.flagT ? '<span class="flag-badge flag-t">T</span> Perfil Tecnico' : ''}
          ${assessment.flagI ? '<span class="flag-badge flag-i">I</span> Indice de Insatisfacao' : ''}
        </div>
      </div>
    `;
  },

  renderDetail(assessmentId) {
    const data = DataManager.getData();
    const assessment = data.assessments.find(a => a.id === assessmentId);
    const config = data.assessmentConfig;

    if (!assessment) {
      return `<div class="card"><p>Assessment nao encontrado.</p><a href="#assessment" class="btn btn-secondary">Voltar</a></div>`;
    }

    const emp = data.employees.find(e => e.id === assessment.employeeId);
    const medias = this.calcularMedias(assessment);

    return `
      <div class="page-header">
        <a href="#assessment" class="back-link">← Voltar para lista</a>
        <h1 class="page-title">Detalhes do Assessment</h1>
      </div>

      <div class="card">
        <div class="profile-header">
          <div class="profile-avatar">${emp ? emp.name.split(' ').map(n => n[0]).join('').substring(0,2) : '?'}</div>
          <div class="profile-info">
            <h2>${emp ? emp.name : 'N/A'}</h2>
            <p class="profile-meta">${emp ? `${emp.role} | ${emp.area}` : ''}</p>
          </div>
          <div class="detail-badges">
            <span class="classificacao-badge ${assessment.classificacao}">${this.getClassificacaoLabel(assessment.classificacao)}</span>
            ${assessment.flagT ? '<span class="flag-badge flag-t">T</span>' : ''}
            ${assessment.flagI ? '<span class="flag-badge flag-i">I</span>' : ''}
          </div>
        </div>

        <div class="profile-scores" style="margin-top: 24px;">
          <div class="profile-score-card">
            <div class="profile-score-label">Entregas</div>
            <div class="profile-score-value ${this.getScoreClass(medias.entregas)}">${medias.entregas.toFixed(1)}</div>
          </div>
          <div class="profile-score-card">
            <div class="profile-score-label">Comportamentos</div>
            <div class="profile-score-value ${this.getScoreClass(medias.comportamentos)}">${medias.comportamentos.toFixed(1)}</div>
          </div>
          <div class="profile-score-card">
            <div class="profile-score-label">Cultura</div>
            <div class="profile-score-value ${this.getScoreClass(medias.cultura)}">${medias.cultura.toFixed(1)}</div>
          </div>
          <div class="profile-score-card">
            <div class="profile-score-label">Media Geral</div>
            <div class="profile-score-value ${this.getScoreClass(medias.geral)}">${medias.geral.toFixed(1)}</div>
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">Entregas e Metas</h3>
        <table class="detail-table">
          <tbody>
            ${config.criteriosEntregas.map(c => `
              <tr>
                <td><strong>${c.label}</strong></td>
                <td><span class="score ${this.getScoreClass(assessment.entregas[c.key])}">${assessment.entregas[c.key]}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ${assessment.entregas.observacoes ? `<p class="obs-text"><strong>Obs:</strong> ${assessment.entregas.observacoes}</p>` : ''}
      </div>

      <div class="card">
        <h3 class="card-title">Comportamentos e Atitudes</h3>
        <table class="detail-table">
          <tbody>
            ${config.criteriosComportamentos.map(c => `
              <tr>
                <td><strong>${c.label}</strong></td>
                <td><span class="score ${this.getScoreClass(assessment.comportamentos[c.key])}">${assessment.comportamentos[c.key]}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ${assessment.comportamentos.observacoes ? `<p class="obs-text"><strong>Obs:</strong> ${assessment.comportamentos.observacoes}</p>` : ''}
      </div>

      <div class="card">
        <h3 class="card-title">Alinhamento Cultural</h3>
        <table class="detail-table">
          <tbody>
            ${config.criteriosCultura.map(c => `
              <tr>
                <td><strong>${c.label}</strong></td>
                <td><span class="score ${this.getScoreClass(assessment.alinhamentoCultural[c.key])}">${assessment.alinhamentoCultural[c.key]}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ${assessment.alinhamentoCultural.evidencias ? `<p class="obs-text"><strong>Evidencias:</strong> ${assessment.alinhamentoCultural.evidencias}</p>` : ''}
      </div>

      <div class="card">
        <h3 class="card-title">Sumario</h3>
        <div class="sumario-content">
          <div class="sumario-item">
            <h4>Forcas</h4>
            <p>${assessment.sumario?.forcas || 'Nao informado'}</p>
          </div>
          <div class="sumario-item">
            <h4>Pontos de Atencao</h4>
            <p>${assessment.sumario?.pontosAtencao || 'Nao informado'}</p>
          </div>
          ${assessment.textoPerfilManual ? `
            <div class="sumario-item">
              <h4>Observacoes do Perfil</h4>
              <p>${assessment.textoPerfilManual}</p>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  },

  renderPresentation() {
    const data = DataManager.getData();
    const assessments = data.assessments || [];
    const config = data.assessmentConfig;
    
    // Acesso seguro ao App
    const app = window.App || {};
    const isAdmin = typeof app.isAdmin === "function" ? app.isAdmin() : false;

    const grouped = {
      red_flag: assessments.filter(a => a.classificacao === 'red_flag'),
      pontos_desenvolver: assessments.filter(a => a.classificacao === 'pontos_desenvolver'),
      com_potencial: assessments.filter(a => a.classificacao === 'com_potencial')
    };

    return `
      <div class="page-header">
        <a href="#assessment" class="back-link">← Voltar para lista</a>
        <h1 class="page-title">Apresentacao de Resultados</h1>
        <p class="page-subtitle">Visao consolidada do Assessment de Liderancas e Equipe</p>
      </div>

      <div class="presentation-grid">
        <div class="presentation-column red-flag">
          <div class="column-header">
            <h3>Red Flags</h3>
            <span class="column-count">${grouped.red_flag.length}</span>
          </div>
          <div class="column-content">
            ${grouped.red_flag.map(a => this.renderPresentationCard(a, data)).join('')}
            ${grouped.red_flag.length === 0 ? '<p class="empty-message">Nenhum colaborador</p>' : ''}
          </div>
        </div>

        <div class="presentation-column pontos-desenvolver">
          <div class="column-header">
            <h3>Pontos a Desenvolver</h3>
            <span class="column-count">${grouped.pontos_desenvolver.length}</span>
          </div>
          <div class="column-content">
            ${grouped.pontos_desenvolver.map(a => this.renderPresentationCard(a, data)).join('')}
            ${grouped.pontos_desenvolver.length === 0 ? '<p class="empty-message">Nenhum colaborador</p>' : ''}
          </div>
        </div>

        <div class="presentation-column com-potencial">
          <div class="column-header">
            <h3>Com Potencial</h3>
            <span class="column-count">${grouped.com_potencial.length}</span>
          </div>
          <div class="column-content">
            ${grouped.com_potencial.map(a => this.renderPresentationCard(a, data)).join('')}
            ${grouped.com_potencial.length === 0 ? '<p class="empty-message">Nenhum colaborador</p>' : ''}
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Consideracoes Gerais</h3>
          ${isAdmin ? `<button class="btn btn-secondary btn-sm" onclick="AssessmentComponent.toggleEditConsideracoes()">Editar</button>` : ''}
        </div>
        <div id="consideracoes-view">
          <p>${config.consideracoesGerais}</p>
        </div>
        <div id="consideracoes-edit" style="display: none;">
          <textarea id="consideracoes-text" rows="5" style="width: 100%;">${config.consideracoesGerais}</textarea>
          <div style="margin-top: 12px;">
            <button class="btn btn-primary btn-sm" onclick="AssessmentComponent.saveConsideracoes()">Salvar</button>
            <button class="btn btn-secondary btn-sm" onclick="AssessmentComponent.toggleEditConsideracoes()">Cancelar</button>
          </div>
        </div>
      </div>
    `;
  },

  renderPresentationCard(assessment, data) {
    const emp = data.employees.find(e => e.id === assessment.employeeId);
    const medias = this.calcularMedias(assessment);

    return `
      <div class="presentation-card" onclick="App.navigate('assessment/view/${assessment.id}')">
        <div class="pcard-header">
          <strong>${emp ? emp.name : 'N/A'}</strong>
          <div class="pcard-flags">
            ${assessment.flagT ? '<span class="flag-badge flag-t">T</span>' : ''}
            ${assessment.flagI ? '<span class="flag-badge flag-i">I</span>' : ''}
          </div>
        </div>
        <div class="pcard-role">${emp ? emp.role : ''}</div>
        <div class="pcard-scores">
          <span title="Entregas">E: ${medias.entregas.toFixed(1)}</span>
          <span title="Comportamentos">C: ${medias.comportamentos.toFixed(1)}</span>
          <span title="Cultura">Cu: ${medias.cultura.toFixed(1)}</span>
        </div>
        <div class="pcard-summary">
          <div class="pcard-forcas"><strong>+</strong> ${assessment.sumario?.forcas?.substring(0, 60) || '-'}${assessment.sumario?.forcas?.length > 60 ? '...' : ''}</div>
          <div class="pcard-atencao"><strong>!</strong> ${assessment.sumario?.pontosAtencao?.substring(0, 60) || '-'}${assessment.sumario?.pontosAtencao?.length > 60 ? '...' : ''}</div>
        </div>
      </div>
    `;
  },

  // Helper functions
  getEmptyAssessment() {
    return {
      employeeId: '',
      status: 'draft',
      step: 1,
      entregas: {
        clarezaMetas: 3,
        entregaResultados: 3,
        qualidadeConsistencia: 3,
        responsabilidadeDono: 3,
        observacoes: ''
      },
      comportamentos: {
        colaboracao: 3,
        comunicacao: 3,
        adaptabilidade: 3,
        protagonismo: 3,
        focoResultado: 3,
        observacoes: ''
      },
      alinhamentoCultural: {
        entregaConfianca: 3,
        inovarEstrategia: 3,
        disciplinaSemDesculpas: 3,
        clienteRegua: 3,
        evidencias: ''
      },
      sumario: {
        forcas: '',
        pontosAtencao: ''
      },
      classificacao: 'pontos_desenvolver',
      classificacaoManual: false,
      textoPerfilManual: '',
      flagT: false,
      flagI: false
    };
  },

  calcularMedias(assessment) {
    const entregas = [
      assessment.entregas.clarezaMetas,
      assessment.entregas.entregaResultados,
      assessment.entregas.qualidadeConsistencia,
      assessment.entregas.responsabilidadeDono
    ];
    const comportamentos = [
      assessment.comportamentos.colaboracao,
      assessment.comportamentos.comunicacao,
      assessment.comportamentos.adaptabilidade,
      assessment.comportamentos.protagonismo,
      assessment.comportamentos.focoResultado
    ];
    const cultura = [
      assessment.alinhamentoCultural.entregaConfianca,
      assessment.alinhamentoCultural.inovarEstrategia,
      assessment.alinhamentoCultural.disciplinaSemDesculpas,
      assessment.alinhamentoCultural.clienteRegua
    ];

    const mediaEntregas = entregas.reduce((a, b) => a + b, 0) / entregas.length;
    const mediaComportamentos = comportamentos.reduce((a, b) => a + b, 0) / comportamentos.length;
    const mediaCultura = cultura.reduce((a, b) => a + b, 0) / cultura.length;
    const mediaGeral = (mediaEntregas + mediaComportamentos + mediaCultura) / 3;

    return {
      entregas: mediaEntregas,
      comportamentos: mediaComportamentos,
      cultura: mediaCultura,
      geral: mediaGeral
    };
  },

  calcularClassificacao(medias) {
    if (medias.entregas < 2 || medias.comportamentos < 2 || medias.cultura < 2) {
      return 'red_flag';
    } else if (medias.entregas < 3.5 || medias.comportamentos < 3.5 || medias.cultura < 3.5) {
      return 'pontos_desenvolver';
    }
    return 'com_potencial';
  },

  getScoreClass(score) {
    if (score >= 4) return 'high';
    if (score >= 3) return 'medium';
    return 'low';
  },

  getClassificacaoLabel(classificacao) {
    const labels = {
      'red_flag': 'Red Flag',
      'pontos_desenvolver': 'Pontos a Desenvolver',
      'com_potencial': 'Com Potencial'
    };
    return labels[classificacao] || classificacao;
  },

  // Actions
  goToStep(step) {
    this.wizardStep = step;
    App.render();
  },

  nextStep() {
    if (this.wizardStep === 1) {
      const empSelect = document.getElementById('employee-select');
      if (!empSelect.value) {
        alert('Selecione um colaborador');
        return;
      }
    }
    this.collectFormData();
    this.wizardStep++;
    App.render();
  },

  prevStep() {
    this.collectFormData();
    this.wizardStep--;
    App.render();
  },

  collectFormData() {
    const form = document.getElementById('assessment-form');
    if (!form) return;

    // Always use currentAssessment - it's already properly initialized in render()
    let assessment = this.currentAssessment;
    if (!assessment) {
      assessment = this.getEmptyAssessment();
      this.currentAssessment = assessment;
    }

    // Step 1
    const empSelect = document.getElementById('employee-select');
    if (empSelect) {
      assessment.employeeId = empSelect.value;
    }

    // Step 2 - ratings
    document.querySelectorAll('.rating-select').forEach(select => {
      const field = select.dataset.field;
      if (field) {
        const [section, key] = field.split('.');
        if (assessment[section]) {
          assessment[section][key] = parseInt(select.value);
        }
      }
    });

    // Step 2 - observacoes
    const entregasObs = document.getElementById('entregas-obs');
    if (entregasObs) assessment.entregas.observacoes = entregasObs.value;

    const comportamentosObs = document.getElementById('comportamentos-obs');
    if (comportamentosObs) assessment.comportamentos.observacoes = comportamentosObs.value;

    const culturaEvidencias = document.getElementById('cultura-evidencias');
    if (culturaEvidencias) assessment.alinhamentoCultural.evidencias = culturaEvidencias.value;

    // Step 3
    const classificacaoRadio = document.querySelector('input[name="classificacao"]:checked');
    if (classificacaoRadio) {
      assessment.classificacao = classificacaoRadio.value;
      assessment.classificacaoManual = true;
    }

    const flagT = document.getElementById('flag-t');
    if (flagT) assessment.flagT = flagT.checked;

    const flagI = document.getElementById('flag-i');
    if (flagI) assessment.flagI = flagI.checked;

    const textoPerfil = document.getElementById('texto-perfil');
    if (textoPerfil) assessment.textoPerfilManual = textoPerfil.value;

    // Step 4
    const sumarioForcas = document.getElementById('sumario-forcas');
    if (sumarioForcas) assessment.sumario.forcas = sumarioForcas.value;

    const sumarioAtencao = document.getElementById('sumario-atencao');
    if (sumarioAtencao) assessment.sumario.pontosAtencao = sumarioAtencao.value;

    this.currentAssessment = assessment;
  },

  saveAssessment() {
    this.collectFormData();
    const assessment = this.currentAssessment;

    if (!assessment.employeeId) {
      alert('Selecione um colaborador');
      return;
    }

    assessment.status = 'completed';
    assessment.step = 4;

    if (assessment.id) {
      DataManager.updateAssessment(assessment.id, assessment);
    } else {
      DataManager.addAssessment(assessment);
    }

    // Reset wizard state
    this.resetWizardState();
    App.navigate('assessment');
  },

  deleteAssessment(id) {
    if (confirm('Tem certeza que deseja excluir este assessment?')) {
      DataManager.deleteAssessment(id);
      App.render();
    }
  },

  toggleEditConsideracoes() {
    const viewEl = document.getElementById('consideracoes-view');
    const editEl = document.getElementById('consideracoes-edit');
    if (viewEl.style.display === 'none') {
      viewEl.style.display = 'block';
      editEl.style.display = 'none';
    } else {
      viewEl.style.display = 'none';
      editEl.style.display = 'block';
    }
  },

  saveConsideracoes() {
    const text = document.getElementById('consideracoes-text').value;
    DataManager.updateAssessmentConfig({ consideracoesGerais: text });
    App.render();
  },

  afterRender() {
    // Add event listeners for classification cards
    document.querySelectorAll('.classification-card input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', () => {
        document.querySelectorAll('.classification-card').forEach(card => card.classList.remove('selected'));
        radio.closest('.classification-card').classList.add('selected');
      });
    });
  }
};

// Expor componente globalmente para os onclick
window.AssessmentComponent = AssessmentComponent;
