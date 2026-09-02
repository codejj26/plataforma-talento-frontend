import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService, RolPlataforma } from '../services/auth.service';

const DASHBOARD_POR_ROL: Record<RolPlataforma, string> = {
  estudiante: '/perfil',
  empresa: '/ofertas',
  administrador: '/reportes',
};

/**
 * Guard de roles. Uso en las rutas:
 *
 * {
 *   path: 'ofertas',
 *   canActivate: [roleGuard],
 *   data: { roles: ['estudiante', 'empresa'] },
 *   loadComponent: () => import('./ofertas/ofertas.component'),
 * }
 *
 * - Sin sesión → redirige al login de Keycloak.
 * - Con sesión pero sin el rol requerido → redirige al dashboard de su rol
 *   (o a /inicio si no tiene ningún rol de la plataforma).
 */
export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const rolesPermitidos = (route.data['roles'] as RolPlataforma[]) ?? [];

  if (!auth.autenticado()) {
    auth.login();
    return false;
  }

  if (rolesPermitidos.length === 0) return true; // ruta solo exige estar autenticado

  const autorizado = rolesPermitidos.some((r) => auth.hasRole(r));
  if (!autorizado) {
    const rol = auth.rolActual();
    const dashboard = rol === 'invitado' ? '/inicio' : DASHBOARD_POR_ROL[rol];
    router.navigate([dashboard]);
    return false;
  }

  return true;
};
