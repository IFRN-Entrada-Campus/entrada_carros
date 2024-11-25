import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SolicitarRecuperacaoService } from '../solicitar-recuperacao.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-solicitar-recuperacao',
  templateUrl: './solicitar-recuperacao.component.html',
  standalone: true,
  styleUrls: ['./solicitar-recuperacao.component.css'],
  imports: [FormsModule, InputTextModule, ButtonModule, RippleModule]
})

export class SolicitarRecuperacaoComponent {
  email: string = '';  // A variável que vai armazenar o e-mail do usuário
  mensagemErro: string = ''; // variável para armazenar mensagens de erro
  mensagemSucesso: string = ''; //variável para armazenar mensagens de sucesso

  constructor(private solicitarRecuperacaoService: SolicitarRecuperacaoService, private router: Router) { }

  solicitarRecuperacao() {
    this.solicitarRecuperacaoService.solicitarCodigoRecuperacao(this.email).subscribe(
      (response) => {
        this.mensagemSucesso = response.message;
        this.mensagemErro = '';  // Limpa mensagens de erro
      },
      (error) => {
        this.mensagemErro = error.error.message || 'Erro ao enviar o código de recuperação';
        this.mensagemSucesso = '';  // Limpa mensagens de sucesso
      }
    );
  }
}
