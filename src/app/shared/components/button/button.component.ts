import { Component, input } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';

export type ButtonVariant = 'primario' | 'secundario' | 'peligro' | 'fantasma';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANTES: Record<ButtonVariant, string> = {
  primario:
    'bg-brand-700 text-white hover:bg-brand-800 focus-visible:outline-brand-700 shadow-sm',
  secundario:
    'bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 focus-visible:outline-slate-400',
  peligro:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600 shadow-sm',
  fantasma: 'text-brand-700 hover:bg-brand-50 focus-visible:outline-brand-600',
};

const TAMANOS: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

@Component({
  selector: 'button[appButton], a[appButton]',
  standalone: true,
  imports: [SpinnerComponent],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  readonly variante = input<ButtonVariant>('primario');
  readonly tamano = input<ButtonSize>('md');
  readonly cargando = input(false);

  protected clase(): string {
    const base =
      'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60';
    return `${base} ${VARIANTES[this.variante()]} ${TAMANOS[this.tamano()]}`;
  }
}
