import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SolicitarRecuperacaoService } from '../solicitar-recuperacao.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-solicitar-recuperacao',
  templateUrl: './solicitar-recuperacao.component.html',
  standalone: true,
  styleUrls: ['./solicitar-recuperacao.component.css'],
  imports: [FormsModule, InputTextModule, ButtonModule, RippleModule]
})

export class SolicitarRecuperacaoComponent {
  email: string = '';  // A variável que vai armazenar o e-mail do usuário
  mensagemSucesso: string | null = null;  // A mensagem de sucesso ao enviar o e-mail
  mensagemErro: string | null = null; // A mensagem de erro ao enviar o e-mail

  constructor(private solicitarRecuperacaoService: SolicitarRecuperacaoService, private router: Router, private http: HttpClient) { }

  solicitarRecuperacao() {
    // Envia o e-mail para o back-end para gerar o código
    this.http.post('/api/login/solicitar-recuperacao', { email: this.email }).subscribe(
      (response: any) => {
        // Sucesso ao enviar o e-mail
        this.mensagemSucesso = response.message;
        this.mensagemErro = null;
        // Redireciona para a página de redefinir senha
        setTimeout(() => this.router.navigate(['/redefinir-senha']), 3000);
      },
      (error) => {
        // Erro ao enviar o e-mail
        this.mensagemErro = error.error.message;
        this.mensagemSucesso = null;
      }
    );
  }
}
