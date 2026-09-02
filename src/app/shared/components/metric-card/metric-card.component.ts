import { Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './metric-card.component.html',
  styleUrl: './metric-card.component.css',
})
export class MetricCardComponent {
  readonly etiqueta = input.required<string>();
  readonly valor = input.required<number>();
  readonly icono = input('reportes');
}
