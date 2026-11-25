import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, ReporteDto } from '../../core/services/api.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { MetricCardComponent } from '../../shared/components/metric-card/metric-card.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { CampoComponent } from '../../shared/components/campo/campo.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';

interface Metrica {
  etiqueta: string;
  valor: number;
  icono: string;
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  host: { class: 'contenedor py-8 sm:py-10' },
  imports: [
    FormsModule,
    PageHeaderComponent,
    MetricCardComponent,
    CardComponent,
    CampoComponent,
    InputComponent,
    ButtonComponent,
    AlertComponent,
  ],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css',
})
export class ReportesComponent implements OnInit {
  private readonly api = inject(ApiService);

  readonly reporte = signal<ReporteDto | null>(null);
  readonly error = signal('');
  readonly generando = signal(false);
  desde = '';
  hasta = '';

  ngOnInit(): void {
    this.generar('', '');
  }

  generar(desde: string, hasta: string): void {
    this.generando.set(true);
    this.api.generarReporte(desde || undefined, hasta || undefined).subscribe({
      next: (r) => {
        this.reporte.set(r);
        this.generando.set(false);
      },
      error: (e) => {
        this.error.set(e.error?.error ?? 'Error al generar el reporte');
        this.generando.set(false);
      },
    });
  }

  metricas(): Metrica[] {
    const r = this.reporte();
    if (!r) return [];
    return [
      { etiqueta: 'Perfiles verificados', valor: r.totalPerfilesVerificados, icono: 'check' },
      { etiqueta: 'Estudiantes', valor: r.totalEstudiantes, icono: 'graduacion' },
      { etiqueta: 'Empresas', valor: r.totalEmpresas, icono: 'edificio' },
      { etiqueta: 'Ofertas activas', valor: r.totalOfertasActivas, icono: 'ofertas' },
      { etiqueta: 'Postulaciones', valor: r.totalPostulaciones, icono: 'postulaciones' },
      { etiqueta: 'Prototipos publicados', valor: r.totalPrototiposPublicados, icono: 'prototipo' },
    ];
  }
}
