import { Injectable } from '@angular/core';
import { Dados } from './dados';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DadosService {


  constructor(private http: HttpClient) { }

  getDados(): Observable<any> {
    return this.http.get('http://localhost:3000/alunocarro');
  }

  getMatriculas(): Observable<any> {
    return this.http.get('http://localhost:3000/alunocarro/matricula')
  }

  addDados(dado: Dados): Observable<any> { 
        if (dado.CNHvalida == true) {
          dado.CNHvalida = 1;
        } else {
          dado.CNHvalida = 0;
        }
        let reqAluno = {noAluno: dado.aluno, matriculaAluno: dado.matriculaAluno};
        let reqCarro ={
          marcaCarro: dado.marcaCarro,
          modeloCarro: dado.modeloCarro,
          anoCarro: dado.anoCarro,
          codigoEtiqueta: dado.codigoEtiqueta,
          validaCnh: dado.CNHvalida,
          matriculaRel: dado.matriculaAluno};
        let addAluno = this.http.post('http://localhost:3000/alunocarro/aluno', reqAluno);
        let addCarro = this.http.post('http://localhost:3000/alunocarro/carro', reqCarro);
        return forkJoin(addAluno, addCarro);
  }

  editarDados(dado: Dados): Observable<any> {
    return this.http.get(`http://localhost:3000/alunocarro/carro/${dado.matriculaAluno}`).pipe(
      switchMap((resultado: any) => {
        let idcarro = resultado.id
        if (dado.CNHvalida === true) {
          dado.CNHvalida = 1;
        } else {
          dado.CNHvalida = 0;
        }
        let reqAluno = {noAluno: dado.aluno, matriculaAluno: dado.matriculaAluno};
        let reqCarro ={
          marcaCarro: dado.marcaCarro,
          modeloCarro: dado.modeloCarro,
          anoCarro: dado.anoCarro,
          codigoEtiqueta: dado.codigoEtiqueta,
          validaCnh: dado.CNHvalida,
          matriculaRel: dado.matriculaAluno};
        let putAluno = this.http.put(`http://localhost:3000/alunocarro/aluno/${dado.matriculaAluno}`, reqAluno);
        let putCarro = this.http.put(`http://localhost:3000/alunocarro/carro/${idcarro}`, reqCarro);
        return forkJoin(putAluno, putCarro)
      })
    )
        
  }

  deletarDados(matricula: number): Observable<any> {
    return this.http.get(`http://localhost:3000/alunocarro/carro/${matricula}`).pipe(
      switchMap((resultado: any) => {
        let idcarro = resultado.id;
        let deleteCarro = this.http.delete(`http://localhost:3000/alunocarro/carro/${idcarro}`);
        let deleteAluno = this.http.delete(`http://localhost:3000/alunocarro/aluno/${matricula}`);
        return forkJoin(deleteCarro, deleteAluno);
      })
    );
  }
}
