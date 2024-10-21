import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService { // Serviço para compartilhar os dados entre os componentes
  private codigoEtiquetaSubject = new BehaviorSubject<string>('');
  private tipoIdSubject = new BehaviorSubject<string>('');
  private idPessoaSubject = new BehaviorSubject<number>(0); // Inicia a matricula com 0
  private vinculoSubject = new BehaviorSubject<string>('');
  private nomePessoaSubject = new BehaviorSubject<string>('');
  private modeloCarroSubject = new BehaviorSubject<string>('');
  private marcaCarroSubject = new BehaviorSubject<string>('');
  private anoCarroSubject = new BehaviorSubject<number>(2000); // Inicia o ano com 2000
  private placaCarroSubject = new BehaviorSubject<string>('');
  private CNHvalidaSubject = new BehaviorSubject<boolean>(false);
  private validadeEtiquetaSubject = new BehaviorSubject<Date>(new Date()); // Inicia a data com a data atual

  codigoEtiqueta$ = this.codigoEtiquetaSubject.asObservable();
  tipoId$ = this.tipoIdSubject.asObservable();
  idPessoa$ = this.idPessoaSubject.asObservable();
  nomePessoa$ = this.nomePessoaSubject.asObservable();
  vinculo$ = this.vinculoSubject.asObservable();
  modeloCarro$ = this.modeloCarroSubject.asObservable();
  marcaCarro$ = this.marcaCarroSubject.asObservable();
  anoCarro$ = this.anoCarroSubject.asObservable();
  placaCarro$ = this.placaCarroSubject.asObservable();
  CNHvalida$ = this.CNHvalidaSubject.asObservable();
  validadeEtiqueta$ = this.validadeEtiquetaSubject.asObservable();


  setCodigoEtiqueta(codigo: string): void {
    this.codigoEtiquetaSubject.next(codigo);
  }

  setTipoId(tipoId: string): void {
    this.tipoIdSubject.next(tipoId);
  }

  setVinculo(vinculo: string): void {
    this.vinculoSubject.next(vinculo);
  }
  setIdPessoa(idPessoa: number): void {
    this.idPessoaSubject.next(idPessoa);
  }

  setNomePessoa(nomePessoa: string): void {
    this.nomePessoaSubject.next(nomePessoa);
  }

  setModeloCarro(modelo: string): void {
    this.modeloCarroSubject.next(modelo);
  }

  setMarcaCarro(marca: string): void {
    this.marcaCarroSubject.next(marca);
  }

  setAnoCarro(ano: number): void {
    this.anoCarroSubject.next(ano);
  }

  setPlacaCarro(placa: string): void {
    this.placaCarroSubject.next(placa);
  }

  setCNHvalida(valida: boolean): void {
    this.CNHvalidaSubject.next(valida);
  }

  setValidadeEtiqueta(validade: Date): void {
    this.validadeEtiquetaSubject.next(validade);
  }

}
