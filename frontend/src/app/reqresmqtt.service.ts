import { Injectable } from '@angular/core';
import { MqttService } from 'ngx-mqtt';
import { DadosService } from './dados.service';

@Injectable({
  providedIn: 'root'
})
export class ReqresmqttService {
  private topico = 'tartaruga_carrodeentrada_1283';

  constructor(private mqttService: MqttService, private dadosService: DadosService) {}

  iniciarConexao(): void {
    this.mqttService.observe(this.topico).subscribe((mensagem) => {
      this.processarMensagem(mensagem);
    });
  }

  processarMensagem(mensagem: any): void {
    this.dadosService.addHistoricoEntrada(mensagem);
  }
}
