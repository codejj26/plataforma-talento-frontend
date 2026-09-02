import { Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

export type AlertTipo = 'info' | 'exito' | 'error' | 'aviso';

const CONFIG: Record<AlertTipo, { icono: string; clases: string }> = {
  info: { icono: 'info', clases: 'bg-brand-50 text-brand-800 ring-brand-200' },
  exito: { icono: 'check', clases: 'bg-emerald-50 text-emerald-800 ring-emerald-200' },
  error: { icono: 'alerta', clases: 'bg-red-50 text-red-800 ring-red-200' },
  aviso: { icono: 'alerta', clases: 'bg-amber-50 text-amber-800 ring-amber-200' },
};

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
export class AlertComponent {
  readonly tipo = input<AlertTipo>('info');

  protected config(): { icono: string; clases: string } {
    return CONFIG[this.tipo()];
  }
}
