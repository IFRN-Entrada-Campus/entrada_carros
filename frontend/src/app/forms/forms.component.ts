import { Component, OnDestroy, OnInit } from '@angular/core';
import { Dados } from '../dados';
import { Router } from '@angular/router';
import { DadosService } from '../dados.service';
import { SharedDataService } from '../shared-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})

export class FormsComponent implements OnInit, OnDestroy {
  dado: Dados = { modeloCarro: '', marcaCarro: '', anoCarro: '', aluno: '', matriculaAluno: '', codigoEtiqueta: 0, validadeEtiqueta: new Date(), CNHvalida: '', placaCarro: '' };
  matriculas: any[] = []; // variavel para armazenar as matriculas dos alunos
  formInvalid = false;  // variavel para mostrar o alerta de erro

  codigoEtiquetaSubscription: Subscription | undefined;
  matriculaAlunoSubscription: Subscription | undefined;
  alunoSubscription: Subscription | undefined;
  modeloCarroSubscription: Subscription | undefined;
  marcaCarroSubscription: Subscription | undefined;
  anoCarroSubscription: Subscription | undefined;
  placaCarroSubscription: Subscription | undefined;
  CNHvalidaSubscription: Subscription | undefined;
  validadeEtiquetaSubscription: Subscription | undefined;

  constructor(private dadosService: DadosService, private router: Router, private sharedData: SharedDataService) {

  }

  ngOnInit(): void {
    this.dadosService.getMatriculas().subscribe({ // Preenche o select com as matrículas dos alunos
      next: (resultado: any) => (this.matriculas = resultado),
      error: (erro: any) => console.log(erro)
    });
    this.codigoEtiquetaSubscription = this.sharedData.codigoEtiqueta$.subscribe((codigo: string) => { // Recebe os dados do formulário
      this.dado.codigoEtiqueta = codigo
    });
    this.matriculaAlunoSubscription = this.sharedData.matriculaAluno$.subscribe((matricula: number) => {
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
    this.sharedData.setAluno(''); // Limpa os dados do sharedData
    this.sharedData.setMatriculaAluno(0);
    this.sharedData.setCodigoEtiqueta('');
    this.sharedData.setModeloCarro('');
    this.sharedData.setMarcaCarro('');
    this.sharedData.setAnoCarro(0);
    this.sharedData.setPlacaCarro('');
    this.sharedData.setValidadeEtiqueta(new Date());
    this.sharedData.setCNHvalida(false);
    this.formInvalid = false;
  }

  ngOnDestroy(): void { // Desinscreve os observables
    if (this.codigoEtiquetaSubscription) {
      this.codigoEtiquetaSubscription.unsubscribe();
    }
    if (this.matriculaAlunoSubscription) {
      this.matriculaAlunoSubscription.unsubscribe();
    }
    if (this.alunoSubscription) {
      this.alunoSubscription.unsubscribe();
    }
    if (this.modeloCarroSubscription) {
      this.modeloCarroSubscription.unsubscribe();
    }
    if (this.marcaCarroSubscription) {
      this.marcaCarroSubscription.unsubscribe();
    }
    if (this.anoCarroSubscription) {
      this.anoCarroSubscription.unsubscribe();
    }
    if (this.placaCarroSubscription) {
      this.placaCarroSubscription.unsubscribe();
    }
    if (this.CNHvalidaSubscription) {
      this.CNHvalidaSubscription.unsubscribe();
    }
    if (this.validadeEtiquetaSubscription) {
      this.validadeEtiquetaSubscription.unsubscribe();
    }
  }


  validatePlacaCarro(placa: string): boolean {  // Valida a placa do carro
    const placaRegex = /^[A-Z]{3}\d[A-Z]\d{2}$/;
    return placaRegex.test(placa);
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

