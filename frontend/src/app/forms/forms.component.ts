import { Component, OnInit } from '@angular/core';
import { Dados } from '../dados';
import { Router } from '@angular/router';
import { DadosService } from '../dados.service';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})

export class FormsComponent implements OnInit {
  dado: Dados = { modeloCarro: '', marcaCarro: '', anoCarro: '', aluno: '', matriculaAluno: '', codigoEtiqueta: '', CNHvalida: '', placaCarro: '' };
  matriculas: any[] = [];
  formInvalid = false;

  constructor(private dadosService: DadosService, private router: Router) {

  }

  ngOnInit(): void {
    this.dadosService.getMatriculas().subscribe({
      next: (resultado: any) => (this.matriculas = resultado),
      error: (erro: any) => console.log(erro)
    });
    this.dado = { modeloCarro: '', marcaCarro: '', anoCarro: '', aluno: '', matriculaAluno: '', codigoEtiqueta: '', CNHvalida: '', placaCarro: '' };
    this.formInvalid = false;
  }

  addDados(): void {
    if (
      this.dado.marcaCarro != '' &&
      this.dado.modeloCarro != '' &&
      this.dado.placaCarro != '' &&
      this.dado.anoCarro != null && 0 &&
      this.dado.aluno != '' &&
      this.dado.matriculaAluno != null && 0
    ) {
      this.dadosService.addDados(this.dado).subscribe({
        error: (erro: any) => console.log(erro)
      });
      this.router.navigate(['/lista']);
    } else {
      this.formInvalid = true;
    }
  }
}

