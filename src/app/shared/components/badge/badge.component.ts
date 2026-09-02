import { Component, input } from '@angular/core';

export type BadgeColor = 'verde' | 'ambar' | 'roja' | 'azul' | 'gris';

const CLASES: Record<BadgeColor, string> = {
  verde: 'etiqueta-verde',
  ambar: 'etiqueta-ambar',
  roja: 'etiqueta-roja',
  azul: 'etiqueta-azul',
  gris: 'etiqueta-gris',
};

@Component({
  selector: 'app-badge',
  standalone: true,
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.css',
})
export class BadgeComponent {
  readonly color = input<BadgeColor>('gris');

  protected clase(): string {
    return CLASES[this.color()];
  }
}
