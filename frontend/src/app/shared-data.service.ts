import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private codigoEtiquetaSubject = new BehaviorSubject<string>('');
  codigoEtiqueta$ = this.codigoEtiquetaSubject.asObservable();

  setCodigoEtiqueta(codigo: string): void {
    this.codigoEtiquetaSubject.next(codigo);
  }
}
