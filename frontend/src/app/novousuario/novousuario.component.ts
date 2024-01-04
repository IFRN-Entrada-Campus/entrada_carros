import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-novousuario',
  templateUrl: './novousuario.component.html',
  styleUrls: ['./novousuario.component.css']
})
export class NovousuarioComponent implements OnInit{
  admin: boolean = false;
  formInvalid = false;  // variavel para mostrar o alerta de erro
  erroSQL = false;  // variavel para mostrar o alerta de erro do banco
  cadastroSucesso = false;  // variavel para mostrar o alerta de sucesso
  login = {
    usuario: '',
    senha: '',
    role: ''
  }
  roles = ['admin', 'user']

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    this.admin = this.loginService.isUserAdmin();
  }

  addUsuario(): void {
    if (
      this.login.usuario != '' &&
      this.login.senha != '' &&
      this.login.role != ''
    ) {
      this.loginService.novoUsuario(this.login).subscribe({
        next: () => {
          this.formInvalid = false;
          this.cadastroSucesso = true;
          setTimeout(() => {
            this.router.navigate(['/lista'])
          }, 1000);
        },
        error: (err: any) => {
          console.log(err);
          this.erroSQL = true;
        }
      });
    } else {
      this.formInvalid = true;
    }
  }

}
