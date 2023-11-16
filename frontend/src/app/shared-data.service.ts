import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private codigoEtiquetaSubject = new BehaviorSubject<string>('');
  private matriculaAlunoSubject = new BehaviorSubject<number>(0);
  private alunoSubject = new BehaviorSubject<string>('');
  private modeloCarroSubject = new BehaviorSubject<string>('');
  private marcaCarroSubject = new BehaviorSubject<string>('');
  private anoCarroSubject = new BehaviorSubject<number>(2000);
  private placaCarroSubject = new BehaviorSubject<string>('');
  private CNHvalidaSubject = new BehaviorSubject<boolean>(false);
  private validadeEtiquetaSubject = new BehaviorSubject<Date>(new Date());

  codigoEtiqueta$ = this.codigoEtiquetaSubject.asObservable();
  matriculaAluno$ = this.matriculaAlunoSubject.asObservable();
  aluno$ = this.alunoSubject.asObservable();
  modeloCarro$ = this.modeloCarroSubject.asObservable();
  marcaCarro$ = this.marcaCarroSubject.asObservable();
  anoCarro$ = this.anoCarroSubject.asObservable();
  placaCarro$ = this.placaCarroSubject.asObservable();
  CNHvalida$ = this.CNHvalidaSubject.asObservable();
  validadeEtiqueta$ = this.validadeEtiquetaSubject.asObservable();


  setCodigoEtiqueta(codigo: string): void {
    this.codigoEtiquetaSubject.next(codigo);
  }

  setMatriculaAluno(matricula: number): void {
    this.matriculaAlunoSubject.next(matricula);
  }

  setAluno(aluno: string): void {
    this.alunoSubject.next(aluno);
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
