import { Component, OnDestroy, OnInit } from '@angular/core';
import { Dados } from '../dados';
import { Router } from '@angular/router';
import { DadosService } from '../dados.service';
import { SharedDataService } from '../shared-data.service';
import { Subscription } from 'rxjs';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})

export class FormsComponent implements OnInit {
  dado: Dados = { modeloCarro: '', marcaCarro: '', anoCarro: '', aluno: '', matriculaAluno: '', codigoEtiqueta: 0, validadeEtiqueta: new Date(), CNHvalida: '', placaCarro: '' };
  usuarioJaCadastrado: boolean = false;
  matriculas: any[] = []; // variavel para armazenar as matriculas dos alunos
  formInvalid = false;  // variavel para mostrar o alerta de erro
  erroSQL = false;  // variavel para mostrar o alerta de erro do banco
  erroUsuario = '';
  cadastroSucesso = false;  // variavel para mostrar o alerta de sucesso
  admin = false; // variavel para verificar se o usuário é admin ou não

  constructor(private dadosService: DadosService, private router: Router, private sharedData: SharedDataService, private loginService: LoginService) {

  }

  ngOnInit(): void {
    this.admin = this.loginService.isUserAdmin();
    this.dadosService.getMatriculas().subscribe({ // Preenche o select com as matrículas dos alunos
      next: (resultado: any) => this.matriculas = resultado,
      error: (erro: any) => console.log(erro)
    });
    this.sharedData.codigoEtiqueta$.subscribe((codigo: string) => { // Recebe os dados do formulário
      this.dado.codigoEtiqueta = codigo
    });
    this.sharedData.matriculaAluno$.subscribe((matricula: number) => {
      this.dado.matriculaAluno = matricula
    });
    this.sharedData.aluno$.subscribe((aluno: string) => {
      this.dado.aluno = aluno
    });
    this.sharedData.modeloCarro$.subscribe((modelo: string) => {
      this.dado.modeloCarro = modelo
    });
    this.sharedData.marcaCarro$.subscribe((marca: string) => {
      this.dado.marcaCarro = marca
    });
    this.sharedData.anoCarro$.subscribe((ano: number) => {
      this.dado.anoCarro = ano
    });
    this.sharedData.placaCarro$.subscribe((placa: string) => {
      this.dado.placaCarro = placa
    });
    this.sharedData.CNHvalida$.subscribe((valida: boolean) => {
      this.dado.CNHvalida = valida
    });
    this.sharedData.validadeEtiqueta$.subscribe((validade: Date) => {
      this.dado.validadeEtiqueta = validade
    });

    const aluno = this.dado.aluno;
    const matriculaAluno = this.dado.matriculaAluno;
    const codigoEtiqueta = this.dado.codigoEtiqueta;
    const modeloCarro = this.dado.modeloCarro;
    const marcaCarro = this.dado.marcaCarro;
    const anoCarro = this.dado.anoCarro;
    const placaCarro = this.dado.placaCarro;
    const CNHvalida = this.dado.CNHvalida;
    const validadeEtiqueta = this.dado.validadeEtiqueta;

    this.sharedData.setAluno('');
    this.sharedData.setMatriculaAluno(0);
    this.sharedData.setCodigoEtiqueta('');
    this.sharedData.setModeloCarro('');
    this.sharedData.setMarcaCarro('');
    this.sharedData.setAnoCarro(0);
    this.sharedData.setPlacaCarro('');
    this.sharedData.setValidadeEtiqueta(new Date());
    this.sharedData.setCNHvalida(false);
    this.formInvalid = false;

    this.dado.aluno = aluno;
    this.dado.matriculaAluno = matriculaAluno;
    this.dado.codigoEtiqueta = codigoEtiqueta;
    this.dado.modeloCarro = modeloCarro;
    this.dado.marcaCarro = marcaCarro;
    this.dado.anoCarro = anoCarro;
    this.dado.placaCarro = placaCarro;
    this.dado.CNHvalida = CNHvalida;
    this.dado.validadeEtiqueta = validadeEtiqueta;
  }


