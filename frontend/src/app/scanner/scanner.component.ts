import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NgxScannerQrcodeComponent, ScannerQRCodeResult } from 'ngx-scanner-qrcode';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css']
})
export class ScannerComponent implements AfterViewInit {
  @ViewChild('action') action!: NgxScannerQrcodeComponent;
  valorDoScanner = '';

  ngAfterViewInit(): void {
    this.action.isReady.subscribe((res: any) => {

    });
  }

  handleQrCodeResult(e: ScannerQRCodeResult[], action?: any): void {
    action.pause();
    this.valorDoScanner = e[0].value;
  }
}

