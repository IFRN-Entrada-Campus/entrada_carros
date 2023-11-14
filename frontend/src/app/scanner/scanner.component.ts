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
    ) {}

  ngAfterViewInit(): void {
    this.action.isReady.subscribe((res: any) => {

    });
  }

  ngOnInit(): void {
    this.activaRoute.paramMap.subscribe({
      next: (rota: any) => {
        this.placa = rota.params.placa;
      }
    });
  }

  handleQrCodeResult(e: ScannerQRCodeResult[], action?: any): void {
    action.pause();
    this.valorDoScanner = e[0].value;
    if (this.placa != null) {
      action.stop();
      this.sharedDataService.setCodigoEtiqueta(this.valorDoScanner);
      this.router.navigate([`/editar/${this.placa}`]);
    }
  }
}

