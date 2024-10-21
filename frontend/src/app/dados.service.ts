import { Injectable } from '@angular/core';
import { Dados } from './dados';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap, merge } from 'rxjs';
import { environment } from '../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class DadosService {
  constructor(private http: HttpClient, private cookieService: CookieService) { }
  apiUrl = environment.apiUrl
  authToken: any = this.cookieService.get('authToken');
  headers = new HttpHeaders()
  .set('x-access-token', this.authToken);

  getDados(): Observable<any> { // Retorna os dados do banco da tabela pessoa e carro
    return this.http.get(`${this.apiUrl}/pessoacarro`, {headers: this.headers})
  }

  getIdPessoas(): Observable<any> { // Retorna as identificações do banco
    return this.http.get(`${this.apiUrl}/pessoacarro/idPessoa`, {headers: this.headers})
  }

  getDadosporPlaca(placa: any): Observable<any> { // Retorna os dados do banco da tabela pessoa e carro baseado na placa
    return this.http.get(`${this.apiUrl}/placa/${placa}`, {headers: this.headers})
  }

  getHistoricoEntrada(): Observable<any> { // Retorna os dados do banco da tabela entrada
    return this.http.get(`${this.apiUrl}/entrada`, {headers: this.headers})
  }

  getUltimaMensagem(): Observable<any> {
    return this.http.get(`${this.apiUrl}/mqtt/ult-msg`, {headers: this.headers})
  }

  addDados(dado: Dados): Observable<any> { // Adiciona os dados no banco
    if (dado.CNHvalida == true) { // Converte o valor booleano para inteiro
      dado.CNHvalida = 1;
    } else {
      dado.CNHvalida = 0;
    }
    let dataFormatada = dado.validadeEtiqueta.toISOString().slice(0, 19).replace('T', ' '); // Converte a data para o formato do banco
    let reqPessoa = {nomePessoa: dado.nomePessoa, idPessoa: dado.idPessoa, tipoId: dado.tipoId, vinculo: dado.vinculo}; // Cria o objeto para o pessoa
    let reqCarro ={ // Cria o objeto para o carro
      marcaCarro: dado.marcaCarro,
      modeloCarro: dado.modeloCarro,
      anoCarro: dado.anoCarro,
      codigoEtiqueta: dado.codigoEtiqueta,
      validadeEtiqueta: dataFormatada,
      validaCnh: dado.CNHvalida,
      idPessoaRel: dado.idPessoa,
      placaCarro: dado.placaCarro};
    let addPessoa = this.http.post(`${this.apiUrl}/pessoacarro/pessoa`, reqPessoa, {headers: this.headers}); // Faz a requisição para o pessoa
    let addCarro = this.http.post(`${this.apiUrl}/pessoacarro/carro`, reqCarro, {headers: this.headers}); // Faz a requisição para o carro
    return merge(addPessoa, addCarro);
  }

  addCarro(dado: any): Observable<any> {
    let dataFormatada = dado.validadeEtiqueta.toISOString().slice(0, 19).replace('T', ' ');
    let req = {
      marcaCarro: dado.marcaCarro,
      modeloCarro: dado.modeloCarro,
      anoCarro: dado.anoCarro,
      codigoEtiqueta: dado.codigoEtiqueta,
      validadeEtiqueta: dataFormatada,
      validaCnh: dado.CNHvalida,
      idPessoaRel: dado.idPessoaRel,
      placaCarro: dado.placaCarro
    };
    return this.http.post(`${this.apiUrl}/pessoacarro/carro`, req, {headers: this.headers});
  }

  addHistoricoEntrada(dados: any): Observable<any> { // Adiciona os dados de entrada de veículos no banco
    let reqHistorico = {placa: dados.placa, dataHora: dados.dataHora, img: dados.img, idCarroRel: dados.idCarroRel};
    return this.http.post(`${this.apiUrl}/entrada`, reqHistorico, {headers: this.headers}); // Faz a requisição para o historico
  }

  editarDados(dado: Dados, placa: any): Observable<any> { // Edita os dados no banco
    let dataFormatada = dado.validadeEtiqueta.toISOString().slice(0, 19).replace('T', ' '); 
    if (dado.CNHvalida === true) {
      dado.CNHvalida = 1;
    } else {
      dado.CNHvalida = 0;
    }
    let reqPessoa = {nomePessoa: dado.nomePessoa, idPessoa: dado.idPessoa, tipoId: dado.tipoId, vinculo: dado.vinculo};
    let reqCarro ={
      marcaCarro: dado.marcaCarro,
      modeloCarro: dado.modeloCarro,
      anoCarro: dado.anoCarro,
      codigoEtiqueta: dado.codigoEtiqueta,
      validadeEtiqueta: dataFormatada,
      validaCnh: dado.CNHvalida,
      idPessoaRel: dado.idPessoa,
      placaCarro: dado.placaCarro};
    let putPessoa = this.http.put(`${this.apiUrl}/pessoacarro/pessoa/${dado.idPessoa}`, reqPessoa, {headers: this.headers});
    let putCarro = this.http.put(`${this.apiUrl}/pessoacarro/carro/${placa}`, reqCarro, {headers: this.headers});
    return merge(putPessoa, putCarro) // Faz a requisição para o pessoa e para o carro utilizando o merge
        
  }

  deletarDados(placa: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/placa/${placa}`, {headers: this.headers}).pipe(
      switchMap((resultado: any) => {
        let idPessoa = resultado[0].idPessoa; // Pega a identificação da pessoa
        let deleteCarro = this.http.delete(`${this.apiUrl}/pessoacarro/carro/${placa}`, {headers: this.headers}); // Requisição para o carro
        let deletePessoa = this.http.delete(`${this.apiUrl}/pessoacarro/pessoa/${idPessoa}`, {headers: this.headers}); // Requisição para pessoa
        return merge(deleteCarro, deletePessoa); // Faz a requisição para o passoa e para o carro utilizando o merge
      })
    );
  }
}
