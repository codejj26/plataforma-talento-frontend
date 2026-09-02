import { APP_INITIALIZER, Provider } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Registra este provider en app.config.ts. Angular no termina de arrancar
 * hasta que Keycloak resuelva si hay una sesión activa (check-sso).
 */
export function provideKeycloakInit(): Provider {
  return {
    provide: APP_INITIALIZER,
    multi: true,
    deps: [AuthService],
    useFactory: (auth: AuthService) => () => auth.init(),
  };
}
