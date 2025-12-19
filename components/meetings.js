// components/meetings.js - Reuniões

const MeetingsComponent = {
  filters: {
    month: "all",
    department: "all",
    type: "all"
  },
  showModal: false,

  render() {
    const data = DataManager.getData();
    const meetings = this.getFilteredMeetings(data.meetings);
    const isAdmin = App.isAdmin();

    const departments = [...new Set(data.meetings.map(m => m.department))];
    const types = [...new Set(data.meetings.map(m => m.type))];
    const months = this.getMonthsFromMeetings(data.meetings);

    return `
      <div class="page-header">
        <h1 class="page-title">Reunioes</h1>
        <p class="page-subtitle">Historico de reunioes e encontros do projeto</p>
      </div>

      <div class="meetings-filters">
        <select id="filter-month" onchange="MeetingsComponent.updateFilter('month', this.value)">
          <option value="all">Todos os meses</option>
          ${months.map(m => `
            <option value="${m.value}" ${this.filters.month === m.value ? 'selected' : ''}>${m.label}</option>
          `).join("")}
        </select>

        <select id="filter-department" onchange="MeetingsComponent.updateFilter('department', this.value)">
          <option value="all">Todos os departamentos</option>
          ${departments.map(d => `
            <option value="${d}" ${this.filters.department === d ? 'selected' : ''}>${d}</option>
          `).join("")}
        </select>

        <select id="filter-type" onchange="MeetingsComponent.updateFilter('type', this.value)">
          <option value="all">Todos os tipos</option>
          ${types.map(t => `
            <option value="${t}" ${this.filters.type === t ? 'selected' : ''}>${t}</option>
          `).join("")}
        </select>

        ${isAdmin ? `
          <button class="btn btn-primary" onclick="MeetingsComponent.openModal()">
            + Nova Reuniao
          </button>
        ` : ''}
      </div>

      ${meetings.length === 0 ? `
        <div class="card text-center">
          <p style="color: var(--text-muted);">Nenhuma reuniao encontrada com os filtros selecionados.</p>
        </div>
      ` : ''}

      ${meetings.map(meeting => `
        <div class="meeting-card">
          <div class="meeting-header">
            <h3 class="meeting-title">${meeting.title}</h3>
            <span class="meeting-type">${meeting.type}</span>
          </div>

          <div class="meeting-meta">
            <span>Data: ${App.formatDate(meeting.date)}</span>
            <span>Departamento: ${meeting.department}</span>
          </div>

          <div class="meeting-section">
            <div class="meeting-section-title">Participantes</div>
            <p>${meeting.participants.join(", ")}</p>
          </div>

          <div class="meeting-section">
            <div class="meeting-section-title">Resumo</div>
            <p>${meeting.summary}</p>
          </div>

          ${meeting.decisions.length > 0 ? `
            <div class="meeting-section">
              <div class="meeting-section-title">Decisoes</div>
              <ul>
                ${meeting.decisions.map(d => `<li>${d}</li>`).join("")}
              </ul>
            </div>
          ` : ''}

          ${meeting.nextSteps.length > 0 ? `
            <div class="meeting-section">
              <div class="meeting-section-title">Proximos Passos</div>
              <ul>
                ${meeting.nextSteps.map(n => `<li>${n}</li>`).join("")}
              </ul>
            </div>
          ` : ''}

          ${meeting.attachments.length > 0 ? `
            <div class="meeting-section">
              <div class="meeting-section-title">Anexos</div>
              <div class="meeting-attachments">
                ${meeting.attachments.map(a => `
                  <a href="${a.url}" class="attachment-link" target="_blank">${a.label}</a>
                `).join("")}
              </div>
            </div>
          ` : ''}
        </div>
      `).join("")}

      ${this.showModal ? this.renderModal() : ''}
    `;
  },

  renderModal() {
    const data = DataManager.getData();
    const departments = [...new Set(data.meetings.map(m => m.department))];
    const types = [...new Set(data.meetings.map(m => m.type))];

    return `
      <div class="modal-overlay" onclick="MeetingsComponent.closeModal(event)">
        <div class="modal" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Nova Reuniao</h3>
            <button class="modal-close" onclick="MeetingsComponent.closeModal()">&times;</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Titulo</label>
              <input type="text" id="meeting-title" placeholder="Titulo da reuniao">
            </div>
            <div class="edit-row">
              <div class="form-group">
                <label>Data</label>
                <input type="date" id="meeting-date">
              </div>
              <div class="form-group">
                <label>Tipo</label>
                <select id="meeting-type">
                  ${types.map(t => `<option value="${t}">${t}</option>`).join("")}
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Departamento</label>
              <select id="meeting-department">
                ${departments.map(d => `<option value="${d}">${d}</option>`).join("")}
              </select>
            </div>
            <div class="form-group">
              <label>Participantes (separados por virgula)</label>
              <input type="text" id="meeting-participants" placeholder="Ex: RH, CNP - Nicole">
            </div>
            <div class="form-group">
              <label>Resumo</label>
              <textarea id="meeting-summary" rows="3" placeholder="Resumo da reuniao"></textarea>
            </div>
            <div class="form-group">
              <label>Decisoes (uma por linha)</label>
              <textarea id="meeting-decisions" rows="2" placeholder="Uma decisao por linha"></textarea>
            </div>
            <div class="form-group">
              <label>Proximos Passos (um por linha)</label>
              <textarea id="meeting-nextsteps" rows="2" placeholder="Um passo por linha"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="MeetingsComponent.closeModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="MeetingsComponent.saveMeeting()">Salvar</button>
          </div>
        </div>
      </div>
    `;
  },

  getFilteredMeetings(meetings) {
    return meetings
      .filter(m => {
        if (this.filters.month !== "all") {
          const meetingMonth = m.date.substring(0, 7);
          if (meetingMonth !== this.filters.month) return false;
        }
        if (this.filters.department !== "all" && m.department !== this.filters.department) return false;
        if (this.filters.type !== "all" && m.type !== this.filters.type) return false;
        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  getMonthsFromMeetings(meetings) {
    const monthsSet = new Set();
    meetings.forEach(m => {
      monthsSet.add(m.date.substring(0, 7));
    });
    return Array.from(monthsSet)
      .sort()
      .reverse()
      .map(m => {
        const [year, month] = m.split("-");
        const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        return {
          value: m,
          label: `${monthNames[parseInt(month) - 1]} ${year}`
        };
      });
  },

  updateFilter(filterName, value) {
    this.filters[filterName] = value;
    App.render();
  },

  openModal() {
    this.showModal = true;
    App.render();
  },

  closeModal(event) {
    if (event && event.target !== event.currentTarget) return;
    this.showModal = false;
    App.render();
  },

  saveMeeting() {
    const title = document.getElementById("meeting-title").value;
    const date = document.getElementById("meeting-date").value;
    const type = document.getElementById("meeting-type").value;
    const department = document.getElementById("meeting-department").value;
    const participants = document.getElementById("meeting-participants").value.split(",").map(p => p.trim()).filter(p => p);
    const summary = document.getElementById("meeting-summary").value;
    const decisions = document.getElementById("meeting-decisions").value.split("\n").map(d => d.trim()).filter(d => d);
    const nextSteps = document.getElementById("meeting-nextsteps").value.split("\n").map(n => n.trim()).filter(n => n);

    if (!title || !date) {
      alert("Titulo e data sao obrigatorios");
      return;
    }

    const newMeeting = {
      title,
      date,
      type,
      department,
      participants,
      summary,
      decisions,
      nextSteps,
      attachments: []
    };

    DataManager.addMeeting(newMeeting);
    this.showModal = false;
    App.render();
  },

  afterRender() {
    // Nenhuma interação adicional necessária
  }
};
