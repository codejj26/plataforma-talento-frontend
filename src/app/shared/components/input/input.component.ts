import { Component, input } from '@angular/core';

@Component({
  selector: 'input[appInput], textarea[appInput]',
  standalone: true,
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
})
export class InputComponent {
  readonly clase = input('');
}
