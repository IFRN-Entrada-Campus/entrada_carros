import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DadosService } from '../dados.service';
import { Dados } from '../dados';
import { SharedDataService } from '../shared-data.service';
import { Subscription } from 'rxjs';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {

  dado: Dados = { modeloCarro: '', marcaCarro: '', anoCarro: '', aluno: '', matriculaAluno: '', codigoEtiqueta: '', validadeEtiqueta: new Date(), CNHvalida: '', placaCarro: '' };
  formInvalid = false;  // variavel para mostrar o alerta de erro
  placa = ''; // variavel para armazenar a placa do carro
  erroSQL = false;  // variavel para mostrar o alerta de erro do banco
  cadastroSucesso = false;  // variavel para mostrar o alerta de sucesso
  admin = false; // variavel para verificar se o usuário é admin ou não

  constructor(
    private activaRoute: ActivatedRoute,
    private dadosServico: DadosService,
    private router: Router,
    private sharedDataService: SharedDataService,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.admin = this.loginService.isUserAdmin();
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
              const codigoEtiqueta = this.dado.codigoEtiqueta;
              this.sharedDataService.setCodigoEtiqueta('');
              this.dado.codigoEtiqueta = codigoEtiqueta
            }
            this.dado.validadeEtiqueta = new Date(retorno[0].validadeEtiqueta);
            this.dado.CNHvalida = retorno[0].CNHvalida;
            if (this.dado.CNHvalida == 1) {
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

  validatePlacaCarro(placa: string): boolean {  // Valida a placa do carro
    // Verifica se a placa está no formato antigo brasileiro
    const formatoAntigoRegex = /^[A-Z]{3}\d{4}$/;

    // Verifica se a placa está no formato Mercosul 
    const placaRegex = /^[A-Z]{3}\d[A-Z]\d{2}$/;

    return formatoAntigoRegex.test(placa) || placaRegex.test(placa);
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
        next: () => {
          this.formInvalid = false;
          this.cadastroSucesso = true;
          setTimeout(() => {
            this.router.navigate(['/lista']);
          }, 1000);
        },
        error: (erro: any) => {
          console.log(erro);
          this.erroSQL = true;
        }
      });
    } else {
      this.formInvalid = true;
    }
  }

  escanear(): void {  // navega para o componente scanner do carro selecionado
    this.router.navigate([`/scanner/${this.placa}`])
  }
}
