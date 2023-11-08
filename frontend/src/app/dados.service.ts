import { Injectable } from '@angular/core';
import { Dados } from './dados';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap, merge } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DadosService {

  authToken: any = localStorage.getItem('authToken');
  headers = new HttpHeaders()
  .set('x-access-token', this.authToken);

  constructor(private http: HttpClient) { }

  getDados(): Observable<any> {
    return this.http.get('http://localhost:3000/alunocarro', {headers: this.headers});
  }

  getMatriculas(): Observable<any> {
    return this.http.get('http://localhost:3000/alunocarro/matricula', {headers: this.headers})
  }

  getDadosporMatricula(matricula: any): Observable<any> {
    return this.http.get(`http://localhost:3000/alunocarro/${matricula}`, {headers: this.headers})
  }

  getDadosporPlaca(placa: any): Observable<any> {
    return this.http.get(`http://localhost:3000/placa/${placa}`, {headers: this.headers})
  }

  addDados(dado: Dados): Observable<any> { 
        if (dado.CNHvalida == true) {
          dado.CNHvalida = 1;
        } else {
          dado.CNHvalida = 0;
        }
        let dataFormatada = dado.validadeEtiqueta.toISOString().slice(0, 19).replace('T', ' ');
        let reqAluno = {noAluno: dado.aluno, matriculaAluno: dado.matriculaAluno};
        let reqCarro ={
          marcaCarro: dado.marcaCarro,
          modeloCarro: dado.modeloCarro,
          anoCarro: dado.anoCarro,
          codigoEtiqueta: dado.codigoEtiqueta,
          validadeEtiqueta: dataFormatada,
          validaCnh: dado.CNHvalida,
          matriculaRel: dado.matriculaAluno,
          placaCarro: dado.placaCarro};
        let addAluno = this.http.post('http://localhost:3000/alunocarro/aluno', reqAluno, {headers: this.headers});
        let addCarro = this.http.post('http://localhost:3000/alunocarro/carro', reqCarro, {headers: this.headers});
        return merge(addAluno, addCarro);
  }

  editarDados(dado: Dados): Observable<any> {
    return this.http.get(`http://localhost:3000/alunocarro/carro/${dado.matriculaAluno}`, {headers: this.headers}).pipe(
      switchMap((resultado: any) => {
        let idcarro = resultado.id
        let dataFormatada = dado.validadeEtiqueta.toISOString().slice(0, 19).replace('T', ' ');
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
          validadeEtiqueta: dataFormatada,
          validaCnh: dado.CNHvalida,
          matriculaRel: dado.matriculaAluno,
          placaCarro: dado.placaCarro};
        let putAluno = this.http.put(`http://localhost:3000/alunocarro/aluno/${dado.matriculaAluno}`, reqAluno, {headers: this.headers});
        let putCarro = this.http.put(`http://localhost:3000/alunocarro/carro/${idcarro}`, reqCarro, {headers: this.headers});
        return merge(putAluno, putCarro)
      })
    )
        
  }

  deletarDados(matricula: number): Observable<any> {
    return this.http.get(`http://localhost:3000/alunocarro/carro/${matricula}`, {headers: this.headers}).pipe(
      switchMap((resultado: any) => {
        let idcarro = resultado.id;
        let deleteCarro = this.http.delete(`http://localhost:3000/alunocarro/carro/${idcarro}`, {headers: this.headers});
        let deleteAluno = this.http.delete(`http://localhost:3000/alunocarro/aluno/${matricula}`, {headers: this.headers});
        return merge(deleteCarro, deleteAluno);
      })
    );
  }
}
