import { Injectable, signal } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from '../../../environments/environment';

export type RolPlataforma = 'estudiante' | 'empresa' | 'administrador';
export type RolActual = RolPlataforma | 'invitado';

const ROLES_PLATAFORMA: RolPlataforma[] = ['estudiante', 'empresa', 'administrador'];

/**
 * Envuelve la instancia de keycloak-js. Angular nunca ve ni maneja contraseñas:
 * toda la autenticación ocurre en la pantalla de login servida por Keycloak
 * (flujo Authorization Code + PKCE).
 *
 * Los roles se leen tanto de realm_access como de resource_access (client roles),
 * porque en Keycloak los roles de aplicación pueden estar en cualquiera de los dos.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly keycloak = new Keycloak({
    url: environment.keycloak.url,
    realm: environment.keycloak.realm,
    clientId: environment.keycloak.clientId,
  });

  readonly autenticado = signal(false);
  readonly roles = signal<string[]>([]);

  /**
   * Se llama una única vez, antes de iniciar Angular (ver keycloak-init.provider.ts).
   * onLoad: 'login-required' redirige directamente al login de Keycloak si no hay
   * sesión. Es más robusto que 'check-sso' (que depende de un iframe silencioso
   * que los navegadores pueden bloquear) y garantiza que el usuario siempre
   * pueda autenticarse.
   */
  async init(): Promise<boolean> {
    const autenticado = await this.keycloak.init({
      onLoad: 'login-required',
      pkceMethod: 'S256',
      silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
    });

    this.autenticado.set(autenticado);
    this.actualizarRoles();

    // Mantiene las signals sincronizadas con los eventos del adapter.
    this.keycloak.onAuthSuccess = () => {
      this.autenticado.set(true);
      this.actualizarRoles();
    };
    this.keycloak.onAuthLogout = () => {
      this.autenticado.set(false);
      this.roles.set([]);
    };
    this.keycloak.onTokenExpired = () => {
      this.keycloak.updateToken(30).catch(() => {
        this.autenticado.set(false);
        this.roles.set([]);
        this.keycloak.login();
      });
    };

    return autenticado;
  }

  login(): void {
    this.keycloak.login({
      // Usa la URL actual: Keycloak solo acepta redirect URIs registrados en el
      // cliente, así que redirigir siempre a /inicio rompe si el puerto difiere.
      redirectUri: window.location.origin + '/inicio',
      scope: 'openid profile email',
    });
  }

  logout(): void {
    this.keycloak.logout({ redirectUri: window.location.origin });
  }

  /** Verifica si el usuario tiene un rol de la plataforma (realm o client role). */
  hasRole(role: RolPlataforma): boolean {
    return this.roles().includes(role);
  }

  /**
   * Rol efectivo del usuario según prioridad: administrador > empresa > estudiante.
   * 'invitado' = autenticado pero sin rol de la plataforma asignado.
   */
  rolActual(): RolActual {
    if (this.hasRole('administrador')) return 'administrador';
    if (this.hasRole('empresa')) return 'empresa';
    if (this.hasRole('estudiante')) return 'estudiante';
    return 'invitado';
  }

  async getToken(): Promise<string | undefined> {
    try {
      const refrescado = await this.keycloak.updateToken(30);
      if (refrescado) this.actualizarRoles();
      return this.keycloak.token;
    } catch {
      // Sesión expirada o refresh fallido: sin token válido.
      return undefined;
    }
  }

  /**
   * Recalcula la signal de roles unificando realm roles y client roles,
   * normalizados a minúsculas y sin duplicados.
   */
  private actualizarRoles(): void {
    const realm = this.keycloak.tokenParsed?.realm_access?.roles ?? [];
    const client = this.keycloak.tokenParsed?.resource_access?.[environment.keycloak.clientId]?.roles ?? [];
    const unificados = [...new Set([...realm, ...client])]
      .map((r) => r.toLowerCase())
      .filter((r) => ROLES_PLATAFORMA.includes(r as RolPlataforma));
    this.roles.set(unificados);
  }
}
