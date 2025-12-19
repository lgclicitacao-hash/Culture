// components/login.js - Tela de Login (CNP Style)

const LoginComponent = {
  render() {
    const data = DataManager.getData();
    return `
      <div class="login-page">
        <div class="login-hero">
          <div class="login-hero-content">
            <div class="login-hero-logo">
              <img src="${data.tenant.logoPath}" alt="CNP" onerror="this.outerHTML='<span style=\\'color:#4BA3E3;font-size:28px;font-weight:700;\\'>CNP</span>';">
            </div>
            <h1>
              Nosso proposito e alavancar os seus resultados alinhando
              <span>CULTURA, PESSOAS & COMPORTAMENTOS.</span>
            </h1>
            <p>
              Portal de acompanhamento do projeto de cultura organizacional.
              Acesse seus documentos, acompanhe a jornada e visualize os indicadores da sua empresa.
            </p>
          </div>
        </div>

        <div class="login-form-side">
          <div class="login-box">
            <div class="login-welcome">
              <h2>Bem-vindo</h2>
              <p>Acesse o portal de cultura organizacional</p>
            </div>

            <div id="login-error" class="login-error">
              Email ou senha incorretos. Tente novamente.
            </div>

            <form id="login-form" class="login-form">
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" placeholder="seu@email.com" required>
              </div>
              <div class="form-group">
                <label for="password">Senha</label>
                <input type="password" id="password" placeholder="Digite sua senha" required>
              </div>
              <button type="submit" class="login-btn">Entrar</button>
            </form>

            <div class="login-demo">
              <div class="login-demo-title">Credenciais de demonstracao</div>
              <div class="login-demo-item">
                <span class="login-demo-label">Cliente:</span>
                <span class="login-demo-value">cliente@empresa.com / 123456</span>
              </div>
              <div class="login-demo-item">
                <span class="login-demo-label">Admin:</span>
                <span class="login-demo-value">admin@cnp.com / 123456</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  afterRender() {
    const form = document.getElementById("login-form");
    const errorDiv = document.getElementById("login-error");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      if (App.login(email, password)) {
        errorDiv.style.display = "none";
      } else {
        errorDiv.style.display = "block";
      }
    });
  }
};
