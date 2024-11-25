import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitarRecuperacaoService {

  private apiUrl = 'https://localhost/api/login/solicitar-recuperacao'; //URL do back-end para solicitar a recuperação

  constructor(private http: HttpClient) { }

  // Função para solicitar o código de recuperação
  solicitarCodigoRecuperacao(email: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email });
  }
}
