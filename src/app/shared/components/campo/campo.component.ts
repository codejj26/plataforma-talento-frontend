import { Component, input } from '@angular/core';

@Component({
  selector: 'app-campo',
  standalone: true,
  templateUrl: './campo.component.html',
  styleUrl: './campo.component.css',
})
export class CampoComponent {
  readonly etiqueta = input<string>('');
  readonly ayuda = input<string>('');
  readonly requerido = input(false);
}
