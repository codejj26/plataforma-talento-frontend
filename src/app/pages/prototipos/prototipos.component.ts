import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiService, PrototipoDto } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { CampoComponent } from '../../shared/components/campo/campo.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-prototipos',
  standalone: true,
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
  templateUrl: './prototipos.component.html',
  styleUrl: './prototipos.component.css',
})
export class PrototiposComponent implements OnInit {
  private readonly api = inject(ApiService);
  protected readonly auth = inject(AuthService);

  readonly prototipos = signal<PrototipoDto[]>([]);
  readonly error = signal('');
  readonly publicando = signal(false);

  titulo = '';
  descripcion = '';
  url = '';

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.api.listarVitrina().subscribe({
      next: (p) => this.prototipos.set(p),
      error: (e) => this.error.set(e.error?.error ?? 'Error al cargar la vitrina'),
    });
  }

  publicar(): void {
    this.publicando.set(true);
    this.api
      .publicarPrototipo({ titulo: this.titulo, descripcion: this.descripcion, url: this.url || undefined })
      .subscribe({
        next: () => {
          this.titulo = '';
          this.descripcion = '';
          this.url = '';
          this.error.set('');
          this.publicando.set(false);
          this.cargar();
        },
        error: (e) => {
          this.error.set(e.error?.error ?? 'Error al publicar');
          this.publicando.set(false);
        },
      });
  }

  registrarInteres(prototipoId: number): void {
    this.api.registrarInteresPrototipo(prototipoId).subscribe({
      next: () => this.error.set(''),
      error: (e) => this.error.set(e.error?.error ?? 'Error al registrar interés'),
    });
  }
}
