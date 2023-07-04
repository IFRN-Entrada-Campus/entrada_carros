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
    return this.http.post('http://localhost:3000/login', {usuario: user, senha: password});
  }

  isAutenticado(): boolean {
    if (this.autenticado) {
      return true;
    } else {
      return false;
    }
  }
}
