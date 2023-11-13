import { Component, Inject, OnInit } from '@angular/core';
import { DadosService } from '../dados.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {
  dadosFormulario: any[] = [];
  dadoSelecionado?: any;
  placaPesquisada: string = '';
  etiquetaPesquisada: string = '';
  dadosCopia: any[] = [];
  carregando = true;
  tipo_pesquisa = true; // true = placa e false = etiqueta;

  constructor(private dadosService: DadosService, private router: Router) {
  }


  ngOnInit(): void {
    this.onListar();
  }

  formatarData(data: string): string {
    const dataFormatada = new Date(data);
    return dataFormatada.toLocaleDateString('pt-BR');
  }

  formatarCNH(cnh: number): string {
    let cnhformatada;
    if (cnh == 1) {
      cnhformatada = 'Sim';
    } else {
      cnhformatada = 'Não';
    }
    return cnhformatada;
  }

  onListar(): void {
    this.dadosService.getDados().subscribe({
      next: (resultado: any) => { (this.dadosFormulario = resultado.map((item: any) => {
        return {...item, validadeEtiqueta: this.formatarData(item.validadeEtiqueta), CNHvalida: this.formatarCNH(item.CNHvalida) };
      })), console.log(resultado) },
      error: (erro: any) => console.log(erro),
      complete: () => console.log('completo')
    });
    this.dadosService.getDados().subscribe({
      next: (resultado: any) => { (this.dadosCopia = resultado.map((item: any) => {
        return {...item, validadeEtiqueta: this.formatarData(item.validadeEtiqueta), CNHvalida: this.formatarCNH(item.CNHvalida) };
      })), console.log(resultado) },
      error: (erro: any) => console.log(erro),
      complete: () => this.carregando = false
    });
  }

  deletarDados(placa: any): void {
    this.dadosService.deletarDados(placa).subscribe({})
  }

  cadastrar(): void {
    this.router.navigate(['/forms']);
  }

  mqtt(): void {
    this.router.navigate(['/mqtt']);
  }

  scanner(): void {
    this.router.navigate(['/scanner']);
  }

  editarDados(Placa: any): void {
    this.router.navigate([`/editar/${Placa}`]);
  }

  filtrarPlacas(): void {
    if (this.placaPesquisada) {
      this.placaPesquisada = this.placaPesquisada.toUpperCase();

      this.dadosFormulario = this.dadosCopia.filter((dados) => {
        return dados.Placa.toUpperCase().includes(this.placaPesquisada);
      });
    } else {
      this.dadosFormulario = [...this.dadosCopia];
    }
  }

  filtrarEtiquetas(): void {
    if (this.etiquetaPesquisada) {
      this.etiquetaPesquisada = this.etiquetaPesquisada.toLowerCase();

      this.dadosFormulario = this.dadosCopia.filter((dados) => {
        return dados.codigoEtiqueta.toLowerCase().includes(this.etiquetaPesquisada);
      });
    } else {
      this.dadosFormulario = [...this.dadosCopia];
    }
  }

  trocarPesquisa(): void {
    if (this.tipo_pesquisa) {
      this.tipo_pesquisa = false;
    } else {
      this.tipo_pesquisa = true;
    }
  }
}
