import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

/**
 * Adjunta "Authorization: Bearer <token>" a toda petición dirigida a la API .NET.
 * No toca peticiones hacia otros dominios (ej. Cloudinary).
 * Si no hay token válido (sesión expirada), no adjunta el header y deja pasar
 * la petición sin autenticar; la API responderá 401 y la app reaccionará.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  return from(auth.getToken()).pipe(
    switchMap((token) => {
      if (!token) {
        return next(req);
      }
      const authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
      return next(authReq);
    })
  );
};
