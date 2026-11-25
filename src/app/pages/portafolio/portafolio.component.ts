import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiService, PortafolioDto } from '../../core/services/api.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { CampoComponent } from '../../shared/components/campo/campo.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-portafolio',
  standalone: true,
  host: { class: 'contenedor py-8 sm:py-10' },
  imports: [
    FormsModule,
    DatePipe,
    PageHeaderComponent,
    CardComponent,
    CampoComponent,
    InputComponent,
    ButtonComponent,
    AlertComponent,
    EmptyStateComponent,
    IconComponent,
  ],
  templateUrl: './portafolio.component.html',
  styleUrl: './portafolio.component.css',
})
export class PortafolioComponent implements OnInit {
  private readonly api = inject(ApiService);

  readonly portafolio = signal<PortafolioDto | null>(null);
  readonly error = signal('');
  readonly publicando = signal(false);

  titulo = '';
  descripcion = '';
  evidenciaUrl = '';

  ngOnInit(): void {
    // El usuario autenticado carga su propio portafolio; obtenemos su id del perfil.
    this.api.obtenerPerfil().subscribe({
      next: (perfil) => this.cargarPortafolio(perfil.id),
      error: (e) => this.error.set(e.error?.error ?? 'Error al cargar el portafolio'),
    });
  }

  private cargarPortafolio(usuarioId: number): void {
    this.api.obtenerPortafolio(usuarioId).subscribe({
      next: (p) => this.portafolio.set(p),
      error: (e) => this.error.set(e.error?.error ?? 'Error al cargar el portafolio'),
    });
  }

  publicar(): void {
    this.publicando.set(true);
    this.api
      .publicarProyecto({
        titulo: this.titulo,
        descripcion: this.descripcion,
        evidenciaUrl: this.evidenciaUrl || undefined,
      })
      .subscribe({
        next: () => {
          this.titulo = '';
          this.descripcion = '';
          this.evidenciaUrl = '';
          this.publicando.set(false);
          this.api.obtenerPerfil().subscribe((p) => this.cargarPortafolio(p.id));
        },
        error: (e) => {
          this.error.set(e.error?.error ?? 'Error al publicar');
          this.publicando.set(false);
        },
      });
  }
}
