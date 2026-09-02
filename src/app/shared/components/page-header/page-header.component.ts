import { Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.css',
})
export class PageHeaderComponent {
  readonly titulo = input.required<string>();
  readonly descripcion = input('');
  readonly icono = input('');
}
