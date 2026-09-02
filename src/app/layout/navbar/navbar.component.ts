import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

interface EnlaceNav {
  ruta: string;
  etiqueta: string;
  icono: string;
  roles?: Array<'estudiante' | 'empresa' | 'administrador'>;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent, ButtonComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  protected readonly auth = inject(AuthService);
  protected readonly menuAbierto = signal(false);

  protected readonly enlaces: EnlaceNav[] = [
    { ruta: '/inicio', etiqueta: 'Inicio', icono: 'inicio' },
    { ruta: '/perfil', etiqueta: 'Mi perfil', icono: 'usuario', roles: ['estudiante'] },
    { ruta: '/portafolio', etiqueta: 'Portafolio', icono: 'portafolio', roles: ['estudiante'] },
    { ruta: '/prototipos', etiqueta: 'Prototipos', icono: 'prototipo', roles: ['estudiante'] },
    { ruta: '/ofertas', etiqueta: 'Ofertas', icono: 'ofertas', roles: ['estudiante', 'empresa'] },
    { ruta: '/postulaciones', etiqueta: 'Postulaciones', icono: 'postulaciones', roles: ['estudiante'] },
    { ruta: '/reportes', etiqueta: 'Reportes', icono: 'reportes', roles: ['administrador'] },
  ];

  protected enlacesVisibles(): EnlaceNav[] {
    return this.enlaces.filter((e) => !e.roles || e.roles.some((r) => this.auth.hasRole(r)));
  }

  protected alternarMenu(): void {
    this.menuAbierto.update((v) => !v);
  }
}
