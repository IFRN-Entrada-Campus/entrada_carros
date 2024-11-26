import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-redefinir-senha',
  templateUrl: './redefinir-senha.component.html',
  styleUrls: ['./redefinir-senha.component.css']
})
export class RedefinirSenhaComponent {
  email: string = '';
  codigoRecuperacao: string = '';
  novaSenha: string = '';
  mensagemSucesso: string | null = null;
  mensagemErro: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  redefinirSenha() {
    if (!this.email || !this.codigoRecuperacao || !this.novaSenha) {
      this.mensagemErro = 'Todos os campos são obrigatórios!';
      return;
    }

    // Envia os dados para o back-end para redefinir a senha
    this.http.post('/api/login/redefinir-senha', {
      email: this.email,
      codigoRecuperacao: this.codigoRecuperacao,
      novaSenha: this.novaSenha
    }).subscribe(
      (response: any) => {
        // Sucesso ao redefinir a senha
        this.mensagemSucesso = response.message;
        this.mensagemErro = null;
        // Redireciona para o login
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      (error) => {
        // Erro ao redefinir a senha
        this.mensagemErro = error.error.message;
        this.mensagemSucesso = null;
      }
    );
  }
}
