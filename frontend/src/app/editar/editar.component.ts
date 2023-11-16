import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DadosService } from '../dados.service';
import { Dados } from '../dados';
import { SharedDataService } from '../shared-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {

  dado: Dados = { modeloCarro: '', marcaCarro: '', anoCarro: '', aluno: '', matriculaAluno: '', codigoEtiqueta: '', validadeEtiqueta: new Date(), CNHvalida: '', placaCarro: '' };
  formInvalid = false;  // variavel para mostrar o alerta de erro
  placa = ''; // variavel para armazenar a placa do carro

  constructor(
    private activaRoute: ActivatedRoute,
    private dadosServico: DadosService,
    private router: Router,
    private sharedDataService: SharedDataService
  ) { }

  ngOnInit(): void {
    this.formInvalid = false;
    this.activaRoute.paramMap.subscribe({ // Preenche os campos com os dados do carro
      next: (rota: any) => {
        this.dado.placaCarro = rota.params.placa;
        this.placa = rota.params.placa;
        this.dadosServico.getDadosporPlaca(this.dado.placaCarro).subscribe({
          next: (retorno: any) => {
            this.dado.modeloCarro = retorno[0].Modelo;
            this.dado.marcaCarro = retorno[0].Marca;
            this.dado.matriculaAluno = retorno[0].Matricula;
            this.dado.anoCarro = retorno[0].Ano;
            this.dado.aluno = retorno[0].Aluno;
            this.dado.codigoEtiqueta = retorno[0].codigoEtiqueta;
            if (retorno[0].codigoEtiqueta == 0 || '') {
              this.sharedDataService.codigoEtiqueta$.subscribe(
                (codigo: string) => { 
                if (codigo) {
                  this.dado.codigoEtiqueta = codigo;
                } 
              });
              this.sharedDataService.setCodigoEtiqueta('');
            }
            this.dado.validadeEtiqueta = new Date(retorno[0].validadeEtiqueta);
            this.dado.CNHvalida = retorno[0].CNHvalida;
            if (this.dado.CNHvalida = 1) {
              this.dado.CNHvalida = true
            } else {
              this.dado.CNHvalida = false
            }
            
          },

          error: (erro: any) => console.log(erro)
        });
      },
    });
    }

  validatePlacaCarro(placa: string): boolean {  // valida a placa do carro
    const placaRegex = /^[A-Z]{3}\d[A-Z]\d{2}$/;
    return placaRegex.test(placa);
  }

  validateAnoCarro(ano: number): boolean {  // valida o ano do carro
    const anoAtual = new Date().getFullYear();
    return ano >= 1900 && ano <= anoAtual;
  }
  
  editarDados() { // edita os dados no banco de dados
    if (
      this.dado.marcaCarro != '' &&
      this.dado.modeloCarro != '' &&
      this.validatePlacaCarro(this.dado.placaCarro) &&
      this.validateAnoCarro(this.dado.anoCarro) &&
      this.dado.aluno != '' &&
      this.dado.codigoEtiqueta != ''
    ) {
      this.dadosServico.editarDados(this.dado, this.placa).subscribe({
        error: (erro: any) => console.log(erro)
      });
      this.router.navigate(['/lista']);
    } else {
      this.formInvalid = true;
    }
  }

  escanear(): void {  // navega para o componente scanner do carro selecionado
    this.router.navigate([`/scanner/${this.placa}`])
  }
}
