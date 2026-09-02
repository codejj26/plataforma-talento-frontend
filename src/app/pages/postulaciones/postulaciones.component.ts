import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService, PostulacionDto } from '../../core/services/api.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { BadgeComponent, BadgeColor } from '../../shared/components/badge/badge.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

const COLOR_ESTADO: Record<PostulacionDto['estado'], BadgeColor> = {
  Pendiente: 'ambar',
  Aceptada: 'verde',
  Rechazada: 'roja',
};

@Component({
  selector: 'app-postulaciones',
  standalone: true,
  imports: [
    DatePipe,
    PageHeaderComponent,
    BadgeComponent,
    EmptyStateComponent,
    AlertComponent,
    IconComponent,
  ],
  templateUrl: './postulaciones.component.html',
  styleUrl: './postulaciones.component.css',
})
export class PostulacionesComponent implements OnInit {
  private readonly api = inject(ApiService);

  readonly postulaciones = signal<PostulacionDto[]>([]);
  readonly error = signal('');

  ngOnInit(): void {
    this.api.listarMisPostulaciones().subscribe({
      next: (p) => this.postulaciones.set(p),
      error: (e) => this.error.set(e.error?.error ?? 'Error al cargar postulaciones'),
    });
  }

  colorEstado(estado: PostulacionDto['estado']): BadgeColor {
    return COLOR_ESTADO[estado];
  }
}
