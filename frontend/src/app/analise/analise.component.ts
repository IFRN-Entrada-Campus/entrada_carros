import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxScannerQrcodeComponent, ScannerQRCodeResult } from 'ngx-scanner-qrcode';
import { SharedDataService } from '../shared-data.service';

@Component({
  selector: 'app-analise',
  templateUrl: './analise.component.html',
  styleUrls: ['./analise.component.css']
})
export class AnaliseComponent implements AfterViewInit{
  @ViewChild('action') action!: NgxScannerQrcodeComponent;
  valorDoScanner = '';

  constructor (
    private router: Router, 
    private sharedDataService: SharedDataService) {}

  ngAfterViewInit(): void {
    this.action.isReady.subscribe((res: any) => {
      this.action.start();
    });
  }

  handleQrCodeResult(e: ScannerQRCodeResult[], action?: any): void {
    this.valorDoScanner = e[0].value;
    this.sharedDataService.setCodigoEtiqueta(this.valorDoScanner);
    action.stop();
    this.router.navigate(['/lista']);
  }
}
