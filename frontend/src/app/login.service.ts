import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  autenticado = false;
  constructor(private http: HttpClient) { }
  apiUrl = environment.apiUrl;

  login(user: string, password:string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {usuario: user, senha: password})
    .pipe(
      tap((response: any) => {
        if (response.token) { // Salva o token e a data de expiração no localStorage
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('tokenExpiration', response.expiraEm);
        }
      })
    );
  }

  logout(): void {
    localStorage.clear(); // Limpa o localStorage
    this.autenticado = false; // Define a variavel autenticado como false
  }

  isAutenticado(): boolean { // Verifica se o usuário está autenticado
    const authToken = localStorage.getItem('authToken');  // Verifica se o token existe e se está expirado
    if (authToken) {
      const expiraEm = localStorage.getItem('tokenExpiration') || '';
      const tempoExpiraEm = new Date(Number(expiraEm) * 1000).getTime();
      const agora = new Date().getTime();
      if (agora > tempoExpiraEm) { 
        this.autenticado = false;
        return false; 
      }
      this.autenticado = true;
      return true;
    }
  
    this.autenticado = false;
    return false;
  }
}
