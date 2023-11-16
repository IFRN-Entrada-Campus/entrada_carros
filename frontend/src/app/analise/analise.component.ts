import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NgxScannerQrcodeComponent, ScannerQRCodeResult } from 'ngx-scanner-qrcode';

@Component({
  selector: 'app-analise',
  templateUrl: './analise.component.html',
  styleUrls: ['./analise.component.css']
})
export class AnaliseComponent implements AfterViewInit{
  @ViewChild('action') action!: NgxScannerQrcodeComponent;
  valorDoScanner = '';

  ngAfterViewInit(): void {
    this.action.isReady.subscribe((res: any) => {

    });
  }

  handleQrCodeResult(e: ScannerQRCodeResult[], action?: any): void {
    this.valorDoScanner = e[0].value;
    action.pause();
  }
}
