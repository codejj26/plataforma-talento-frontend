import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, PerfilDto } from '../../core/services/api.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { CampoComponent } from '../../shared/components/campo/campo.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    FormsModule,
    PageHeaderComponent,
    CardComponent,
    CampoComponent,
    InputComponent,
    ButtonComponent,
    AlertComponent,
    BadgeComponent,
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent implements OnInit {
  private readonly api = inject(ApiService);

  readonly perfil = signal<PerfilDto | null>(null);
  readonly error = signal('');
  readonly guardando = signal(false);
  readonly guardado = signal(false);

  stack = '';
  conocimientos = '';
  cualidades = '';
  repositorio = '';

  ngOnInit(): void {
    this.api.obtenerPerfil().subscribe({
      next: (p) => {
        this.perfil.set(p);
        this.stack = p.perfilEstudiante?.stackTecnologico ?? '';
        this.conocimientos = p.perfilEstudiante?.conocimientos ?? '';
        this.cualidades = p.perfilEstudiante?.cualidadesBlandas ?? '';
        this.repositorio = p.perfilEstudiante?.repositorioUrl ?? '';
      },
      error: (e) => this.error.set(e.error?.error ?? 'Error al cargar el perfil'),
    });
  }

  guardar(): void {
    this.guardando.set(true);
    this.guardado.set(false);
    this.api
      .completarPerfil({
        rol: 'estudiante',
        stackTecnologico: this.stack,
        conocimientos: this.conocimientos,
        cualidadesBlandas: this.cualidades,
        repositorioUrl: this.repositorio,
      })
      .subscribe({
        next: (p) => {
          this.perfil.set(p);
          this.error.set('');
          this.guardado.set(true);
          this.guardando.set(false);
        },
        error: (e) => {
          this.error.set(e.error?.error ?? 'Error al guardar');
          this.guardando.set(false);
        },
      });
  }
}
