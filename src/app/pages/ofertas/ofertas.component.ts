import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ApiService, OfertaDto } from '../../core/services/api.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { CampoComponent } from '../../shared/components/campo/campo.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-ofertas',
  standalone: true,
  imports: [
    FormsModule,
    CurrencyPipe,
    DatePipe,
    PageHeaderComponent,
    CardComponent,
    CampoComponent,
    InputComponent,
    ButtonComponent,
    AlertComponent,
    BadgeComponent,
    EmptyStateComponent,
    IconComponent,
  ],
  templateUrl: './ofertas.component.html',
  styleUrl: './ofertas.component.css',
})
export class OfertasComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly auth = inject(AuthService);

  readonly ofertas = signal<OfertaDto[]>([]);
  readonly error = signal('');
  readonly publicando = signal(false);
  readonly postulandoId = signal<number | null>(null);

  titulo = '';
  tecnologias = '';
  aprendizajes = '';
  salarioMin?: number;
  salarioMax?: number;
  filtro = '';

  ngOnInit(): void {
    if (this.auth.hasRole('estudiante')) this.cargar();
  }

  cargar(): void {
    this.api.listarOfertas(this.filtro || undefined).subscribe({
      next: (o) => this.ofertas.set(o),
      error: (e) => this.error.set(e.error?.error ?? 'Error al cargar ofertas'),
    });
  }

  publicar(): void {
    this.publicando.set(true);
    this.api
      .publicarOferta({
        titulo: this.titulo,
        tecnologiasRequeridas: this.tecnologias,
        aprendizajesEsperados: this.aprendizajes,
        salarioMin: this.salarioMin,
        salarioMax: this.salarioMax,
      })
      .subscribe({
        next: () => {
          this.titulo = '';
          this.tecnologias = '';
          this.aprendizajes = '';
          this.salarioMin = undefined;
          this.salarioMax = undefined;
          this.error.set('');
          this.publicando.set(false);
        },
        error: (e) => {
          this.error.set(e.error?.error ?? 'Error al publicar oferta');
          this.publicando.set(false);
        },
      });
  }

  postular(ofertaId: number): void {
    this.postulandoId.set(ofertaId);
    this.api.postularse(ofertaId).subscribe({
      next: () => {
        this.postulandoId.set(null);
        this.error.set('');
      },
      error: (e) => {
        this.postulandoId.set(null);
        this.error.set(e.error?.error ?? 'Error al postularse');
      },
    });
  }

  estadoBadge(estado: OfertaDto['estado']): 'verde' | 'ambar' {
    return estado === 'Activa' ? 'verde' : 'ambar';
  }
}
