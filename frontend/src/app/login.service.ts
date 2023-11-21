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
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('tokenExpiration', response.expiraEm);
        }
      })
    );
  }

  logout(): void {
    localStorage.clear();
    this.autenticado = false;
  }

  isAutenticado(): boolean {
    const authToken = localStorage.getItem('authToken');
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