  validatePlacaCarro(placa: string): boolean {  // Valida a placa do carro
    // Verifica se a placa está no formato antigo brasileiro
    const formatoAntigoRegex = /^[A-Z]{3}\d{4}$/;

    // Verifica se a placa está no formato Mercosul 
    const placaRegex = /^[A-Z]{3}\d[A-Z]\d{2}$/;

    return formatoAntigoRegex.test(placa) || placaRegex.test(placa);
  }

  validateAnoCarro(ano: number): boolean {  // Valida o ano do carro
    const anoAtual = new Date().getFullYear();
    return ano >= 1900 && ano <= anoAtual;
  }

  addDados(): void {  // Adiciona os dados no banco de dados
    if (
      this.dado.marcaCarro != '' &&
      this.dado.modeloCarro != '' &&
      this.validatePlacaCarro(this.dado.placaCarro) &&
      this.validateAnoCarro(this.dado.anoCarro) &&
      this.dado.matriculaAluno != 0 &&
      this.dado.codigoEtiqueta != ''
    ) {
      if (this.usuarioJaCadastrado) {
        let dadocarro = {
          marcaCarro: this.dado.marcaCarro,
          modeloCarro: this.dado.modeloCarro,
          anoCarro: this.dado.anoCarro,
          codigoEtiqueta: this.dado.codigoEtiqueta,
          validadeEtiqueta: this.dado.validadeEtiqueta,
          CNHvalida: this.dado.CNHvalida,
          matriculaRel: this.dado.matriculaAluno,
          placaCarro: this.dado.placaCarro
        }
        this.dadosService.addCarro(dadocarro).subscribe({
          next: () => {
            this.formInvalid = false;
            this.erroUsuario = '';
            this.erroSQL = false;
            this.cadastroSucesso = true;
            setTimeout(() => {
              this.router.navigate(['/lista']);
            }, 1000);
          },
          error: (erro: any) => {
            console.log(erro);
            this.formInvalid = false;
            this.erroSQL = true;
            this.erroUsuario = '';
            this.cadastroSucesso = false;
          }
        });
      } else {
        let i = 0;
        for (this.matriculas.length; i < this.matriculas.length; i++) {
          if (this.dado.matriculaAluno == this.matriculas[i].matriculaAluno) {
            this.formInvalid = false;
            this.erroSQL = false;
            this.erroUsuario = 'O condutor já está cadastrado! Caso queira cadastrar novo carro, por favor marcar a opção de condutor já cadastrado.';
            this.cadastroSucesso = false;
            break;
          }
        }
        if (this.erroUsuario == '') {
          this.dadosService.addDados(this.dado).subscribe({
            next: () => {
              this.formInvalid = false;
              this.erroUsuario = '';
              this.erroSQL = false;
              this.cadastroSucesso = true;
              setTimeout(() => {
                this.router.navigate(['/lista']);
              }, 1000);
            },
            error: (erro: any) => {
              console.log(erro);
              this.formInvalid = false;
              this.erroSQL = true;
              this.erroUsuario = '';
              this.cadastroSucesso = false;
            }
          });
        }
      }
    } else {
      this.formInvalid = true;
    }
  }

  escanear(): void {  // Navega para a página de scanner
    this.sharedData.setAluno(this.dado.aluno);
    this.sharedData.setMatriculaAluno(this.dado.matriculaAluno);
    this.sharedData.setCodigoEtiqueta(this.dado.codigoEtiqueta);
    this.sharedData.setModeloCarro(this.dado.modeloCarro);
    this.sharedData.setMarcaCarro(this.dado.marcaCarro);
    this.sharedData.setAnoCarro(this.dado.anoCarro);
    this.sharedData.setPlacaCarro(this.dado.placaCarro);
    this.sharedData.setValidadeEtiqueta(this.dado.validadeEtiqueta);
    this.sharedData.setCNHvalida(this.dado.CNHvalida);
    this.router.navigate(['/scanner']);
  }


}

