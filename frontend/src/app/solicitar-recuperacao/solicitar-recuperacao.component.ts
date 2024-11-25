import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-solicitar-recuperacao',
  templateUrl: './solicitar-recuperacao.component.html',
  standalone: true,
  styleUrls: ['./solicitar-recuperacao.component.css'],
  imports: [FormsModule, InputTextModule, ButtonModule, RippleModule]
})
export class SolicitarRecuperacaoComponent {
  email = '';
  constructor() { }
}
