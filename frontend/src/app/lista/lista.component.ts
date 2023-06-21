import { Component, Inject, OnInit } from '@angular/core';
import { concatMap } from 'rxjs';
import { DadosService } from '../dados.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit{
  dadosFormulario: any[] = [];
  dadoSelecionado?: any;

  constructor(private dadosService: DadosService, private router: Router) {

  }
  

  ngOnInit(): void {
    this.onListar();
  }

  onListar(): void {
    this.dadosService.getDados().subscribe({
      next: (resultado: any) => {(this.dadosFormulario = resultado), console.log(resultado)},
      error: (erro: any) => console.log(erro),
      complete: () => console.log('completo')
    });
  }

  deletarDados(matricula: number): void {
    this.dadosService.deletarDados(matricula).subscribe({})
  }

  cadastrar(): void {
    this.router.navigate(['/forms']);
  }
}
