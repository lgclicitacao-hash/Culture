// supabase-config.js - Configuração centralizada do Supabase

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Configuração do Supabase
const SUPABASE_URL = "https://uushczefewuwnictpkqn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1c2hjemVmZXd1d25pY3Rwa3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MzA0MjgsImV4cCI6MjA1MDIwNjQyOH0.a4UXyq9feisKV_6Tge459w_7Ioa7U97M-qS9kZCxUoE";

// Criar cliente Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Funções auxiliares de autenticação
export const SupabaseAuth = {
  /**
   * Verifica se o usuário está autenticado
   * @returns {Promise<Object|null>} Sessão do usuário ou null
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Erro ao obter sessão:", error);
      return null;
    }
    return data.session;
  },

  /**
   * Busca o perfil completo do usuário autenticado
   * @returns {Promise<Object|null>} Perfil do usuário ou null
   */
  async getProfile() {
    const cachedProfile = localStorage.getItem("session_profile");
    if (cachedProfile) {
      try {
        return JSON.parse(cachedProfile);
      } catch (e) {
        console.error("Erro ao parsear perfil do cache:", e);
      }
    }

    const session = await this.getSession();
    if (!session || !session.user) return null;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role, tenant_id, full_name")
      .eq("user_id", session.user.id)
      .single();

    if (error) {
      console.error("Erro ao buscar perfil:", error);
      return null;
    }

    const fullProfile = {
      ...profile,
      email: session.user.email,
      user_id: session.user.id
    };

    localStorage.setItem("session_profile", JSON.stringify(fullProfile));
    return fullProfile;
  },

  /**
   * Faz logout do usuário
   */
  async signOut() {
    await supabase.auth.signOut();
    localStorage.removeItem("session_profile");
    window.location.href = "/login.html";
  },

  /**
   * Verifica se o usuário tem permissão para acessar um módulo
   * @param {string} moduleKey - Chave do módulo (ex: "admin", "employees")
   * @returns {Promise<boolean>} true se tem permissão, false caso contrário
   */
  async canAccessModule(moduleKey) {
    const profile = await this.getProfile();
    if (!profile) return false;

    const permissions = {
      client: ["dashboard", "timeline", "journey", "deliverables", "meetings", "documents", "tasks", "assessment"],
      staff: ["dashboard", "timeline", "journey", "deliverables", "meetings", "documents", "tasks", "assessment", "employees"],
      admin: ["dashboard", "timeline", "journey", "deliverables", "meetings", "documents", "tasks", "assessment", "employees", "admin", "audit"]
    };

    const allowedModules = permissions[profile.role] || permissions.client;
    return allowedModules.includes(moduleKey);
  },

  /**
   * Redireciona para login se não estiver autenticado
   */
  async requireAuth() {
    const session = await this.getSession();
    if (!session) {
      window.location.href = "/login.html";
      return false;
    }
    return true;
  }
};

// Exportar também o cliente Supabase diretamente
export default supabase;
