import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  authToken: any = this.cookieService.get('authToken');
  headers = new HttpHeaders().set('x-access-token', this.authToken);
  autenticado = false;
  isAdmin = false;

  constructor(private http: HttpClient, private cookieService: CookieService) { }
  apiUrl = environment.apiUrl;
  

  login(user: string, password:string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {usuario: user, senha: password})
    .pipe(
      tap((response: any) => {
        if (response.token) { // Salva o token e a data de expiração no localStorage
          this.cookieService.set('authToken', response.token);
          this.cookieService.set('tokenExpiration', response.expiraEm);

          this.isAdmin = response.role == 'admin';
          this.cookieService.set('isAdmin', this.isAdmin.toString());
        }
      })
    );
  }

  logout(): void {
    this.cookieService.deleteAll(); // Excluir todos os cookies
    this.autenticado = false; // Define a variavel autenticado como false
    this.isAdmin = false; // Define a variavel isAdmin como false
  }

  isAutenticado(): boolean { // Verifica se o usuário está autenticado
    const authToken = this.cookieService.get('authToken');  // Verifica se o token existe e se está expirado
    if (authToken) {
      const expiraEm = this.cookieService.get('tokenExpiration') || '';
      const tempoExpiraEm = new Date(Number(expiraEm) * 1000).getTime();
      const agora = new Date().getTime();
      if (agora > tempoExpiraEm) { 
        this.autenticado = false;
        this.isAdmin = false;
        return false; 
      }
      this.autenticado = true;
      this.isAdmin = this.cookieService.get('isAdmin') == 'true';
      return true;
    }
  
    this.autenticado = false;
    this.isAdmin = false;
    return false;
  }

  isUserAdmin(): boolean {
    return this.isAdmin;
  }

  novoUsuario(login: any): Observable<any> {
    let reqUsuario = {
      usuario: login.usuario,
      senha: login.senha,
      role: login.role};
    let headers = new HttpHeaders().set('x-access-token', this.authToken);
    return this.http.post(`${this.apiUrl}/login/novo`, reqUsuario, {headers: this.headers});
  }
}
