import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxScannerQrcodeComponent, ScannerQRCodeResult } from 'ngx-scanner-qrcode';
import { SharedDataService } from '../shared-data.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css']
})
export class ScannerComponent implements AfterViewInit, OnInit {
  @ViewChild('action') action!: NgxScannerQrcodeComponent;
  valorDoScanner = '';
  placa = '';

  constructor(
    private sharedDataService: SharedDataService,
    private activaRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngAfterViewInit(): void {
    this.action.isReady.subscribe((res: any) => { // Inicia o scanner
      const traseiraPadrao = (dispositivos: any[]) => {
        const dispositivo = dispositivos.find(f => (/back|rear|environment/gi.test(f.label)));
        this.action.playDevice(dispositivo ? dispositivo.deviceId : dispositivos[0].deviceId);
      }
      this.action.start(traseiraPadrao);
    });
  }

  ngOnInit(): void {
    this.activaRoute.paramMap.subscribe({ // Recebe o parametro da rota
      next: (rota: any) => {
        this.placa = rota.params.placa;
      }
    });
  }

  handleQrCodeResult(e: ScannerQRCodeResult[], action?: any): void {
    this.valorDoScanner = e[0].value;
    this.sharedDataService.setCodigoEtiqueta(this.valorDoScanner); // Envia o resultado para o serviço
    action.stop();
    if (this.placa != null) { // Navega para a página de edição ou de formulário baseado no parametro da rota
      this.router.navigate([`/editar/${this.placa}`]); 
    } else {
      this.router.navigate(['/forms']);
    }
  }
}

