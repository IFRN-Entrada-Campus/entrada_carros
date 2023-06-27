import { Component, OnInit } from '@angular/core';
import { ReqresmqttService } from '../reqresmqtt.service';

@Component({
  selector: 'app-mqtt',
  templateUrl: './mqtt.component.html',
  styleUrls: ['./mqtt.component.css']
})
export class MqttComponent implements OnInit{
  mensagensRecebidas: any[] = [];
  mensagemEnvio: any = '';
  
  constructor(private servicoMqtt: ReqresmqttService) {}

  ngOnInit(): void {
    this.servicoMqtt.connect();
    this.servicoMqtt.entrarNoTopico('carro77/pedido');
    this.servicoMqtt.mensagemRecebida.subscribe((message: any) => {
      this.mensagensRecebidas.push(message);
    });
  }

  mandarMensagem(): void {
    this.servicoMqtt.enviarMensagem('carro77/pedido', this.mensagemEnvio);
    this.mensagemEnvio = '';
  }
}
