import { Component, Inject, OnInit } from '@angular/core';
import { DadosService } from '../dados.service';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs';
import { Dados } from '../dados';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {
  dadosFormulario: any[] = [];
  dadoSelecionado?: any;
  placaPesquisada: string = '';
  dadosCopia: any[] = [];
  carregando = true;

  constructor(private dadosService: DadosService, private router: Router) {
  }


  ngOnInit(): void {
    this.onListar();
  }

  formatarData(data: string): string {
    const dataFormatada = new Date(data);
    return dataFormatada.toLocaleDateString('pt-BR');
  }

  onListar(): void {
    this.dadosService.getDados().subscribe({
      next: (resultado: any) => { (this.dadosFormulario = resultado.map((item: any) => {
        return {...item, validadeEtiqueta: this.formatarData(item.validadeEtiqueta) };
      })), console.log(resultado) },
      error: (erro: any) => console.log(erro),
      complete: () => console.log('completo')
    });
    this.dadosService.getDados().subscribe({
      next: (resultado: any) => { (this.dadosCopia = resultado.map((item: any) => {
        return {...item, validadeEtiqueta: this.formatarData(item.validadeEtiqueta) };
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

  editarDados(Placa: any) {
    this.router.navigate([`/editar/${Placa}`]);
  }

  filtrarPlacas() {
    if (this.placaPesquisada) {
      this.placaPesquisada = this.placaPesquisada.toUpperCase();

      this.dadosFormulario = this.dadosCopia.filter((dados) => {
        return dados.Placa.toUpperCase().includes(this.placaPesquisada.toUpperCase());
      });
    } else {
      this.dadosFormulario = [...this.dadosCopia];
    }
  }
}
