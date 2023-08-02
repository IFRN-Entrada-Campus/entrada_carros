import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  autenticado = false;
  constructor(private http: HttpClient) { }

  login(user: string, password:string): Observable<any> {
    return this.http.post('http://backend:3000/login', {usuario: user, senha: password})
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
      const tempoExpiraEm = new Date(Number(expiraEm)).getTime();
      const agora = new Date().getTime();
      console.log(tempoExpiraEm, agora)
      if (agora > tempoExpiraEm) {
        this.autenticado = true;
        return true;
      }
    }

    this.autenticado = false;
    this.logout();
    return false;
  }
}
