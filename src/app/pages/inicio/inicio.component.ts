import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService, RolActual } from '../../core/services/auth.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

interface Beneficio {
  icono: string;
  titulo: string;
  descripcion: string;
}

interface AccesoRapido {
  ruta: string;
  etiqueta: string;
  icono: string;
  descripcion: string;
}

const ACCESOS_POR_ROL: Record<Exclude<RolActual, 'invitado'>, AccesoRapido[]> = {
  estudiante: [
    { ruta: '/perfil', etiqueta: 'Mi perfil', icono: 'usuario', descripcion: 'Completa tu información profesional' },
    { ruta: '/portafolio', etiqueta: 'Portafolio', icono: 'portafolio', descripcion: 'Publica tus proyectos' },
    { ruta: '/prototipos', etiqueta: 'Prototipos', icono: 'prototipo', descripcion: 'Comparte tus prototipos' },
    { ruta: '/ofertas', etiqueta: 'Ofertas', icono: 'ofertas', descripcion: 'Encuentra prácticas profesionales' },
    { ruta: '/postulaciones', etiqueta: 'Postulaciones', icono: 'postulaciones', descripcion: 'Sigue el estado de tus postulaciones' },
  ],
  empresa: [
    { ruta: '/ofertas', etiqueta: 'Publicar oferta', icono: 'ofertas', descripcion: 'Crea una nueva oferta de práctica' },
    { ruta: '/prototipos', etiqueta: 'Vitrina de prototipos', icono: 'prototipo', descripcion: 'Descubre el talento estudiantil' },
  ],
  administrador: [
    { ruta: '/reportes', etiqueta: 'Reportes', icono: 'reportes', descripcion: 'Métricas generales de la plataforma' },
  ],
};

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, IconComponent, ButtonComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
})
export class InicioComponent {
  readonly auth = inject(AuthService);

  protected readonly beneficios: Beneficio[] = [
    {
      icono: 'portafolio',
      titulo: 'Portafolio estudiantil',
      descripcion: 'Publica tus proyectos y evidencia tus habilidades ante las empresas.',
    },
    {
      icono: 'ofertas',
      titulo: 'Ofertas de práctica',
      descripcion: 'Encuentra oportunidades reales de práctica profesional alineadas a tu perfil.',
    },
    {
      icono: 'postulaciones',
      titulo: 'Seguimiento de postulaciones',
      descripcion: 'Gestiona tus postulaciones y conoce el estado de cada una en tiempo real.',
    },
  ];

  protected rolActual(): RolActual {
    return this.auth.rolActual();
  }

  protected accesosRapidos(): AccesoRapido[] {
    const rol = this.auth.rolActual();
    return rol === 'invitado' ? [] : ACCESOS_POR_ROL[rol];
  }
}
