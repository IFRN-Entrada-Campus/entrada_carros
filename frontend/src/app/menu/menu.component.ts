import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  admin = false; // variavel para verificar se o usuário é admin ou não

  constructor(private router: Router, private loginService: LoginService) {}

  ngOnInit(): void {
    this.admin = this.loginService.isUserAdmin(); // verifica se o user é admin ou não
  }

  cadastrar(): void { // navega para o componente forms
    this.router.navigate(['/forms']);
  }

  usuario(): void { // redireciona para o componente usuario/novo
    this.router.navigate(['/usuario/novo'])
  }

  mqtt(): void {  // navega para o componente mqtt
    this.router.navigate(['/mqtt']);
  }

  scanner(): void { // navega para o componente analise
    this.router.navigate(['/analise']);
  }

  lista(): void { // navega para o componente lista
    this.router.navigate(['/lista']);
  }

  logout(): void {
    this.loginService.logout();
    window.location.reload();
  }
}
