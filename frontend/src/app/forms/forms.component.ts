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
  dado: Dados = { modeloCarro: '', marcaCarro: '', anoCarro: '', aluno: '', matriculaAluno: '', codigoEtiqueta: '', validadeEtiqueta: new Date(), CNHvalida: '', placaCarro: '' };
  matriculas: any[] = [];
  formInvalid = false;

  constructor(private dadosService: DadosService, private router: Router) {

  }

  ngOnInit(): void {
    this.dadosService.getMatriculas().subscribe({
      next: (resultado: any) => (this.matriculas = resultado),
      error: (erro: any) => console.log(erro)
    });
    this.dado = { modeloCarro: '', marcaCarro: '', anoCarro: '', aluno: '', matriculaAluno: '', codigoEtiqueta: '', validadeEtiqueta: new Date(), CNHvalida: '', placaCarro: '' };
    this.formInvalid = false;
  }


  validatePlacaCarro(placa: string): boolean {
    const placaRegex = /^[A-Z]{3}\d[A-Z]\d{2}$/;
    return placaRegex.test(placa);
  }

  validateAnoCarro(ano: number): boolean {
    const anoAtual = new Date().getFullYear();
    return ano >= 1900 && ano <= anoAtual;
  }
  
  addDados(): void {
    if (
      this.dado.marcaCarro != '' &&
      this.dado.modeloCarro != '' &&
      this.validatePlacaCarro(this.dado.placaCarro) &&
      this.validateAnoCarro(this.dado.anoCarro) &&
      this.dado.aluno != '' &&
      this.dado.matriculaAluno != 0 &&
      this.dado.codigoEtiqueta != ''
    ) {
      this.dadosService.addDados(this.dado).subscribe({
        error: (erro: any) => console.log(erro)
      });
      this.router.navigate(['/lista']);
    } else {
      this.formInvalid = true;
      console.log(this.dado);
    }
  }
}

