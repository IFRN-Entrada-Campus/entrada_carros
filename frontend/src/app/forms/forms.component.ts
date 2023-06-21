import { Component, OnInit} from '@angular/core';
import { Dados } from '../dados';
import { Router } from '@angular/router';
import { DadosService } from '../dados.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})

export class FormsComponent implements OnInit{
  dado: Dados = {modeloCarro: '', marcaCarro: '', anoCarro: '', aluno: '', matriculaAluno: '', codigoEtiqueta: '', CNHvalida: ''};
  matriculas: any[] = [];

  constructor(private dadosService: DadosService, private router: Router) {

  }

  ngOnInit(): void {
    this.dadosService.getMatriculas().subscribe({
      next: (resultado: any) => (this.matriculas = resultado),
      error: (erro: any) => console.log(erro)
    });
    this.dado = {modeloCarro: '', marcaCarro: '', anoCarro: '', aluno: '', matriculaAluno: '', codigoEtiqueta: '', CNHvalida: ''};
  }

  addDados(): void{
    this.dadosService.addDados(this.dado).subscribe({
        error: (erro: any) => console.log(erro)
      });
      this.router.navigate(['/lista']);
    }

    editarDados(): void {
      this.dadosService.editarDados(this.dado).subscribe({
        error: (erro: any) => console.log(erro)
      });
      this.router.navigate(['/lista']);
    }
}

